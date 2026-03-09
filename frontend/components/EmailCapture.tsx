"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong — please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <p className="text-green-700 font-bold text-sm">✓ You&apos;re on the list!</p>
        <p className="text-green-600 text-xs mt-1 leading-relaxed">
          Daily Funding Climate Score delivered every morning, free.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
      <p className="text-[10px] font-bold tracking-widest text-blue-500 uppercase mb-1">
        Daily Score Digest
      </p>
      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
        Get the Funding Climate Score in your inbox every morning. Free, no spam.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          required
          className="flex-1 text-xs rounded-xl border border-slate-200 bg-white px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="text-xs font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl
                     hover:bg-blue-700 disabled:opacity-50 transition-colors whitespace-nowrap
                     flex-shrink-0"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-600 mt-2">{errorMsg}</p>
      )}
    </div>
  );
}
