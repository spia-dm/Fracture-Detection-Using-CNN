import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/sections/Abstract";
import { KFoldChart } from "@/components/charts/KFoldChart";
import { bestKFold, preluRecovery, runs } from "@/lib/data";

export function KFold() {
  // Pick the most extreme single-run vs k-fold gap to dramatize PReLU recovery.
  const prelu5 = runs.find((r) => r.activation === "PReLU" && r.epochs === 5)!;

  return (
    <section id="kfold" className="relative px-5 py-20 sm:px-6 sm:py-28 lg:px-12 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <SectionLabel n="05" label="Cross-validation" />
        </Reveal>

        <div className="min-w-0 space-y-10 sm:space-y-12 lg:col-span-9">
          <Reveal>
            <h2 className="font-serif text-[clamp(1.875rem,7vw,3rem)] leading-[1.1] tracking-tight text-foreground sm:text-5xl">
              Single seed can lie.
              <br />
              <span className="text-foreground/40">
                K-fold reveals the truth.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/60">
              The held-out test split with seed = 42 misses something
              important: PReLU collapses to a single-class prediction in every
              configuration past 1 epoch, but is actually a competitive
              activation once you stop measuring it through one random
              initialization.
            </p>
          </Reveal>

          <Reveal>
            <KFoldChart />
          </Reveal>

          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                label="Best k-fold accuracy"
                value={`${bestKFold.accuracy.toFixed(2)}%`}
                std={`±${bestKFold.accuracyStd.toFixed(2)}%`}
                sub={`${bestKFold.activation} · ${bestKFold.epochs} epochs`}
              />
              <Stat
                label="Best k-fold F1"
                value={`${bestKFold.f1.toFixed(2)}%`}
                std={`±${bestKFold.f1Std.toFixed(2)}%`}
                sub={`${bestKFold.activation} · ${bestKFold.epochs} epochs`}
              />
              <Stat
                label="PReLU recovery"
                value={`${preluRecovery.bestKFoldAcc}%`}
                sub={`Single-run collapsed to 50.13%, k-fold @ ${preluRecovery.bestKFoldEpochs} epochs`}
              />
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/[0.04] p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                Case study · PReLU @ 5 epochs
              </div>
              <h3 className="mt-4 font-serif text-2xl tracking-tight text-foreground">
                Seed = 42 says it&apos;s broken.
                <br />
                <span className="text-foreground/40">
                  K-fold says it works.
                </span>
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                    Single run (seed = 42)
                  </div>
                  <dl className="mt-3 space-y-1.5 font-mono text-sm">
                    <Row label="Accuracy" value={`${prelu5.singleAcc.toFixed(2)}%`} />
                    <Row label="Precision" value={`${prelu5.singleP.toFixed(2)}%`} />
                    <Row label="Recall" value={`${prelu5.singleR.toFixed(2)}%`} />
                    <Row label="F1" value={`${prelu5.singleF1.toFixed(2)}%`} />
                  </dl>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                    10-fold CV (mean ± std)
                  </div>
                  <dl className="mt-3 space-y-1.5 font-mono text-sm">
                    <Row label="Accuracy" value={`${prelu5.kfoldAcc.toFixed(2)} ±${prelu5.kfoldAccStd.toFixed(2)}%`} />
                    <Row label="Precision" value={`${prelu5.kfoldP.toFixed(2)} ±${prelu5.kfoldPStd.toFixed(2)}%`} />
                    <Row label="Recall" value={`${prelu5.kfoldR.toFixed(2)} ±${prelu5.kfoldRStd.toFixed(2)}%`} />
                    <Row label="F1" value={`${prelu5.kfoldF1.toFixed(2)} ±${prelu5.kfoldF1Std.toFixed(2)}%`} />
                  </dl>
                </div>
              </div>
              <p className="mt-6 text-xs text-foreground/40">
                Same model, same hyperparameters. Just a different initialization
                regime.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  std,
  sub,
}: {
  label: string;
  value: string;
  std?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5 sm:p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-foreground/40">
        {label}
      </div>
      <div className="mt-4 font-mono text-2xl tabular-nums text-foreground sm:text-3xl">
        {value}
      </div>
      {std && (
        <div className="mt-1 font-mono text-xs tabular-nums text-foreground/40 sm:text-sm">
          {std}
        </div>
      )}
      {sub && <div className="mt-2 break-words text-xs text-foreground/40">{sub}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-baseline justify-between gap-3 text-foreground/70">
      <span className="shrink-0 text-xs uppercase tracking-[0.15em] text-foreground/40 sm:tracking-[0.2em]">
        {label}
      </span>
      <span className="truncate text-right tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}
