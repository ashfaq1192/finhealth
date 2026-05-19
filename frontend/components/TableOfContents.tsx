"use client";

import { useEffect, useState } from "react";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    function onScroll() {
      const scrollY = window.scrollY + 120;
      let active = headings[0]?.id ?? "";
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) active = id;
      }
      setActiveId(active);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-4">
      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">
        On this page
      </p>
      <nav>
        <ul className="space-y-1.5">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block text-xs leading-snug transition-colors ${
                  level === 3 ? "pl-3 border-l border-slate-100" : ""
                } ${
                  activeId === id
                    ? "text-blue-600 font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(id);
                }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
