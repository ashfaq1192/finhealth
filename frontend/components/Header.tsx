import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
            🇺🇸 US Small Business
          </span>
          <span className="text-lg font-bold tracking-tight">
            Funding Climate Score
          </span>
        </Link>
        <nav className="flex gap-5 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Score
          </Link>
          <Link href="/blog" className="hover:text-white transition-colors">
            Analysis
          </Link>
          <Link href="/methodology" className="hover:text-white transition-colors">
            Methodology
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
