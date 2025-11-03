import React from "react";
import HeroBook from "./HeroBook";
import FloatingParticles from "./FloatingParticles";

export default function HeroSection() {
  const handleCta = () => {
    const el = document.getElementById("books");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-10 pb-16 md:pt-16 md:pb-20">
      {/* Ambient glows (non-interactive) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl"
      />

      {/* Optional: floating particles behind the content */}
       <FloatingParticles className="absolute inset-0" /> 

      <div className="relative grid items-center gap-10 md:grid-cols-2">
        {/* Left text column */}
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
              Interactive Library
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-sky-100/80">
            Explore our collection with dynamic previews and immersive interactions.
          </p>

          <button
            onClick={handleCta}
            className="
              mt-6 inline-flex items-center rounded-lg
              bg-blue-600 px-5 py-2.5 text-white
              hover:bg-blue-700 transition-colors
              shadow-[0_10px_30px_rgba(37,99,235,.35)]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
            "
          >
            Start Exploring
          </button>
        </div>

        {/* Right 3D card */}
        <div className="justify-self-end w-full">
          <HeroBook />
        </div>
      </div>
    </section>
  );
}
