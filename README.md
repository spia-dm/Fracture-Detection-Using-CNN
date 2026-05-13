# Fracture Detection with CNNs

Binary fracture / non-fracture classifier for X-ray images. Companion code
and interactive paper for *A Comparative Analysis of Activation Functions in
CNN-Based Bone Fracture Detection*.

| Path | What's in it |
| --- | --- |
| [`web/`](web) | Next.js single-page interactive paper |
| [`dl/`](dl) | PyTorch CNN, training notebooks (the source of every result) |

## Highlights

- Binary classifier on **4 906 X-ray images** (84 / 8 / 8 split, ~50 / 50 balanced).
- Sweep across **ReLU, Leaky ReLU, PReLU** × **1, 5, 10, 15, 20 epochs** = 15 configurations.
- Single-channel Canny edge preprocessing.
- Held-out test (seed = 42) **and** 10-fold cross validation for every configuration.
- Best single-run: **ReLU @ 20 epochs** — 95.74% acc, 94.20% P, 97.50% R, 95.82% F1.
- Best k-fold: **Leaky ReLU @ 20 epochs** — 94.37% ± 0.96 acc, 94.55% ± 0.91 F1.
- Beats a frozen **EfficientNetB3** baseline by ~25 pp at the same epoch budget.

## Run the interactive paper

```bash
cd web
npm install
npm run dev
```

→ http://localhost:3000

## Run the notebooks

```bash
cd dl
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
jupyter lab notebooks/
```

See [`dl/README.md`](dl/README.md) for the notebook map and
[`dl/docs/`](dl/docs) for dataset details and the experiment configuration
table.

## Tech

- **Web**: Next.js 16, React 19, Tailwind 4, GSAP, Lenis, Recharts, three.js
- **DL**: PyTorch, torchvision, OpenCV (Canny), scikit-learn
