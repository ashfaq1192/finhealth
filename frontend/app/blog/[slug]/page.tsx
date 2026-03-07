export const runtime = "edge";

import { supabase } from "@/lib/supabase";
import AdSlot from "@/components/AdSlot";
import { notFound } from "next/navigation";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

const CATEGORY_COLORS: Record<string, string> = {
  Trucking:    "bg-blue-100 text-blue-700 border-blue-200",
  Retail:      "bg-purple-100 text-purple-700 border-purple-200",
  "SBA Loans": "bg-green-100 text-green-700 border-green-200",
  Macro:       "bg-slate-100 text-slate-700 border-slate-200",
  Staffing:    "bg-orange-100 text-orange-700 border-orange-200",
};

const SCORE_COLORS: Record<string, string> = {
  Optimal:  "text-green-600 bg-green-50 border-green-200",
  Moderate: "text-amber-600 bg-amber-50 border-amber-200",
  Risky:    "text-orange-600 bg-orange-50 border-orange-200",
  Critical: "text-red-600 bg-red-50 border-red-200",
};

async function getPost(slug: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("date, title, slug, content, meta_description, category, score_id")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data;
}

async function getScore(scoreId: string) {
  const { data } = await supabase
    .from("daily_scores")
    .select("health_score, status_label, date")
    .eq("id", scoreId)
    .single();
  return data;
}

async function getRelatedPosts(category: string, excludeSlug: string) {
  const { data } = await supabase
    .from("blog_posts")
    .select("date, title, slug, meta_description")
    .eq("category", category)
    .neq("slug", excludeSlug)
    .order("date", { ascending: false })
    .limit(3);
  return data ?? [];
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
  return DOMPurify.sanitize(html);
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const [score, relatedPosts] = await Promise.all([
    post.score_id ? getScore(post.score_id) : Promise.resolve(null),
    getRelatedPosts(post.category, slug),
  ]);

  const safeHtml = sanitizeHtml(post.content);
  const categoryColor = CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-700 border-slate-200";
  const scoreColor = score ? (SCORE_COLORS[score.status_label] ?? "text-slate-700 bg-slate-50 border-slate-200") : "";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Article — main column */}
        <div className="lg:col-span-3">
          {/* Breadcrumb */}
          <nav className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
            <Link href="/" className="hover:text-slate-600">Home</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-slate-600">Analysis</Link>
            <span>›</span>
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="hover:text-slate-600"
            >
              {post.category}
            </Link>
          </nav>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Article header */}
            <div className="px-8 pt-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${categoryColor}`}>
                  {post.category}
                </span>
                <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
                <span className="text-xs text-slate-300">·</span>
                <span className="text-xs text-slate-400">{readingTime(post.content)} min read</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{post.title}</h1>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">{post.meta_description}</p>
            </div>

            {/* Ad slot */}
            <div className="px-8 py-4 border-b border-slate-100">
              <AdSlot visible slot="blog-post-top" />
            </div>

            {/* Article body */}
            <div className="px-8 py-6">
              <article
                className="prose prose-slate prose-sm max-w-none
                  prose-headings:font-bold prose-headings:text-slate-800
                  prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-li:text-slate-600 prose-strong:text-slate-800
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>

            {/* Bottom ad */}
            <div className="px-8 pb-6">
              <AdSlot visible slot="blog-post-bottom" />
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4">
                More {post.category} Analysis
              </p>
              <ul className="space-y-3">
                {relatedPosts.map((related) => (
                  <li key={related.slug}>
                    <Link
                      href={`/blog/${related.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <span className="text-slate-300 group-hover:text-blue-400 mt-0.5">→</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors leading-snug">
                          {related.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">{formatDate(related.date)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Score context widget */}
          {score && (
            <div className={`rounded-2xl border p-5 ${scoreColor}`}>
              <p className="text-xs font-bold tracking-widest uppercase opacity-60 mb-2">
                Score on this date
              </p>
              <div className="text-5xl font-black leading-none mb-1">{score.health_score}</div>
              <div className="text-sm font-bold">{score.status_label}</div>
              <div className="text-xs opacity-60 mt-1">{formatDate(score.date)}</div>
              <Link
                href="/"
                className="mt-3 inline-block text-xs font-semibold underline opacity-70 hover:opacity-100"
              >
                View today&apos;s score →
              </Link>
            </div>
          )}

          {/* Back to blog */}
          <Link
            href="/blog"
            className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors"
          >
            ← All analysis
          </Link>

          {/* Browse by sector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
              Browse by sector
            </p>
            <div className="space-y-1.5">
              {Object.entries(CATEGORY_COLORS).map(([cat, colors]) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`block text-xs font-semibold px-3 py-1.5 rounded-lg border ${colors} hover:opacity-80 transition-opacity`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
