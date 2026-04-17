export const runtime = "edge";

import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request): Promise<Response> {
  let email: string;
  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // RFC 5322 simplified: local@domain.tld — catches "test@.com", "test@com", "@foo.com"
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailRe.test(email)) {
    return Response.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (email.length > 254) {
    return Response.json({ error: "Email address is too long." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return Response.json({ error: "Service unavailable." }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { error } = await supabase
    .from("subscribers")
    .upsert({ email, confirmed: true }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error("[subscribe] Supabase error:", error.message);
    return Response.json({ error: "Could not save subscription. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
