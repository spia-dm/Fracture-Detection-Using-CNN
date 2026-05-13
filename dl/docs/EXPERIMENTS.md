# Experiments

Every notebook in [`../notebooks/experiments/`](../notebooks/experiments)
trains the same CNN with a single knob varied: the activation function and
the number of training epochs. 15 configurations in total.

## Run matrix

| Notebook | Activation | Epochs |
| --- | --- | --- |
| `file1.ipynb`  | ReLU       | 1  |
| `file4.ipynb`  | ReLU       | 5  |
| `file7.ipynb`  | ReLU       | 10 |
| `file10.ipynb` | ReLU       | 15 |
| `file13.ipynb` | ReLU       | 20 |
| `file2.ipynb`  | Leaky ReLU | 1  |
| `file5.ipynb`  | Leaky ReLU | 5  |
| `file8.ipynb`  | Leaky ReLU | 10 |
| `file11.ipynb` | Leaky ReLU | 15 |
| `file14.ipynb` | Leaky ReLU | 20 |
| `file3.ipynb`  | PReLU      | 1  |
| `file6.ipynb`  | PReLU      | 5  |
| `file9.ipynb`  | PReLU      | 10 |
| `file12.ipynb` | PReLU      | 15 |
| `file15.ipynb` | PReLU      | 20 |

## Training parameters

| Parameter | Value |
| --- | --- |
| Optimizer | Adam |
| Learning rate | `1e-3` |
| Loss | Binary cross-entropy (BCELoss) |
| Batch size | 32 |
| Dropout | 0.3 |
| Image size | 224 × 224 |
| Random seed | 42 |

## Architecture

| Layer | Configuration | Output | Params |
| --- | --- | --- | --- |
| Input | 1 × 224 × 224 (Canny edge map) | 1 × 224 × 224 | — |
| `Conv1` | 1 → 32, 3×3 · stride 1 · pad 0 · MaxPool 2×2 · Dropout 0.3 | 32 × 111 × 111 | 320 |
| `Conv2` | 32 → 64, 3×3 · stride 1 · pad 0 · MaxPool 2×2 · Dropout 0.3 | 64 × 54 × 54 | 18 496 |
| `Conv3` | 64 → 128, 3×3 · stride 1 · pad 0 · MaxPool 2×2 · Dropout 0.3 | 128 × 26 × 26 | 73 856 |
| `FC1` | 86 528 (128·26·26) → 256 · Dropout 0.3 | 256 | 22 151 424 |
| `FC2` | 256 → 128 · Dropout 0.3 | 128 | 32 896 |
| `FC3` | 128 → 1 · Sigmoid | 1 | 129 |
| **Total** | | | **22 277 121** |

99.4% of the parameters live in FC1. The convolutional stack adds up to fewer
than 93 000.

## Data augmentation

**Train transform**

1. Resize → 256 × 256
2. Random rotation ±15°
3. Random crop → 224 × 224
4. Color jitter (`brightness=0.2`, `contrast=0.2`)
5. Random horizontal flip
6. Canny edge detection (thresholds 50 / 150) — collapses to single channel
7. `ToTensor`
8. Single-channel normalize (`mean=0.485`, `std=0.229`)

**Test / val transform**

1. Resize → 224 × 224
2. Canny edge detection (thresholds 50 / 150)
3. `ToTensor`
4. Single-channel normalize (`mean=0.485`, `std=0.229`)

## Evaluation

Each of the 15 configurations is evaluated twice:

- **Held-out test set** with random seed `42` for reproducibility (single run).
- **10-fold cross validation** — accuracy / precision / recall / F1 reported as mean ± std.

The K-fold notebooks in [`../notebooks/kfold/`](../notebooks/kfold) contain
the cross-validation runs split by reported metric (`accuracy`, `auc`, `f1`,
`precision`, `recall`).

## Headline results

- Best single-run (held-out, seed = 42): **ReLU @ 20 epochs** — 95.74 / 94.20 / 97.50 / 95.82 (Acc / P / R / F1).
- Best k-fold: **Leaky ReLU @ 20 epochs** — 94.37 ± 0.96 acc, 94.55 ± 0.91 F1.
- PReLU collapses to a single-class prediction under seed 42 but recovers under 10-fold CV (best 93.71%).
- Beats a frozen EfficientNetB3 baseline by ~25 percentage points at 10 epochs.
