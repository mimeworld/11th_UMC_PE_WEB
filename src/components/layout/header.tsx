import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-950"
          aria-label="UMC Movie 홈"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-slate-950 text-xs text-white">
            U
          </span>
          UMC Movie
        </Link>

        <Link
          to="/search"
          aria-label="영화 검색"
          className="flex size-9 items-center justify-center rounded-md bg-blue-600 transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <img src="/icons/search.svg" alt="" className="size-4 brightness-0 invert" />
        </Link>
      </div>
    </header>
  );
}
