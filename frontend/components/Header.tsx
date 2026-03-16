import Link from "next/link";
import NavLinks from "@/components/NavLinks";

export default function Header() {
  return (
    <header className="bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="text-xs font-semibold tracking-widest text-blue-400 uppercase">
            US Small Business
          </span>
          <span className="text-lg font-bold tracking-tight">
            Funding Climate Score
          </span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
