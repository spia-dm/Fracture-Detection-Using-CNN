import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/sections/Abstract";
import {
  baselineComparison,
  bestSingleRun,
  bestKFold,
  confusionMatrix,
  modelComplexity,
} from "@/lib/data";

const takeaways = [
  "ReLU @ 20 epochs delivers the best single-run scores (95.74 / 94.20 / 97.50 / 95.82). Leaky ReLU @ 20 epochs leads the k-fold ranking (94.37 ± 0.96 accuracy).",
  "PReLU is seed-sensitive, single-run with seed = 42 collapses to a constant prediction, but the k-fold mean recovers to 93.71%. Always cross-validate before declaring a winner.",
  "A 22 M-parameter shallow CNN on Canny edge maps beats a frozen EfficientNetB3 by ~25 percentage points at the same epoch budget. Domain-specific preprocessing dominates depth.",
];

const limitations = [
  "Single-source dataset (4 906 images from a single Kaggle release). No external clinical validation has been done; generalization to other hospitals / scanners is untested.",
  "Canny is applied universally, there is no ablation isolating its contribution. Follow-up work should test the same architecture with and without edge preprocessing.",
  "The clinical sensitivity (97.50% recall) is above the 95% threshold, but the precision/recall threshold itself was never tuned for the medical use case.",
];

export function Conclusion() {
  const baselineDelta = baselineComparison.proposed.accuracy - baselineComparison.baseline.accuracy;
  const matrixTotal =
    confusionMatrix.truePositive +
    confusionMatrix.trueNegative +
    confusionMatrix.falsePositive +
    confusionMatrix.falseNegative;

  return (
    <section
      id="conclusion"
      className="relative overflow-hidden px-6 py-32 sm:py-40 lg:px-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
      />
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <SectionLabel n="06" label="Conclusion" />
        </Reveal>

        <div className="space-y-12 lg:col-span-9">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-6xl">
              Shallow CNN + edges
              <br />
              <span className="text-foreground/40">
                beats a frozen EfficientNet.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/60">
              Canny edge preprocessing turns the RGB X-ray into a single-channel
              fracture-line map. A shallow custom CNN trained on those maps -
              fewer than 93 000 parameters in the convolutional stack -
              outperforms a transfer-learned EfficientNetB3 by a wide margin at
              the same epoch budget.
            </p>
          </Reveal>

          {/* Baseline comparison */}
          <Reveal>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Baseline comparison · {baselineComparison.epochs} epochs
                </h3>
                <span className="font-mono text-xs text-cyan-400">
                  Δ accuracy +{baselineDelta.toFixed(2)}%
                </span>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <ComparisonColumn
                  title={baselineComparison.proposed.name}
                  tone="accent"
                  rows={[
                    ["Accuracy", baselineComparison.proposed.accuracy],
                    ["Precision", baselineComparison.proposed.precision],
                    ["Recall", baselineComparison.proposed.recall],
                    ["F1", baselineComparison.proposed.f1],
                  ]}
                />
                <ComparisonColumn
                  title={baselineComparison.baseline.name}
                  tone="muted"
                  rows={[
                    ["Accuracy", baselineComparison.baseline.accuracy],
                    ["Precision", baselineComparison.baseline.precision],
                    ["Recall", baselineComparison.baseline.recall],
                    ["F1", baselineComparison.baseline.f1],
                  ]}
                />
              </div>

              <div className="mt-8 grid gap-3 border-t border-foreground/5 pt-6 text-xs text-foreground/50 sm:grid-cols-2">
                <ParamLine
                  label="Proposed CNN"
                  total={modelComplexity.proposed.totalParams}
                  trainable={modelComplexity.proposed.trainableParams}
                  note={`${modelComplexity.proposed.convLayers} conv layers · ${modelComplexity.proposed.arch}`}
                />
                <ParamLine
                  label="EfficientNetB3"
                  total={modelComplexity.baseline.totalParams}
                  trainable={modelComplexity.baseline.trainableParams}
                  note={`${modelComplexity.baseline.convLayers}+ conv layers · ${modelComplexity.baseline.arch}`}
                />
              </div>
            </div>
          </Reveal>

          {/* Confusion matrix */}
          <Reveal>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                Confusion matrix · best held-out config
              </h3>
              <p className="mt-2 text-xs text-foreground/40">
                {confusionMatrix.config}
              </p>

              <div className="mt-6 grid grid-cols-[auto_1fr_1fr] gap-2 text-sm">
                <div />
                <div className="pb-2 text-center text-xs uppercase tracking-[0.2em] text-foreground/40">
                  Predicted fractured
                </div>
                <div className="pb-2 text-center text-xs uppercase tracking-[0.2em] text-foreground/40">
                  Predicted healthy
                </div>

                <div className="flex items-center justify-end pr-2 text-xs uppercase tracking-[0.2em] text-foreground/40">
                  Actual fractured
                </div>
                <ConfusionCell value={confusionMatrix.truePositive} total={matrixTotal} kind="tp" label="TP" />
                <ConfusionCell value={confusionMatrix.falseNegative} total={matrixTotal} kind="fn" label="FN" />

                <div className="flex items-center justify-end pr-2 text-xs uppercase tracking-[0.2em] text-foreground/40">
                  Actual healthy
                </div>
                <ConfusionCell value={confusionMatrix.falsePositive} total={matrixTotal} kind="fp" label="FP" />
                <ConfusionCell value={confusionMatrix.trueNegative} total={matrixTotal} kind="tn" label="TN" />
              </div>

              <p className="mt-6 text-xs text-foreground/50">
                Only <span className="text-foreground">2 false negatives</span>
                {" "}out of 80 actual fractures, a clinically meaningful 97.5%
                sensitivity, well above the 95% threshold cited in the paper.
              </p>
            </div>
          </Reveal>

          {/* Takeaways */}
          <Reveal>
            <div className="grid gap-3 sm:grid-cols-3">
              {takeaways.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5"
                >
                  <div className="font-mono text-xs text-foreground/30">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">
                    {t}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Limitations */}
          <Reveal>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                Limitations & future work
              </h3>
              <ul className="mt-6 space-y-3">
                {limitations.map((l, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed text-foreground/70"
                  >
                    <span className="mt-0.5 font-mono text-xs text-foreground/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs uppercase tracking-[0.2em] text-foreground/40">
              <span>Best held-out</span>
              <span className="text-foreground/70">
                {bestSingleRun.activation} · {bestSingleRun.epochs}e ·{" "}
                {bestSingleRun.accuracy}%
              </span>
              <span>·</span>
              <span>Best k-fold</span>
              <span className="text-foreground/70">
                {bestKFold.activation} · {bestKFold.epochs}e ·{" "}
                {bestKFold.accuracy}%
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ComparisonColumn({
  title,
  tone,
  rows,
}: {
  title: string;
  tone: "accent" | "muted";
  rows: [string, number][];
}) {
  const top = rows[0][1];
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="font-mono text-4xl text-foreground">
        {top.toFixed(2)}
        <span className="text-foreground/40">%</span>
      </div>
      <div className="space-y-2 pt-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center gap-3 text-xs"
          >
            <span className="w-20 text-foreground/50">{label}</span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/5">
              <div
                className={
                  tone === "accent"
                    ? "absolute inset-y-0 left-0 bg-cyan-400/80"
                    : "absolute inset-y-0 left-0 bg-foreground/30"
                }
                style={{ width: `${value}%` }}
              />
            </div>
            <span className="w-16 text-right font-mono text-foreground/70">
              {value.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParamLine({
  label,
  total,
  trainable,
  note,
}: {
  label: string;
  total: number;
  trainable: number;
  note: string;
}) {
  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)} M` : n.toLocaleString();
  return (
    <div>
      <div className="text-foreground/70">{label}</div>
      <div className="mt-1 font-mono">
        {fmt(total)} total · {fmt(trainable)} trainable
      </div>
      <div className="mt-1 text-foreground/40">{note}</div>
    </div>
  );
}

function ConfusionCell({
  value,
  total,
  kind,
  label,
}: {
  value: number;
  total: number;
  kind: "tp" | "tn" | "fp" | "fn";
  label: string;
}) {
  const positive = kind === "tp" || kind === "tn";
  const pct = ((value / total) * 100).toFixed(1);
  return (
    <div
      className={`rounded-xl border p-5 text-center transition-colors ${
        positive
          ? "border-cyan-400/30 bg-cyan-400/[0.08]"
          : "border-foreground/10 bg-foreground/[0.04]"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
        {label}
      </div>
      <div className="mt-2 font-mono text-3xl text-foreground">{value}</div>
      <div className="mt-1 text-xs text-foreground/40">{pct}%</div>
    </div>
  );
}
