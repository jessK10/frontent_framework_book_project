// src/components/HeroBook.tsx
import React from "react";
import { motion } from "framer-motion";
import FloatingParticles from "@/components/FloatingParticles";

const BOOK_IMG = "/hero-book.png"; // public/hero-book.png

export default function HeroBook() {
  return (
    <div
      className="
        md:col-span-1 lg:col-span-2
        h-64 sm:h-80 md:h-[560px] lg:h-[680px]
        relative flex items-center justify-center
      "
      style={{ perspective: 1200 }}
      aria-label="3D floating hero book"
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ y: [0, -18, 0], rotateY: [0, 6, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {/* Glass/frosted panel */}
        <div
          className="
            absolute inset-0 rounded-3xl
            bg-[#0e1626]/60 backdrop-blur-2xl
            ring-1 ring-white/10
            shadow-[0_40px_160px_rgba(56,189,248,.25),0_10px_60px_rgba(16,185,129,.15)]
            overflow-hidden
          "
        >
          {/* Particles are clipped by the rounded panel */}
          <FloatingParticles />
        </div>

        {/* Book image */}
        <img
          src={BOOK_IMG}
          alt="Magic Book"
          className="
            absolute inset-0 h-full w-full object-contain
            drop-shadow-[0_20px_60px_rgba(34,197,94,.28)]
            pointer-events-none
          "
          loading="eager"
          decoding="async"
        />

        {/* Soft inner ring for subtle edge definition */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
      </motion.div>
    </div>
  );
}
