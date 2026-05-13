"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const sections = [
  { id: "abstract", label: "Abstract" },
  { id: "dataset", label: "Dataset" },
  { id: "architecture", label: "Method" },
  { id: "results", label: "Results" },
  { id: "kfold", label: "K-Fold" },
  { id: "conclusion", label: "Conclusion" },
];

function NavPills({
  active,
  layoutId,
  className = "",
}: {
  active: string;
  layoutId: string;
  className?: string;
}) {
  return (
    <nav
      className={`flex items-center gap-1 rounded-full border border-foreground/10 bg-background/60 p-1 backdrop-blur-md ${className}`}
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="relative shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 22,
                  mass: 0.5,
                }}
              />
            )}
            <span
              className={`relative z-10 transition-colors ${
                isActive
                  ? "text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {s.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);

      let current = "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = s.id;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_8%,transparent)]"
          : "bg-transparent"
      }`}
    >
      {/* Top row: logo + desktop nav + theme toggle */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5 lg:px-12">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2 text-sm font-medium tracking-tight text-foreground"
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          Fracture · CNN
        </a>
        <NavPills
          active={active}
          layoutId="nav-pill-desktop"
          className="hidden md:flex"
        />
        <ThemeToggle />
      </div>

      {/* Mobile-only nav row: horizontally scrollable pills */}
      <div className="md:hidden">
        <div className="mx-auto max-w-7xl overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NavPills
            active={active}
            layoutId="nav-pill-mobile"
            className="inline-flex w-max"
          />
        </div>
      </div>
    </header>
  );
}
