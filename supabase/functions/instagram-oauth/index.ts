const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const META_GRAPH_VERSION = "v23.0";

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const META_APP_ID = Deno.env.get("META_APP_ID")?.trim();
    const META_APP_SECRET = Deno.env.get("META_APP_SECRET")?.trim();

    if (!META_APP_ID || !META_APP_SECRET) {
      throw new Error("META_APP_ID or META_APP_SECRET not configured");
    }

    if (!/^\d{8,20}$/.test(META_APP_ID)) {
      throw new Error("META_APP_ID format is invalid. It must be a numeric App ID from Meta.");
    }

    const payload = await req.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid JSON body");
    }

    const { action, code, redirect_uri } = payload as {
      action?: string;
      code?: string;
      redirect_uri?: string;
    };

    if (action !== "get_login_url" && action !== "exchange_code") {
      throw new Error("Invalid action");
    }

    if (!redirect_uri || typeof redirect_uri !== "string") {
      throw new Error("Missing or invalid redirect_uri");
    }

    let redirectUrl: URL;
    try {
      redirectUrl = new URL(redirect_uri);
    } catch {
      throw new Error("redirect_uri inválida");
    }

    if (redirectUrl.protocol !== "https:") {
      throw new Error("redirect_uri must use https");
    }

    const appValidationRes = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/oauth/access_token?client_id=${encodeURIComponent(META_APP_ID)}&client_secret=${encodeURIComponent(META_APP_SECRET)}&grant_type=client_credentials`
    );
    const appValidationData = await appValidationRes.json();

    if (!appValidationRes.ok || appValidationData?.error || !appValidationData?.access_token) {
      const metaError = appValidationData?.error?.message || "Não foi possível validar o App no Meta.";
      throw new Error(`Meta App inválido ou indisponível: ${metaError}`);
    }

    if (action === "get_login_url") {
      const scopes = [
        "instagram_basic",
        "instagram_content_publish",
        "pages_show_list",
        "pages_read_engagement",
        "business_management",
      ].join(",");

      const loginUrl = new URL(`https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth`);
      loginUrl.searchParams.set("client_id", META_APP_ID);
      loginUrl.searchParams.set("redirect_uri", redirect_uri);
      loginUrl.searchParams.set("scope", scopes);
      loginUrl.searchParams.set("response_type", "code");

      return jsonResponse({ login_url: loginUrl.toString() });
    }

    if (!code || typeof code !== "string") {
      throw new Error("Missing code or redirect_uri");
    }

    const tokenRes = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/oauth/access_token?client_id=${encodeURIComponent(META_APP_ID)}&redirect_uri=${encodeURIComponent(redirect_uri)}&client_secret=${encodeURIComponent(META_APP_SECRET)}&code=${encodeURIComponent(code)}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData?.error) {
      throw new Error(tokenData?.error?.message || "Failed to exchange code");
    }

    const shortToken = tokenData.access_token;

    const longRes = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/oauth/access_token?grant_type=fb_exchange_token&client_id=${encodeURIComponent(META_APP_ID)}&client_secret=${encodeURIComponent(META_APP_SECRET)}&fb_exchange_token=${encodeURIComponent(shortToken)}`
    );
    const longData = await longRes.json();
    if (!longRes.ok || longData?.error) {
      throw new Error(longData?.error?.message || "Failed to exchange long-lived token");
    }

    const longToken = longData.access_token || shortToken;

    const pagesRes = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/me/accounts?access_token=${encodeURIComponent(longToken)}`
    );
    const pagesData = await pagesRes.json();
    if (!pagesRes.ok || pagesData?.error) {
      throw new Error(pagesData?.error?.message || "Failed to fetch Facebook Pages");
    }

    const accounts: Array<{
      account_type: "facebook" | "instagram";
      account_name: string;
      account_id: string;
      access_token: string;
      account_username: string | null;
    }> = [];

    for (const page of pagesData.data || []) {
      accounts.push({
        account_type: "facebook",
        account_name: page.name,
        account_id: page.id,
        access_token: page.access_token,
        account_username: null,
      });

      const igRes = await fetch(
        `https://graph.facebook.com/${META_GRAPH_VERSION}/${page.id}?fields=instagram_business_account&access_token=${encodeURIComponent(page.access_token)}`
      );
      const igData = await igRes.json();

      if (!igRes.ok || igData?.error || !igData.instagram_business_account?.id) {
        continue;
      }

      const igId = igData.instagram_business_account.id;
      const igInfoRes = await fetch(
        `https://graph.facebook.com/${META_GRAPH_VERSION}/${igId}?fields=username,name&access_token=${encodeURIComponent(page.access_token)}`
      );
      const igInfo = await igInfoRes.json();

      if (!igInfoRes.ok || igInfo?.error) {
        continue;
      }

      accounts.push({
        account_type: "instagram",
        account_name: igInfo.name || page.name,
        account_id: igId,
        access_token: page.access_token,
        account_username: igInfo.username || null,
      });
    }

    return jsonResponse({ accounts });
  } catch (err) {
    console.error("instagram-oauth error:", err);
    return jsonResponse(
      {
        error: err instanceof Error ? err.message : "Unexpected error",
      },
      500
    );
  }
});
