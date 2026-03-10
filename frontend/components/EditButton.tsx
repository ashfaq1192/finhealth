"use client";

import { useEffect, useState } from "react";

export default function EditButton({ slug }: { slug: string }) {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => r.json())
      .then((d) => setAdmin(d.admin === true))
      .catch(() => {});
  }, []);

  if (!admin) return null;

  return (
    <div className="mt-4 text-right">
      <a
        href={`/admin/edit/${slug}`}
        className="text-[11px] text-slate-300 hover:text-slate-400 transition-colors"
      >
        ✏ Edit
      </a>
    </div>
  );
}
