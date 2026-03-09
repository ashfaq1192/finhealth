export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, title, meta_description, content, hero_image_url } = await req.json();
  if (!slug || !content) {
    return NextResponse.json({ error: "slug and content are required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      meta_description: meta_description?.slice(0, 155) ?? "",
      content,
      hero_image_url: hero_image_url ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
