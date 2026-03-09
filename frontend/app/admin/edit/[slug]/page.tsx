"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface PostFields {
  title: string;
  meta_description: string;
  content: string;
  hero_image_url: string;
}

export default function AdminEditPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<PostFields>({
    title: "",
    meta_description: "",
    content: "",
    hero_image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Restore session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_secret");
    if (stored) {
      setSecret(stored);
      setAuthed(true);
    }
  }, []);

  // Fetch post once authenticated
  useEffect(() => {
    if (!authed || !slug) return;
    setLoading(true);
    supabase
      .from("blog_posts")
      .select("title, meta_description, content, hero_image_url")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        setLoading(false);
        if (data) {
          setPost({
            title: data.title ?? "",
            meta_description: data.meta_description ?? "",
            content: data.content ?? "",
            hero_image_url: data.hero_image_url ?? "",
          });
        }
      });
  }, [authed, slug]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim()) return;
    sessionStorage.setItem("admin_secret", secret);
    setAuthed(true);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    setPost({ ...post, hero_image_url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    setSaving(true);
    setMsg(null);

    let heroImageUrl = post.hero_image_url;

    // Upload new image if selected
    if (imageFile) {
      const fd = new FormData();
      fd.append("image", imageFile);
      fd.append("slug", slug);
      try {
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "x-admin-secret": secret },
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          setMsg({ text: `Image upload failed: ${uploadData.error ?? "unknown error"}`, ok: false });
          setSaving(false);
          return;
        }
        heroImageUrl = uploadData.url;
      } catch {
        setMsg({ text: "Image upload failed. Check your connection.", ok: false });
        setSaving(false);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({ slug, ...post, hero_image_url: heroImageUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setPost((p) => ({ ...p, hero_image_url: heroImageUrl }));
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setMsg({ text: "Saved successfully.", ok: true });
      } else {
        setMsg({ text: data.error ?? "Save failed.", ok: false });
        if (res.status === 401) {
          sessionStorage.removeItem("admin_secret");
          setAuthed(false);
        }
      }
    } catch {
      setMsg({ text: "Network error. Please try again.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 w-full max-w-sm shadow-sm">
          <h1 className="text-lg font-bold text-slate-800 mb-1">Admin Access</h1>
          <p className="text-xs text-slate-400 mb-6">Enter your admin secret to edit this post.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading post…</p>
      </div>
    );
  }

  const displayImage = imagePreview ?? post.hero_image_url;

  /* ── Editor ── */
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Post</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{slug}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/blog/${slug}`)}
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← View post
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white rounded-lg px-5 py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {/* Status message */}
      {msg && (
        <div
          className={`mb-5 px-4 py-3 rounded-lg text-sm border ${
            msg.ok
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Hero Image */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Hero Image{" "}
            <span className="font-normal normal-case text-slate-400">(optional)</span>
          </label>

          {displayImage ? (
            <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-50" style={{ height: "220px" }}>
              <img
                src={displayImage}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center" style={{ height: "140px" }}>
              <p className="text-sm text-slate-400">No image — post will display without a hero image</p>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageSelect}
                className="hidden"
              />
              {displayImage ? "Replace image" : "Upload image from PC"}
            </label>

            {displayImage && (
              <button
                onClick={handleRemoveImage}
                className="text-sm text-red-400 hover:text-red-600 transition-colors"
              >
                Remove image
              </button>
            )}

            {imageFile && (
              <span className="text-xs text-slate-400">{imageFile.name} — save to apply</span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-3">
            Generate image with Gemini, download it, then upload here. JPEG/PNG/WebP. Leave empty for a clean text-only post.
          </p>
        </div>

        {/* Title */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Title
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Meta description */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Meta Description{" "}
            <span className="font-normal normal-case text-slate-400">
              ({post.meta_description.length}/155 chars)
            </span>
          </label>
          <input
            type="text"
            value={post.meta_description}
            onChange={(e) =>
              setPost({ ...post, meta_description: e.target.value.slice(0, 155) })
            }
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Shown under the title and in Google search results. End on a complete sentence.
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Content{" "}
            <span className="font-normal normal-case text-slate-400">(Markdown)</span>
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            rows={40}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          />
        </div>
      </div>
    </div>
  );
}
