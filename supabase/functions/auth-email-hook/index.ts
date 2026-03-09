import { verifyWebhookSignature } from "@lovable.dev/webhooks-js";
import { sendLovableEmail } from "@lovable.dev/email-js";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import SignupEmail from "../_shared/email-templates/signup.tsx";
import RecoveryEmail from "../_shared/email-templates/recovery.tsx";
import InviteEmail from "../_shared/email-templates/invite.tsx";
import MagicLinkEmail from "../_shared/email-templates/magic-link.tsx";
import EmailChangeEmail from "../_shared/email-templates/email-change.tsx";
import ReauthenticationEmail from "../_shared/email-templates/reauthentication.tsx";
import React from "react";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") ?? "";
const DEFAULT_APP_URL = Deno.env.get("APP_BASE_URL") ?? "https://postagensfacilty.lovable.app";
const DEFAULT_APP_HOSTNAME = (() => {
  try {
    return new URL(DEFAULT_APP_URL).hostname;
  } catch {
    return "postagensfacilty.lovable.app";
  }
})();

const sanitizeRedirectUrl = (redirectUrl?: string) => {
  try {
    if (!redirectUrl) return DEFAULT_APP_URL;
    const parsed = new URL(redirectUrl);
    const isHttps = parsed.protocol === "https:";
    const isLovableDomain = parsed.hostname.endsWith(".lovable.app");
    const isPrimaryDomain = parsed.hostname === DEFAULT_APP_HOSTNAME;
    return isHttps && (isLovableDomain || isPrimaryDomain) ? parsed.toString() : DEFAULT_APP_URL;
  } catch {
    return DEFAULT_APP_URL;
  }
};

const templateMap: Record<string, (props: Record<string, string>) => React.ReactElement> = {
  signup: (props) => React.createElement(SignupEmail, props as any),
  recovery: (props) => React.createElement(RecoveryEmail, props as any),
  invite: (props) => React.createElement(InviteEmail, props as any),
  magiclink: (props) => React.createElement(MagicLinkEmail, props as any),
  email_change: (props) => React.createElement(EmailChangeEmail, props as any),
  reauthentication: (props) => React.createElement(ReauthenticationEmail, props as any),
};

const subjectMap: Record<string, string> = {
  signup: "Confirme seu cadastro no PostaFácil",
  recovery: "Redefinir sua senha — PostaFácil",
  invite: "Você foi convidado para o PostaFácil",
  magiclink: "Seu link de acesso — PostaFácil",
  email_change: "Confirme a troca de email — PostaFácil",
  reauthentication: "Código de verificação — PostaFácil",
};

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-lovable-signature");
    const timestamp = req.headers.get("x-lovable-timestamp") ?? "";
    const hasSignatureHeaders = Boolean(signature && timestamp);

    // Verify signature when headers are present
    if (hasSignatureHeaders) {
      const isValid = await verifyWebhookSignature({
        signedPayload: `${timestamp}.${body}`,
        signature,
        secret: LOVABLE_API_KEY,
      });
      if (!isValid) {
        console.error("Invalid webhook signature");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const event = JSON.parse(body);

    // Determine email type from various possible payload structures
    const email_data = event.email_data || event.data;
    const type = email_data?.email_action_type || event.email_type || event.type || "";

    // If no email_data, this is a health check/setup ping - just confirm support
    if (!email_data) {
      const templateFn = templateMap[type];
      if (templateFn) {
        console.log(`Health check for type '${type}': template found`);
      } else {
        console.log(`Health check for unknown type '${type}'`);
      }

      return new Response(JSON.stringify({ success: true, type }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Real email events must be signed
    if (!hasSignatureHeaders) {
      console.error("Unsigned real email event blocked");
      return new Response(JSON.stringify({ error: "Missing webhook signature" }), { status: 401 });
    }

    console.log("Processing email event:", JSON.stringify({ type, recipient: email_data.recipient }));

    const templateFn = templateMap[type];
    if (!templateFn) {
      console.error(`Unknown email type: ${type}`);
      return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), { status: 400 });
    }

    const token = email_data.token || "";
    const token_hash = email_data.token_hash || "";
    const redirect_to = sanitizeRedirectUrl(email_data.redirect_to || "");

    let confirmationUrl = email_data.confirmation_url || "";

    if (confirmationUrl) {
      try {
        const parsedConfirmation = new URL(confirmationUrl);
        const existingRedirectTo = parsedConfirmation.searchParams.get("redirect_to") || "";
        parsedConfirmation.searchParams.set("redirect_to", sanitizeRedirectUrl(existingRedirectTo));
        confirmationUrl = parsedConfirmation.toString();
      } catch {
        confirmationUrl = "";
      }
    }

    if (!confirmationUrl) {
      confirmationUrl = `${redirect_to}?token=${token_hash}&type=${type}`;
    }

    const props: Record<string, string> = {
      confirmationUrl,
      siteName: "PostaFácil",
      siteUrl: "https://coconudi.com",
      recipient: email_data.recipient || email_data.email || "",
      token,
      newEmail: email_data.new_email || "",
    };

    const element = templateFn(props);
    const html = await renderAsync(element);

    const recipient = email_data.recipient || email_data.email || "";
    const apiBaseUrl = event.callback_url
      ? event.callback_url.replace(/\/[^/]*$/, "")
      : "https://api.lovable.dev";
    const runId = event.run_id || crypto.randomUUID();

    await sendLovableEmail(
      {
        run_id: runId,
        to: recipient,
        from: "PostaFácil <noreply@notify.coconudi.com>",
        subject: subjectMap[type] || "PostaFácil",
        html,
        text: "",
        purpose: "transactional",
      },
      { apiKey: LOVABLE_API_KEY, apiBaseUrl },
    );

    console.log("Email sent successfully to:", recipient);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Hook error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
