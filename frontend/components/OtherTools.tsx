import Link from "next/link";

interface Tool {
  href: string;
  title: string;
  desc: string;
  accent: string;
  iconPath: string;
}

const TOOLS: Tool[] = [
  {
    href: "/tools/invoice-factoring-calculator",
    title: "Invoice Factoring Calculator",
    desc: "Net cash received, effective APR, and total cost of factoring.",
    accent: "border-blue-400 text-blue-600",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    href: "/tools/mca-calculator",
    title: "MCA True Cost Calculator",
    desc: "Convert your factor rate into a real APR before you sign.",
    accent: "border-amber-400 text-amber-600",
    iconPath: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  },
  {
    href: "/tools/break-even-calculator",
    title: "Break-Even Calculator",
    desc: "Units, revenue, contribution margin, and margin of safety.",
    accent: "border-violet-400 text-violet-600",
    iconPath: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
  {
    href: "/tools/cash-flow-runway",
    title: "Cash Flow Runway",
    desc: "Months of runway left and projected cash-out date.",
    accent: "border-sky-400 text-sky-600",
    iconPath: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  },
  {
    href: "/tools/loan-comparison",
    title: "Loan Comparison Tool",
    desc: "Compare SBA, MCA, factoring, and credit lines side-by-side.",
    accent: "border-indigo-400 text-indigo-600",
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

interface OtherToolsProps {
  currentHref: string;
}

export default function OtherTools({ currentHref }: OtherToolsProps) {
  const others = TOOLS.filter((t) => t.href !== currentHref).slice(0, 4);

  return (
    <div className="mb-6">
      <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">More Free Tools</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {others.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 border-l-4 ${tool.accent.split(" ")[0]} hover:shadow-sm transition-shadow`}
          >
            <svg
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tool.accent.split(" ")[1]}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={tool.iconPath} />
            </svg>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-0.5">
                {tool.title}
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
