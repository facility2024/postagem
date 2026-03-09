import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch scheduled posts that are due
    const { data: posts, error } = await supabase
      .from("scheduled_posts")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_at", new Date().toISOString());

    if (error) throw error;

    console.log(`[Worker] ${posts?.length || 0} posts to process`);

    const results = [];

    for (const post of posts || []) {
      let allSuccess = true;
      const accountIds = post.account_ids || [];

      for (const accountId of accountIds) {
        const { data: account } = await supabase
          .from("social_accounts")
          .select("*")
          .eq("id", accountId)
          .single();

        if (!account) {
          console.log(`[Worker] Account ${accountId} not found, skipping`);
          continue;
        }

        let success = false;

        try {
          if (account.account_type === "instagram") {
            success = await postToInstagram(post, account);
          } else if (account.account_type === "facebook") {
            success = await postToFacebook(post, account);
          }

          await supabase.from("post_logs").insert({
            scheduled_post_id: post.id,
            social_account_id: account.id,
            network: account.account_type,
            success,
            response_data: {},
          });
        } catch (err) {
          await supabase.from("post_logs").insert({
            scheduled_post_id: post.id,
            social_account_id: account.id,
            network: account.account_type,
            success: false,
            error_message: (err as Error).message,
          });
        }

        if (!success) allSuccess = false;
      }

      await supabase
        .from("scheduled_posts")
        .update({
          status: allSuccess ? "posted" : "failed",
          posted_at: allSuccess ? new Date().toISOString() : null,
          error_message: allSuccess ? "" : "Falha em uma ou mais contas",
        })
        .eq("id", post.id);

      results.push({ id: post.id, success: allSuccess });
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function postToInstagram(post: any, account: any): Promise<boolean> {
  const igAccountId = account.account_id;
  const token = account.access_token;

  let mediaPayload: Record<string, string> = {
    caption: post.description,
    access_token: token,
  };

  if (post.post_type === "reel") {
    mediaPayload.media_type = "VIDEO";
    mediaPayload.video_url = post.video_url;
  } else {
    mediaPayload.image_url = post.image_url;
  }

  // Step 1: Create media container
  const mediaRes = await fetch(
    `https://graph.instagram.com/v18.0/${igAccountId}/media`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mediaPayload),
    }
  );
  const mediaData = await mediaRes.json();
  if (mediaData.error) throw new Error(mediaData.error.message);

  // Step 2: Publish
  const pubRes = await fetch(
    `https://graph.instagram.com/v18.0/${igAccountId}/media_publish`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: mediaData.id,
        access_token: token,
      }),
    }
  );
  const pubData = await pubRes.json();
  if (pubData.error) throw new Error(pubData.error.message);

  return true;
}

async function postToFacebook(post: any, account: any): Promise<boolean> {
  const pageId = account.account_id;
  const token = account.access_token;

  const payload: Record<string, string> = {
    message: post.description,
    access_token: token,
  };

  if (post.image_url) {
    payload.picture = post.image_url;
    payload.link = post.image_url;
  }

  const res = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/feed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  return true;
}
