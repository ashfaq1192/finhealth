export const runtime = "edge";

import { supabase } from "@/lib/supabase";
import AdSlot from "@/components/AdSlot";
import CategoryFilter from "@/components/CategoryFilter";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Small Business Funding Analysis | US Business Funding Climate Score",
  description:
    "Expert analysis of US small business funding conditions across trucking, retail, SBA loans, staffing, and macro sectors. Updated daily.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Trucking:    "bg-blue-100 text-blue-700",
  Retail:      "bg-purple-100 text-purple-700",
  "SBA Loans": "bg-green-100 text-green-700",
  Macro:       "bg-slate-100 text-slate-700",
  Staffing:    "bg-orange-100 text-orange-700",
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

interface Props {
  searchParams: Promise<{ category?: string }>;
}

async function getPosts(category?: string) {
  let query = supabase
    .from("blog_posts")
    .select("date, title, slug, meta_description, category")
    .order("date", { ascending: false })
    .limit(50);

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function BlogIndexPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const selected = category ?? "All";
  const posts = await getPosts(selected);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Funding Climate Analysis</h1>
        <p className="text-slate-500 text-sm mt-1">
          Daily economic insights for US small business owners — organized by sector.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Category filter */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
            <Suspense>
              <CategoryFilter selected={selected} />
            </Suspense>
          </div>

          {/* Post list */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {posts.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                No posts in this category yet — check back soon.
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex gap-4 p-5 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-600"}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(post.date)}</span>
                    </div>
                    <h2 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-1">
                      {post.title}
                    </h2>
                    <p className="text-xs text-slate-500 line-clamp-2">{post.meta_description}</p>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-400 text-lg self-center flex-shrink-0">→</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <AdSlot visible slot="blog-index-sidebar" />

          {/* About card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
              About This Blog
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Each post explains what current macro-economic conditions mean for a specific
              industry. We publish one sector-focused analysis every day.
            </p>
            <div className="mt-4 space-y-1.5">
              {["Trucking", "Retail", "SBA Loans", "Macro", "Staffing"].map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg ${CATEGORY_COLORS[cat] ?? ""} hover:opacity-80 transition-opacity`}
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
