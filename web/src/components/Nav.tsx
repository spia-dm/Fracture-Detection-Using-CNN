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

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY && y > 200);
      setLastY(y);

      let current = "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          current = s.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <a
          href="#top"
          className="flex items-center gap-2 text-sm font-medium tracking-tight text-foreground"
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          Fracture · CNN
        </a>
        <div className="flex items-center gap-2">
          <nav className="relative hidden items-center gap-1 rounded-full border border-foreground/10 bg-background/60 p-1 backdrop-blur-md md:flex">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="relative rounded-full px-3 py-1.5 text-xs font-medium"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
