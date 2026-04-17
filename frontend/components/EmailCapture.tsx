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
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-2xl mb-1">✓</p>
        <p className="text-green-700 font-bold text-sm">You&apos;re on the list!</p>
        <p className="text-green-600 text-xs mt-1 leading-relaxed">
          Daily Funding Climate Score delivered to your inbox every morning. Free.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Copy */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-widest uppercase text-blue-300 mb-1">
            Free Daily Digest
          </p>
          <p className="text-base font-bold leading-snug mb-1">
            Get the score before the market opens.
          </p>
          <p className="text-sm text-blue-200 leading-relaxed">
            Prime rate changes, credit tightening signals, and today&apos;s funding
            climate — in your inbox every morning at 9 AM ET. No spam, ever.
          </p>
        </div>

        {/* Form */}
        <div className="sm:w-64 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@business.com"
              required
              className="w-full text-sm rounded-xl border border-blue-500 bg-blue-800/50 text-white placeholder-blue-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-shadow"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full text-sm font-bold bg-white text-blue-700 px-4 py-2.5 rounded-xl hover:bg-blue-50 disabled:opacity-50 transition-colors"
            >
              {status === "loading" ? "Subscribing…" : "Subscribe — it's free"}
            </button>
          </form>
          {status === "error" && (
            <p className="text-xs text-red-300 mt-2">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  );
}
