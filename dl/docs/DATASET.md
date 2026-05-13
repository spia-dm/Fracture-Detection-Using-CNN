# Dataset

The notebooks expect the
[Kaggle bone fracture dataset](https://www.kaggle.com/datasets/siddxt/fracture-detection-using-cnn)
to be present at `dataset/` (relative to wherever the notebook is launched
from), pre-organized into `train/`, `test/` and `val/` folders.

## Layout

```
dataset/
├── train/
│   ├── fractured/
│   └── not_fractured/
├── test/
│   ├── fractured/
│   └── not_fractured/
└── val/
    ├── fractured/
    └── not_fractured/
```

Each `*.ipynb` loads the splits with
`torchvision.datasets.ImageFolder("dataset/<split>", ...)`.

## Split summary

Pre-organized 84 / 8 / 8 split.

| Split | Fractured | Not fractured | Total | Class balance |
| ----- | --------- | ------------- | ----- | ------------- |
| Train | 2 079 | 2 020 | 4 099 | 50.7 / 49.3 |
| Test | 200 | 201 | 401 | 49.9 / 50.1 |
| Val | 169 | 237 | 406 | 41.6 / 58.4 |
| **Total** | **2 448** | **2 458** | **4 906** | **49.9 / 50.1** |

The training and test splits are near-perfectly balanced; only the validation
split is slightly skewed (more healthy than fractured).
