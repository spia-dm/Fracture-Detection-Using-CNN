"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { headlineMetrics } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from("[data-tag]", { opacity: 0, y: 16, duration: 0.7, ease: "power3.out" })
        .from(
          "[data-title-word]",
          {
            yPercent: 110,
            opacity: 0,
            stagger: 0.07,
            duration: 0.95,
            ease: "power4.out",
          },
          "-=0.4",
        )
        .from(
          "[data-sub]",
          { opacity: 0, y: 16, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        )
        .from(
          "[data-metric]",
          {
            opacity: 0,
            y: 12,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        );

      gsap.to("[data-bg-orb-1]", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-bg-orb-2]", {
        yPercent: -70,
        xPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-grid]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });

      el.querySelectorAll<HTMLElement>("[data-counter]").forEach((node) => {
        const target = Number(node.dataset.target ?? "0");
        const decimals = Number(node.dataset.decimals ?? "2");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          delay: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            node.textContent = obj.v.toFixed(decimals);
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const titleWords = ["Fracture", "Detection"];

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-24 pt-24 sm:pb-32 sm:pt-32 lg:px-12"
    >
      <div
        data-grid
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(color-mix(in_oklab,var(--foreground)_18%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--foreground)_18%,transparent)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{ opacity: "var(--grid-opacity)" }}
      />
      <div
        data-bg-orb-1
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 -z-10 h-[34rem] w-[34rem] rounded-full blur-[140px]"
        style={{
          background: "var(--accent-cyan)",
          opacity: "var(--orb-cyan-opacity)",
        }}
      />
      <div
        data-bg-orb-2
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-10 -z-10 h-[30rem] w-[30rem] rounded-full blur-[140px]"
        style={{
          background: "var(--accent-fuchsia)",
          opacity: "var(--orb-fuchsia-opacity)",
        }}
      />

      <div className="mx-auto w-full max-w-7xl">
        <div data-tag className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-foreground/50">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          Interactive research paper · 2024
        </div>

        <h1 className="font-serif text-[clamp(3rem,10vw,9rem)] font-medium leading-[0.95] tracking-tight text-foreground">
          {titleWords.map((w, i) => (
            <span key={i} className="mr-[0.2em] inline-block overflow-hidden align-bottom">
              <span data-title-word className="inline-block">
                {w}
              </span>
            </span>
          ))}
          <span className="block text-foreground/40 sm:inline">
            <span className="mr-[0.2em] inline-block overflow-hidden align-bottom">
              <span data-title-word className="inline-block">with</span>
            </span>
            <span className="mr-[0.2em] inline-block overflow-hidden align-bottom">
              <span data-title-word className="inline-block">CNNs</span>
            </span>
          </span>
        </h1>

        <p
          data-sub
          className="mt-8 max-w-2xl text-balance text-base leading-relaxed text-foreground/60 sm:text-lg"
        >
          A shallow CNN with Canny-edge preprocessing classifies X-rays as
          fractured or non-fractured. The project sweeps three activation
          functions (ReLU, Leaky ReLU, PReLU) across five epoch budgets,
          fifteen configurations validated through both a fixed-seed held-out
          test set and 10-fold cross validation.
        </p>

        <div className="mt-16 grid max-w-3xl grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-4">
          <Metric label="Best single-run accuracy" value={headlineMetrics.bestSingleAccuracy} suffix="%" />
          <Metric label="Best k-fold F1" value={headlineMetrics.bestKFoldF1} suffix="%" />
          <Metric label="Images" value={headlineMetrics.totalImages} suffix="" />
          <Metric label="Configurations" value={headlineMetrics.configsTested} suffix="" />
        </div>

        <div className="mt-16 flex items-center gap-2 text-xs text-foreground/40">
          <span>Scroll</span>
          <span className="h-px w-12 bg-foreground/30" />
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  const isInt = Number.isInteger(value);
  const decimals = isInt ? 0 : 2;
  const initial = isInt ? "0" : "0.00";
  return (
    <div data-metric>
      <div className="font-mono text-3xl text-foreground sm:text-4xl">
        <span data-counter data-target={value.toFixed(decimals)} data-decimals={decimals}>
          {initial}
        </span>
        {suffix && <span className="text-foreground/40">{suffix}</span>}
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </div>
    </div>
  );
}
