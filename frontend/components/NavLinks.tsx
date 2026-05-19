"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const LINKS = [
  { href: "/",              label: "Score",       exact: true  },
  { href: "/blog",          label: "Analysis",    exact: false },
  { href: "/tools",         label: "Tools",       exact: false },
  { href: "/score-history", label: "History",     exact: false },
  { href: "/methodology",   label: "Methodology", exact: false },
  { href: "/about",         label: "About",       exact: false },
  { href: "/contact",       label: "Contact",     exact: false },
];

export default function NavLinks() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close menu on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className="hidden lg:flex gap-5 text-sm font-medium text-slate-300">
        {LINKS.map(({ href, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`transition-colors hover:text-white pb-0.5 border-b-2 ${
                isActive ? "text-white border-blue-400" : "border-transparent"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── Mobile hamburger button ── */}
      <button
        className="lg:hidden flex flex-col justify-center gap-[5px] w-9 h-9 rounded-lg hover:bg-white/10 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span
          className={`block mx-auto w-5 h-0.5 bg-white rounded-full origin-center transition-all duration-200 ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`block mx-auto w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${
            open ? "opacity-0 scale-x-0" : ""
          }`}
        />
        <span
          className={`block mx-auto w-5 h-0.5 bg-white rounded-full origin-center transition-all duration-200 ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* ── Mobile dropdown ── */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-[57px] bg-black/40 z-30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Menu panel */}
          <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-900 border-t border-slate-700/60 z-40 shadow-2xl">
            <nav className="max-w-5xl mx-auto px-4 py-3 flex flex-col">
              {LINKS.map(({ href, label, exact }) => {
                const isActive = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
