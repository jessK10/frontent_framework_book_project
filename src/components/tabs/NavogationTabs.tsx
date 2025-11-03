// src/components/tabs/NavogationTabs.tsx
import React, { useMemo, useRef } from "react";

type Tab = "books" | "authors" | "add-author" | "add-book";

type Props = {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  booksCount: number;
  authorsCount: number;
};

export default function NavigationTabs({
  activeTab,
  setActiveTab,
  booksCount,
  authorsCount,
}: Props) {
  const tabs = useMemo(
    () =>
      [
        { key: "books" as const, label: "Books", count: booksCount },
        { key: "authors" as const, label: "Authors", count: authorsCount },
        { key: "add-book" as const, label: "Add Book" },
        { key: "add-author" as const, label: "Add Author" },
      ] satisfies Array<{ key: Tab; label: string; count?: number }>,
    [booksCount, authorsCount]
  );

  // keep refs for keyboard focus management
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const idx = tabs.findIndex((t) => t.key === activeTab);
    if (idx === -1) return;

    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;

    if (next !== idx) {
      e.preventDefault();
      setActiveTab(tabs[next].key);
      btnRefs.current[next]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Sections"
      className="flex flex-wrap gap-3"
      onKeyDown={onKeyDown}
    >
      {tabs.map(({ key, label, count }, i) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            // IMPORTANT: return void from ref callback
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${key}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => setActiveTab(key)}
            className={`tab ${isActive ? "tab-active" : ""} focus-visible:ring-2 focus-visible:ring-cyan-400/50`}
          >
            <span className="text-sm font-medium tracking-wide">{label}</span>
            {typeof count === "number" && (
              <span
                className={`ml-2 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  isActive ? "bg-white/10 text-sky-100" : "bg-white/8 text-sky-300/70"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
