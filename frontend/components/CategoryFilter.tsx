"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["All", "Trucking", "Retail", "SBA Loans", "Macro", "Staffing"];

const ACTIVE: Record<string, string> = {
  All:         "bg-slate-900 text-white",
  Trucking:    "bg-blue-600 text-white",
  Retail:      "bg-purple-600 text-white",
  "SBA Loans": "bg-green-600 text-white",
  Macro:       "bg-slate-600 text-white",
  Staffing:    "bg-orange-600 text-white",
};

export default function CategoryFilter({ selected }: { selected: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSelect(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat || (cat === "All" && selected === "All");
        return (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
              isActive
                ? `${ACTIVE[cat]} border-transparent`
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
