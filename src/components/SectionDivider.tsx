import React from "react";

/**
 * Full-width glowing divider that visually separates bands.
 * - Soft concave “lip” toward the top (mask)
 * - Cyan/teal glow below
 */
export default function SectionDivider() {
  return (
    <div className="relative isolate w-full">
      {/* concave lip / subtle edge */}
      <div
        className={[
          "pointer-events-none",
          "h-12 w-full",
          // dark edge and slight fade
          "bg-[radial-gradient(120%_40px_at_50%_0,#0e1626_30%,rgba(14,22,38,0)_70%)]",
          // pull lip up to overlap hero bottom a bit
          "-mt-4",
        ].join(" ")}
      />
      {/* glow band under the lip */}
      <div className="pointer-events-none -mt-2 h-16 w-full bg-[radial-gradient(800px_80px_at_50%_0,rgba(56,189,248,.18),rgba(6,182,212,.10)_50%,transparent_70%)]" />
    </div>
  );
}
