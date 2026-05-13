import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/sections/Abstract";
import { datasetSplit, augmentationTrain, augmentationEval } from "@/lib/data";

export function Dataset() {
  const splits = [
    { name: "Train", ...datasetSplit.train },
    { name: "Test", ...datasetSplit.test },
    { name: "Val", ...datasetSplit.val },
  ];

  return (
    <section id="dataset" className="relative px-6 py-32 sm:py-40 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <SectionLabel n="02" label="Dataset" />
        </Reveal>

        <div className="space-y-12 lg:col-span-9">
          <Reveal>
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
              {datasetSplit.total.toLocaleString()} X-rays,{" "}
              <span className="text-foreground/40">
                balanced 50 / 50 across the binary task.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/60">
              Subset of a publicly available Kaggle bone-fracture X-ray
              dataset, pre-organized by the curators into 84 / 8 / 8
              train/test/val folders. PyTorch&apos;s{" "}
              <span className="text-foreground">ImageFolder</span> loads each
              split independently, no programmatic overlap, no leakage.
            </p>
          </Reveal>

          <Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {splits.map((s) => (
                <div
                  key={s.name}
                  className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-5"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                      {s.name}
                    </div>
                    <div className="font-mono text-xs text-foreground/40">
                      {s.share}%
                    </div>
                  </div>
                  <div className="mt-3 font-mono text-3xl text-foreground">
                    {s.total.toLocaleString()}
                  </div>
                  <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-foreground/5">
                    <div
                      className="h-full bg-cyan-400/80"
                      style={{ width: `${(s.fractured / s.total) * 100}%` }}
                    />
                    <div
                      className="h-full bg-fuchsia-400/70"
                      style={{
                        width: `${(s.notFractured / s.total) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-foreground/50">
                    <span>fractured {s.fractured}</span>
                    <span>healthy {s.notFractured}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Train transform
                </h3>
                <ol className="mt-6 space-y-3">
                  {augmentationTrain.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-foreground/70"
                    >
                      <span className="mt-0.5 font-mono text-xs text-foreground/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
                <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Val / test transform
                </h3>
                <ol className="mt-6 space-y-3">
                  {augmentationEval.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-foreground/70"
                    >
                      <span className="mt-0.5 font-mono text-xs text-foreground/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-xs text-foreground/40">
                  Canny edges drop the input from RGB to a single-channel edge
                  map, fracture lines stand out and soft-tissue texture is
                  suppressed.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
