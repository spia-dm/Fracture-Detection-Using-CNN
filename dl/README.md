# Deep learning · `dl/`

PyTorch CNN for binary fracture classification on X-ray images, with
single-channel Canny edge preprocessing and an activation-function sweep
across 15 training configurations + 10-fold cross validation.

## Layout

```
dl/
├── docs/
│   ├── DATASET.md            Where the data comes from, split sizes
│   ├── EXPERIMENTS.md        Run matrix, hyperparams, architecture
│   └── checkpoint-format.md  Layer-state-dict key layout
├── notebooks/
│   ├── baseline.ipynb        Plain CNN baseline (no Canny)
│   ├── experiments/          15 activation × epoch runs (file1–file15)
│   ├── kfold/                10-fold CV per metric
│   └── predict/              Inference notebooks
└── requirements.txt
```

## Setup

```bash
cd dl
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

## Data

Download the Kaggle dataset
([siddxt/fracture-detection-using-cnn](https://www.kaggle.com/datasets/siddxt/fracture-detection-using-cnn))
and place it at `dl/dataset/` with the layout described in
[`docs/DATASET.md`](docs/DATASET.md).

## Run the experiments

```bash
jupyter lab notebooks/
```

The notebooks are self-contained. Pick one from `experiments/` — the file ↔
(activation, epochs) mapping is in [`docs/EXPERIMENTS.md`](docs/EXPERIMENTS.md).

Checkpoint key layout is documented in
[`docs/checkpoint-format.md`](docs/checkpoint-format.md).

## Results

Headline numbers from the paper:

- Best single-run (held-out, seed = 42): **ReLU @ 20 epochs** — 95.74% accuracy, 95.82% F1.
- Best 10-fold CV: **Leaky ReLU @ 20 epochs** — 94.37% ± 0.96 accuracy, 94.55% ± 0.91 F1.
- Beats a frozen **EfficientNetB3** baseline by ~25 pp at the same epoch budget.

Full results dashboard is in the [interactive paper](../web).
