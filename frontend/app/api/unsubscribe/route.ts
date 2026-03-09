export const runtime = "edge";

import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";

  if (!token) {
    return new Response("Invalid unsubscribe link.", { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return new Response("Service unavailable.", { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { error } = await supabase
    .from("subscribers")
    .delete()
    .eq("unsubscribe_token", token);

  if (error) {
    console.error("[unsubscribe] Supabase error:", error.message);
    return new Response("Could not process unsubscribe request.", { status: 500 });
  }

  // Redirect to homepage with a confirmation message via query param
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "/";
  return Response.redirect(`${siteUrl}?unsubscribed=1`, 302);
}

// One-click unsubscribe (RFC 8058) — email clients POST to this endpoint
export async function POST(req: Request): Promise<Response> {
  return GET(req);
}
