"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  // Restore session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_secret");
    if (stored) {
      setSecret(stored);
      setAuthed(true);
    }
  }, []);

  // Fetch posts once authenticated
  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    supabase
      .from("blog_posts")
      .select("slug, title, date, category")
      .order("date", { ascending: false })
      .then(({ data }) => {
        setLoading(false);
        setPosts(data ?? []);
      });
  }, [authed]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) return;
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    if (!res.ok) {
      setError("Incorrect secret. Try again.");
      return;
    }

    sessionStorage.setItem("admin_secret", secret);
    setAuthed(true);
  }

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 w-full max-w-sm shadow-sm">
          <h1 className="text-lg font-bold text-slate-800 mb-1">Admin</h1>
          <p className="text-xs text-slate-400 mb-6">Enter your admin secret to continue.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading posts…</p>
      </div>
    );
  }

  /* ── Dashboard ── */
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">{posts.length} posts</p>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("admin_secret");
            setAuthed(false);
            setSecret("");
          }}
          className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {posts.map((post) => (
          <div key={post.slug} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{post.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {post.category} &nbsp;·&nbsp; {post.date}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-4 shrink-0">
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors"
              >
                View
              </a>
              <a
                href={`/admin/edit/${post.slug}`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </a>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-slate-400">No posts found.</div>
        )}
      </div>
    </div>
  );
}
