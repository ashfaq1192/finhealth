import Link from "next/link";

interface Post {
  title: string;
  slug: string;
  category: string;
  meta_description: string;
  date: string;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; badge: string }> = {
  Trucking:  { icon: "🚚", color: "from-blue-600 to-blue-800",   badge: "bg-blue-100 text-blue-800" },
  Retail:    { icon: "🏪", color: "from-purple-600 to-purple-800", badge: "bg-purple-100 text-purple-800" },
  "SBA Loans": { icon: "🏦", color: "from-green-600 to-green-800",  badge: "bg-green-100 text-green-800" },
  Macro:     { icon: "📈", color: "from-slate-600 to-slate-800",  badge: "bg-slate-100 text-slate-700" },
  Staffing:  { icon: "👥", color: "from-orange-600 to-orange-800", badge: "bg-orange-100 text-orange-800" },
};

const DEFAULT_CONFIG = { icon: "📊", color: "from-slate-600 to-slate-800", badge: "bg-slate-100 text-slate-700" };

export default function TodaysFocus({ post }: { post: Post }) {
  const cfg = CATEGORY_CONFIG[post.category] ?? DEFAULT_CONFIG;

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${cfg.color} text-white p-6`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{cfg.icon}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
          {post.category}
        </span>
        <span className="text-xs text-white/60 ml-auto">Today&apos;s Analysis</span>
      </div>

      <h3 className="text-base font-bold leading-snug mb-2">{post.title}</h3>
      <p className="text-sm text-white/75 leading-relaxed line-clamp-2 mb-4">
        {post.meta_description}
      </p>

      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-full"
      >
        Read analysis <span>→</span>
      </Link>
    </div>
  );
}
