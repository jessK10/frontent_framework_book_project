// src/components/FloatingParticles.tsx
import React, { useMemo } from "react";

type Props = {
  /** Number of particles to render */
  count?: number;
  /** Extra classes for the wrapper (positioning, z-index, etc.) */
  className?: string;
};

type Particle = {
  size: number;     // px
  top: number;      // %
  left: number;     // %
  duration: number; // s
  delay: number;    // s
};

type CSSVars = React.CSSProperties & {
  /** Duration for the .animate-float keyframes (defined in index.css) */
  ["--float-dur"]?: string;
};

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

export default function FloatingParticles({ count = 24, className = "" }: Props) {
  // Generate particle specs once
  const parts = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }).map(() => ({
        size: rnd(3, 6),
        top: rnd(0, 100),
        left: rnd(0, 100),
        duration: rnd(8, 16),
        delay: rnd(0, 6),
      })),
    [count]
  );

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {parts.map((p, i) => {
        const style: CSSVars = {
          width: `${p.size}px`,
          height: `${p.size}px`,
          top: `${p.top}%`,
          left: `${p.left}%`,
          animationDelay: `${p.delay}s`,
          ["--float-dur"]: `${p.duration}s`, // used by .animate-float
        };

        return (
          <span
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-70 animate-float"
            style={style}
          />
        );
      })}
    </div>
  );
}
