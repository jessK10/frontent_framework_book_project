import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2 } from "lucide-react";
import { findCoverByTitleAuthor, findLinkByTitleAuthor } from "@/services/googleBooksService";

type Props = {
  coverUrl?: string;
  title: string;
  author: string;
  rating?: number;       // 0..5 (can be fractional)
  ratingsCount?: number;
  pages?: number;
  format?: string;       // e.g. "BOOK"
  category?: string;     // e.g. "Computers"
  infoUrl?: string;      // click-through URL (Google Books, etc.)
  /** NEW: Render a delete button if provided */
  onDelete?: () => void;
  /** NEW: Disable button + show “Deleting…” */
  deleting?: boolean;
};

function Stars({ rating = 0 }: { rating?: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating * 2) / 2));
  return (
    <div className="flex items-center gap-1">
      {new Array(5).fill(0).map((_, i) => {
        const full = i + 1 <= value;
        const half = !full && i + 0.5 === value;
        return (
          <span key={i} className="relative inline-block h-4 w-4">
            <Star className="h-4 w-4 text-zinc-500/60" fill="none" />
            <span
              className={`absolute inset-0 overflow-hidden ${
                half ? "w-1/2" : full ? "w-full" : "w-0"
              }`}
            >
              <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function BookCard({
  coverUrl,
  title,
  author,
  rating,
  ratingsCount,
  pages,
  format = "BOOK",
  category,
  infoUrl,
  onDelete,
  deleting,
}: Props) {
  const [remoteCover, setRemoteCover] = useState<string | undefined>();
  const [remoteLink, setRemoteLink] = useState<string | undefined>();

  // Fetch a cover if not provided
  useEffect(() => {
    let cancelled = false;
    if (!coverUrl) {
      findCoverByTitleAuthor(title, author)
        .then((url) => !cancelled && setRemoteCover(url))
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [coverUrl, title, author]);

  // Fetch a Google Books info link if not provided
  useEffect(() => {
    let cancelled = false;
    if (!infoUrl) {
      findLinkByTitleAuthor(title, author)
        .then((link) => !cancelled && setRemoteLink(link))
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [infoUrl, title, author]);

  const displayCover = coverUrl || remoteCover;
  const displayLink = infoUrl || remoteLink;

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    displayLink ? (
      <a
        href={displayLink}
        target="_blank"
        rel="noopener noreferrer"
        title={`Open “${title}” on Google Books`}
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 cursor-pointer"
      >
        {children}
      </a>
    ) : (
      <div>{children}</div>
    );

  return (
    <Wrapper>
      <Card className="group relative overflow-hidden border border-zinc-800/50 bg-linear-to-b from-zinc-900 to-zinc-950 text-zinc-100 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/10">
        {/* Cover */}
        <div className="relative">
          <div className="aspect-[3/4] w-full overflow-hidden">
            {displayCover ? (
              <img
                src={displayCover}
                alt={title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-zinc-900/60 text-xs text-zinc-500">
                No cover
              </div>
            )}
          </div>

          {/* Tag */}
          <Badge
            variant="outline"
            className="absolute bottom-3 left-3 border-zinc-700/70 bg-zinc-900/70 text-[10px] tracking-wide backdrop-blur supports-backdrop-filter:bg-zinc-900/50"
          >
            {format.toUpperCase()}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="space-y-3 p-4">
          <div>
            <h3 className="text-lg font-semibold leading-tight text-cyan-200">
              {title}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">by {author}</p>
          </div>

          {(rating ?? ratingsCount) !== undefined && (
            <div className="flex items-center gap-2">
              <Stars rating={rating} />
              {typeof ratingsCount === "number" && (
                <span className="text-xs text-zinc-400">{ratingsCount}</span>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-zinc-400">
            <div>
              <span className="block">Pages:</span>
              <span className="font-medium text-zinc-300">{pages ?? "—"}</span>
            </div>
            <div>
              <span className="block">Format:</span>
              <span className="font-medium text-zinc-300">
                {format.toUpperCase()}
              </span>
            </div>
          </div>

          {category && (
            <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25">
              {category}
            </Badge>
          )}

          {/* Footer actions */}
          {onDelete && (
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                disabled={!!deleting}
                onClick={(e) => {
                  // prevent the outer anchor from navigating
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className={[
                  "inline-flex items-center gap-2 rounded-md",
                  "border px-3 py-1.5 text-xs font-medium",
                  "border-red-500/30 text-red-300 bg-red-500/10",
                  "hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50",
                  deleting ? "opacity-60 cursor-not-allowed" : ""
                ].join(" ")}
                title="Delete book"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          )}
        </CardContent>

        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute -inset-6 rounded-[28px] bg-[radial-gradient(300px_120px_at_20%_0%,rgba(16,185,129,0.15),transparent_60%),radial-gradient(300px_120px_at_80%_0%,rgba(6,182,212,0.12),transparent_60%)]" />
        </div>
      </Card>
    </Wrapper>
  );
}
