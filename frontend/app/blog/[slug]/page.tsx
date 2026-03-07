export const runtime = "edge";

import { supabase } from "@/lib/supabase";
import AdSlot from "@/components/AdSlot";
import { notFound } from "next/navigation";
import { marked } from "marked";
import DOMPurify from "dompurify";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("date, title, slug, content, meta_description, category")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} | US Business Funding Climate Score`,
    description: post.meta_description,
  };
}

function sanitizeHtml(markdown: string): string {
  const html = marked.parse(markdown) as string;
  // Cloudflare Workers edge runtime provides native DOM APIs — DOMPurify works directly
  return DOMPurify.sanitize(html);
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const safeHtml = sanitizeHtml(post.content);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
        {post.category}
      </span>
      <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">
        {post.title}
      </h1>
      <p className="text-sm text-gray-400 mb-6">{formatDate(post.date)}</p>
      <AdSlot visible slot="blog-post-top" />
      <article
        className="prose prose-sm max-w-none mt-6"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
      <AdSlot visible slot="blog-post-bottom" />
    </div>
  );
}
