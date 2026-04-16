"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/",            label: "Score",       exact: true },
  { href: "/blog",        label: "Analysis",    exact: false },
  { href: "/tools",       label: "Tools",       exact: false },
  { href: "/methodology", label: "Methodology", exact: false },
  { href: "/about",       label: "About",       exact: false },
  { href: "/contact",     label: "Contact",     exact: false },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-5 text-sm font-medium text-slate-300">
      {LINKS.map(({ href, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`transition-colors hover:text-white pb-0.5 ${
              isActive
                ? "text-white border-b-2 border-blue-400"
                : "border-b-2 border-transparent"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
