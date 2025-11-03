// src/components/AuthorCard.tsx
import React from "react";

type AuthorLite = {
  id: number;
  name: string;
  bio?: string;
  birthYear?: number;
  country?: string;
};

interface Props {
  author: AuthorLite;
  bookCount: number;
  onDelete: (id: number) => void;
  deleting?: boolean;
}

export default function AuthorCard({ author, bookCount, onDelete, deleting }: Props) {
  return (
    <article
      className={[
        "relative overflow-hidden rounded-2xl",
        // glass look
        "bg-white/5 backdrop-blur ring-1 ring-white/10",
        // soft inner highlight + hover glow
        "shadow-[inset_0_1px_0_rgba(255,255,255,.04),0_10px_30px_rgba(6,182,212,.10)]",
        "hover:ring-cyan-400/30 hover:shadow-[0_18px_60px_rgba(6,182,212,.14)]",
        "transition-all duration-300"
      ].join(" ")}
    >
      {/* subtle cyan/teal gradient wash on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                   bg-[radial-gradient(120%_80%_at_20%_0,rgba(56,189,248,.08),transparent_60%),radial-gradient(120%_80%_at_100%_0,rgba(16,185,129,.07),transparent_60%)]"
      />

      {/* content */}
      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* left accent dot */}
          <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-cyan-300/70 shadow-[0_0_16px_rgba(56,189,248,.6)]" />
          <div className="min-w-0">
            <h3 className="truncate text-[15px] sm:text-base font-semibold text-sky-100">
              {author.name}
            </h3>
            <p className="mt-1 text-xs text-sky-200/70">
              Books: <span className="font-medium text-sky-100">{bookCount}</span>
            </p>
          </div>

          {/* delete button */}
          <button
            type="button"
            onClick={() => onDelete(author.id)}
            disabled={deleting}
            title={deleting ? "Deleting…" : "Delete author"}
            className={[
              "ml-auto inline-flex items-center justify-center",
              "h-8 w-8 rounded-lg",
              "bg-white/6 ring-1 ring-white/10 text-sky-200/80",
              "hover:text-red-100 hover:ring-red-400/40 hover:bg-red-500/15",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50",
              deleting ? "opacity-60 cursor-not-allowed" : ""
            ].join(" ")}
          >
            {deleting ? (
              // spinner
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
              </svg>
            ) : (
              // trash icon
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 7l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 7m3 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 7h18"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
