"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/sections/Abstract";
import { Network } from "@/components/network/Network";
import { architecture, trainingHyperparams, methodology, totalParams } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Architecture() {
  const stack = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = stack.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-step]",
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="architecture" className="relative px-6 py-32 sm:py-40 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <SectionLabel n="03" label="Method" />
        </Reveal>

        <div className="space-y-12 lg:col-span-9">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
              Canny edges,
              <br />
              <span className="text-foreground/40">three conv blocks, a sigmoid head.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/60">
              The pipeline is intentionally simple: domain-specific preprocessing
              does most of the heavy lifting, and a shallow CNN learns on the
              already-highlighted fracture lines.
            </p>
          </Reveal>

          <div ref={stack} className="grid gap-3 lg:grid-cols-2">
            {methodology.map((s, i) => (
              <div
                key={s.step}
                data-step
                className="group relative flex items-start gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5"
              >
                <span className="font-mono text-xs text-foreground/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">
                    {s.step}
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 3D network visualization */}
          <Reveal>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Network architecture
                </h3>
                <p className="text-xs text-foreground/40">
                  {totalParams.toLocaleString()} parameters · 99.4% in FC1
                </p>
              </div>
              <Network />
            </div>
          </Reveal>

          {/* Layer details table + training setup */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Layer specification
                </h3>
                <div className="mt-6 divide-y divide-foreground/5">
                  {architecture.map((layer) => (
                    <div key={layer.name} className="py-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-mono text-sm text-foreground">
                          {layer.name}
                        </span>
                        <span className="font-mono text-xs tabular-nums text-foreground/40">
                          {layer.params > 0
                            ? layer.params.toLocaleString()
                            : "-"}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-foreground/50">
                        {layer.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Training setup
                </h3>
                <dl className="mt-6 divide-y divide-foreground/5">
                  {trainingHyperparams.map((p) => (
                    <div
                      key={p.label}
                      className="flex items-baseline justify-between gap-4 py-3 text-sm"
                    >
                      <dt className="text-foreground/50">{p.label}</dt>
                      <dd className="text-right font-mono text-foreground">
                        {p.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-xs text-foreground/40">
                  The activation function, ReLU, Leaky ReLU, or PReLU, is the
                  one knob varied across the 15 experiments. Everything else
                  stays fixed.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
