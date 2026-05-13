import { Reveal } from "@/components/Reveal";

export function Abstract() {
  return (
    <section id="abstract" className="relative px-6 py-32 sm:py-40 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <SectionLabel n="01" label="Abstract" />
        </Reveal>

        <div className="space-y-8 lg:col-span-9">
          <Reveal>
            <p className="font-serif text-3xl leading-snug tracking-tight text-foreground sm:text-4xl">
              Bone fractures are extremely common and can usually be treated
              properly only with timely, accurate diagnosis.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/60">
              The project applies a CNN-based approach to automated
              bone-fracture detection from X-ray images. The model is trained
              on a public dataset of{" "}
              <span className="text-foreground">4 906 images</span> split
              84/8/8 into train/val/test, with Adam, binary cross-entropy and
              a fixed random seed (
              <span className="text-foreground">42</span>) for reproducibility.
              Three activation functions (ReLU, Leaky ReLU, PReLU) are swept
              across five epoch budgets, 15 configurations in total, each
              evaluated with a single-run held-out test and 10-fold cross
              validation.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-2xl text-base leading-relaxed text-foreground/60">
              The best single-run result comes from{" "}
              <span className="text-foreground">ReLU @ 20 epochs</span>
              {" "}- 95.74% accuracy, 94.20% precision, 97.50% recall, 95.82% F1.
              Under 10-fold cross validation the lead changes to{" "}
              <span className="text-foreground">Leaky ReLU @ 20 epochs</span>
              {" "}(94.37% ± 0.96 accuracy). PReLU is seed-sensitive, it
              collapses to a single-class prediction in the held-out run but
              recovers to 93.71% under cross validation.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs uppercase tracking-[0.2em] text-foreground/40">
              <span>Binary classification</span>
              <span>·</span>
              <span>4 906 X-rays</span>
              <span>·</span>
              <span>15 configurations</span>
              <span>·</span>
              <span>Canny edge preprocessing</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="sticky top-32 flex items-baseline gap-3 text-xs uppercase tracking-[0.3em] text-foreground/40">
      <span className="font-mono text-foreground/30">{n}</span>
      <span>/</span>
      <span>{label}</span>
    </div>
  );
}
