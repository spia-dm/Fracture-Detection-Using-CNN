"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/sections/Abstract";
import { AccuracyChart } from "@/components/charts/AccuracyChart";
import { MetricRadar } from "@/components/charts/MetricRadar";
import { runs, bestSingleRun } from "@/lib/data";

type Mode = "single" | "kfold";

export function Results() {
  const [mode, setMode] = useState<Mode>("single");

  return (
    <section id="results" className="relative px-6 py-32 sm:py-40 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <SectionLabel n="04" label="Results" />
        </Reveal>

        <div className="space-y-12 lg:col-span-9">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
              {mode === "single" ? "Held-out seed run." : "10-fold cross validation."}
              <br />
              <span className="text-foreground/40">
                {mode === "single"
                  ? "ReLU @ 20 epochs wins."
                  : "Leaky ReLU @ 20 epochs wins."}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/60">
              Toggle between the two evaluation regimes. The single-run column
              uses the held-out test split with random seed{" "}
              <span className="text-foreground">42</span>; the k-fold column
              reports the mean ± standard deviation across 10 folds.
            </p>
          </Reveal>

          <Reveal>
            <div className="inline-flex rounded-full border border-foreground/10 bg-background/60 p-1">
              <button
                onClick={() => setMode("single")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  mode === "single"
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                Held-out (seed = 42)
              </button>
              <button
                onClick={() => setMode("kfold")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  mode === "kfold"
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                10-fold CV
              </button>
            </div>
          </Reveal>

          <Reveal>
            <AccuracyChart mode={mode} />
          </Reveal>

          <Reveal>
            <MetricRadar mode={mode} />
          </Reveal>

          <Reveal>
            <ResultsTable mode={mode} bestKey={bestRunKey(mode)} />
          </Reveal>

          {mode === "single" && (
            <Reveal>
              <p className="text-xs text-foreground/40">
                PReLU rows after epoch 1 show the classic seed-collapse
                pattern, every input is predicted as the positive class, so
                recall hits 100% but precision stays at the class prior
                (50.13%). The model recovers fully under k-fold.
              </p>
            </Reveal>
          )}

          {mode === "single" && (
            <Reveal>
              <BestRunCard />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

function bestRunKey(mode: Mode): string {
  if (mode === "single") return "ReLU-20";
  return "Leaky ReLU-20";
}

function key(act: string, ep: number) {
  return `${act}-${ep}`;
}

function ResultsTable({ mode, bestKey }: { mode: Mode; bestKey: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-foreground/10 bg-foreground/[0.04]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-foreground/10 text-xs uppercase tracking-[0.2em] text-foreground/40">
          <tr>
            <th className="px-5 py-4">Activation</th>
            <th className="px-5 py-4">Epochs</th>
            <th className="px-5 py-4">Accuracy</th>
            <th className="px-5 py-4">Precision</th>
            <th className="px-5 py-4">Recall</th>
            <th className="px-5 py-4">F1</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/5">
          {runs.map((r) => {
            const rowKey = key(r.activation, r.epochs);
            const isBest = rowKey === bestKey;
            return (
              <tr
                key={rowKey}
                className={`transition-colors hover:bg-foreground/[0.03] ${
                  isBest ? "bg-cyan-400/[0.06]" : ""
                }`}
              >
                <td className="px-5 py-3 font-medium text-foreground">
                  {r.activation}
                </td>
                <td className="px-5 py-3 font-mono text-foreground/70">
                  {r.epochs}
                </td>
                {mode === "single" ? (
                  <>
                    <td className="px-5 py-3 font-mono text-foreground">
                      {r.singleAcc.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground/70">
                      {r.singleP.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground/70">
                      {r.singleR.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground/70">
                      {r.singleF1.toFixed(2)}%
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-3 font-mono text-foreground">
                      {r.kfoldAcc.toFixed(2)}
                      <span className="text-foreground/40">
                        {" "}±{r.kfoldAccStd.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground/70">
                      {r.kfoldP.toFixed(2)}
                      <span className="text-foreground/40">
                        {" "}±{r.kfoldPStd.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground/70">
                      {r.kfoldR.toFixed(2)}
                      <span className="text-foreground/40">
                        {" "}±{r.kfoldRStd.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground/70">
                      {r.kfoldF1.toFixed(2)}
                      <span className="text-foreground/40">
                        {" "}±{r.kfoldF1Std.toFixed(2)}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BestRunCard() {
  return (
    <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/[0.05] p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-foreground/50">
        Best single-run configuration
      </div>
      <div className="mt-4 font-serif text-3xl tracking-tight text-foreground">
        {bestSingleRun.activation} · {bestSingleRun.epochs} epochs
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
        <Stat label="Accuracy" value={`${bestSingleRun.accuracy}%`} />
        <Stat label="Precision" value={`${bestSingleRun.precision}%`} />
        <Stat label="Recall" value={`${bestSingleRun.recall}%`} />
        <Stat label="F1" value={`${bestSingleRun.f1}%`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-2xl text-foreground">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
        {label}
      </div>
    </div>
  );
}
