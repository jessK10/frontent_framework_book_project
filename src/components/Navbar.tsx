// src/components/Navbar.tsx
import React, { useEffect, useRef } from "react";
import { BookOpen, Search } from "lucide-react";

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void; // optional (press Enter)
  placeholder?: string;
};

export default function Navbar({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search books or authors…",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <nav
        ref={ref}
        className="relative w-full bg-[#0b1220]/75 backdrop-blur-2xl border-b border-white/10"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(600px_200px_at_var(--mx,_50%)_var(--my,_0%),rgba(56,189,248,.07),transparent_60%)]" />
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="grid place-items-center rounded-lg bg-cyan-500/10 p-2 ring-1 ring-cyan-400/30">
              <BookOpen className="h-5 w-5 text-cyan-300" />
            </div>
            <span className="text-lg font-semibold tracking-wide select-none">
              <span className="text-cyan-300">BOOK</span>
              <span className="text-violet-300">SHOW</span>
            </span>
          </div>

          {/* Search */}
          <div className="ml-auto w-full max-w-[820px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearchSubmit?.();
              }}
            >
              <label className="group relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-300/70" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-xl pl-10 pr-4 py-3 bg-white/5 text-sky-100 placeholder:text-sky-200/40 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02),0_8px_30px_rgba(14,165,233,.12)]"
                />
                <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity [background:radial-gradient(80%_180%_at_30%_0%,rgba(56,189,248,.06),transparent_60%)]" />
              </label>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}
