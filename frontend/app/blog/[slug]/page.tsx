export const runtime = "edge";

import { supabase } from "@/lib/supabase";
import AdSlot from "@/components/AdSlot";
import { notFound } from "next/navigation";
import { marked } from "marked";
import sanitizeHtmlLib from "sanitize-html";
import Link from "next/link";
import type { Metadata } from "next";
import EditButton from "@/components/EditButton";

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
    .select("date, title, slug, content, meta_description, category, score_id, hero_image_url")
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  // Prefer uploaded hero image (direct URL); fall back to first markdown image (proxied)
  const ogImage = post.hero_image_url || proxyImage(extractFirstImage(post.content), siteUrl);

  return {
    title: `${post.title} | US Business Funding Climate Score`,
    description: post.meta_description,
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: "article",
      publishedTime: post.date,
      url: canonicalUrl,
      siteName: "US Business Funding Climate Score",
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 628, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

function sanitizeHtml(markdown: string, stripFirstImage = false): string {
  const html = marked.parse(markdown) as string;
  let clean = sanitizeHtmlLib(html, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(["h1", "h2", "h3", "img"]),
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      // Override after spread so our entries take precedence
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
    },
    allowedSchemesByTag: { img: ["https"] },
  });
  // Strip leading H1 — the title is already shown in the article header
  clean = clean
    .replace(/^\s*<h1[^>]*>.*?<\/h1>\s*/i, "")
    .replace(/^(\s*<p>\s*<\/p>\s*)+/, "");
  // Strip the first image — shown separately as hero above the article
  if (stripFirstImage) {
    clean = clean
      .replace(/<p>\s*<img\b[^>]*>\s*<\/p>/, "")
      .replace(/<img\b[^>]*>/, "");
  }
  // Strip AI-generated word count lines ("The word count for this content is X words.")
  clean = clean.replace(/<p>\s*[Tt]he word count for this content is \d[\d,]* words\.?\s*<\/p>/g, "");
  return clean;
}

function extractFirstImage(markdown: string): string | null {
  const match = markdown.match(/!\[.*?\]\((https:\/\/[^\s)]+)\)/);
  return match ? match[1] : null;
}

function proxyImage(url: string | null, siteUrl = ""): string | null {
  if (!url) return null;
  return `${siteUrl}/api/img?url=${encodeURIComponent(url)}`;
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

  // Prefer uploaded hero image; fall back to first markdown image (proxied to avoid CORS/hotlink issues)
  const heroSrc = post.hero_image_url || proxyImage(extractFirstImage(post.content));
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"}/blog/${post.slug}`;

  // Strip the first markdown image from content only when a hero is being shown
  const safeHtml = sanitizeHtml(post.content, !!heroSrc);
  const categoryColor = CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-700 border-slate-200";
  const scoreColor = score ? (SCORE_COLORS[score.status_label] ?? "text-slate-700 bg-slate-50 border-slate-200") : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description,
    datePublished: post.date,
    dateModified: post.date,
    url: canonicalUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: {
      "@type": "Person",
      name: "Ashfaq Ahmad",
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"}/about`,
      jobTitle: "M.Phil Economics",
    },
    publisher: {
      "@type": "Organization",
      name: "US Business Funding Climate Score",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com",
    },
    articleSection: post.category,
    keywords: `small business funding, ${post.category.toLowerCase()}, business loans, SBA loans, prime rate`,
    ...(heroSrc ? { image: heroSrc } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            {/* Article header — title first for SEO keyword primacy */}
            <div className="px-8 pt-8 pb-6">
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

            {/* Hero image — after title so H1 keyword is indexed first */}
            {heroSrc && (
              <div className="w-full overflow-hidden bg-slate-100 border-t border-b border-slate-100" style={{ height: "340px" }}>
                <img
                  src={heroSrc}
                  alt={post.title}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>
            )}

            {/* Divider shown only when there is no image */}
            {!heroSrc && <div className="border-t border-slate-100" />}

            {/* Article body */}
            <div className="px-8 py-6">
              <article
                className="prose prose-slate max-w-none
                  prose-headings:font-bold prose-headings:text-slate-900
                  prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2
                  prose-h3:text-base prose-h3:font-semibold prose-h3:text-slate-800 prose-h3:mt-8 prose-h3:mb-2 prose-h3:border-l-4 prose-h3:border-blue-400 prose-h3:pl-3 prose-h3:not-italic
                  prose-p:text-slate-700 prose-p:leading-7 prose-p:text-base
                  prose-li:text-slate-700 prose-li:leading-7
                  prose-strong:text-slate-900 prose-strong:font-semibold
                  prose-a:text-blue-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-slate-100 prose-code:text-slate-700 prose-code:px-1 prose-code:rounded prose-code:text-sm
                  prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:rounded-r
                  prose-ul:my-4 prose-ol:my-4
                  [&_p:empty]:hidden"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>

            {/* Ad slot — after article body */}
            <div className="px-8 pb-6 border-t border-slate-100 pt-6">
              <AdSlot visible slot="blog-post-bottom" />
            </div>
          </div>

          {/* Admin edit link — only visible when logged in as admin */}
          <EditButton slug={post.slug} />

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
    </>
  );
}
