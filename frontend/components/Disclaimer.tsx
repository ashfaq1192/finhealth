import Link from "next/link";

export default function Disclaimer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 text-xs py-4 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-center sm:text-left">
          <span className="font-semibold text-slate-300">Disclaimer:</span> This score
          is an AI-generated economic indicator for educational purposes only. We are not
          a financial institution.{" "}
          <Link href="/legal" className="text-slate-400 underline hover:text-slate-200 transition-colors">
            Not financial advice.
          </Link>
        </p>
        <nav className="flex items-center gap-4 flex-shrink-0">
          <Link href="/about" className="hover:text-slate-200 transition-colors">About</Link>
          <Link href="/methodology" className="hover:text-slate-200 transition-colors">Methodology</Link>
          <Link href="/legal" className="hover:text-slate-200 transition-colors">Legal</Link>
        </nav>
      </div>
    </footer>
  );
}
