export const runtime = "edge";

import { supabase } from "@/lib/supabase";
import BlogList from "@/components/BlogList";
import AdSlot from "@/components/AdSlot";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | US Business Funding Climate Score",
  description:
    "Daily economic analysis and insights on small business funding conditions in the United States.",
};

async function getBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("date, title, slug, meta_description, category")
    .order("date", { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data;
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Funding Climate Insights
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Daily economic analysis for US small business owners.
      </p>
      <AdSlot visible slot="blog-index-top" />
      <BlogList posts={posts} />
    </div>
  );
}
