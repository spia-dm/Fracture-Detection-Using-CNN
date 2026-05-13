// All numbers in this file are extracted verbatim from the fracture-detection
// paper bundled at the repo root as `frac.pdf`, Tables 2-7 and Figures 4-14.

export const paper = {
  title:
    "A Comparative Analysis of Activation Functions in CNN-Based Bone Fracture Detection",
  shortTitle: "Bone fracture detection · activation function comparison",
  year: 2024,
  task: "Binary classification, fractured vs. non-fractured X-rays",
  contributions: [
    "Shallow custom CNN with Canny edge preprocessing",
    "Activation sweep, ReLU, Leaky ReLU, PReLU",
    "Epoch sweep, 1, 5, 10, 15, 20",
    "Held-out test set with seed=42 + 10-fold cross validation",
    "Direct comparison against pretrained EfficientNetB3 baseline",
  ],
};

// --- Dataset --------------------------------------------------------------

export const datasetSplit = {
  total: 4906,
  train: { fractured: 2079, notFractured: 2020, total: 4099, share: 84 },
  test: { fractured: 200, notFractured: 201, total: 401, share: 8 },
  val: { fractured: 169, notFractured: 237, total: 406, share: 8 },
};

export const augmentationTrain = [
  "Resize → 256 × 256",
  "Random rotation ±15°",
  "Random crop → 224 × 224",
  "Color jitter (brightness 0.2, contrast 0.2)",
  "Random horizontal flip",
  "Canny edge detection (T_L = 50, T_H = 150)",
  "ToTensor",
  "ImageNet normalize",
];

export const augmentationEval = [
  "Resize → 224 × 224",
  "Canny edge detection (T_L = 50, T_H = 150)",
  "ToTensor",
  "ImageNet normalize",
];

// --- Architecture ---------------------------------------------------------

export type Layer = {
  name: string;
  detail: string;
  outShape: string;
  params: number;
};

export const architecture: Layer[] = [
  { name: "Input", detail: "1 × 224 × 224 (Canny edge map)", outShape: "1 × 224 × 224", params: 0 },
  { name: "Conv1", detail: "Conv2d(1→32, 3×3) → activation → MaxPool 2×2 → Dropout 0.3", outShape: "32 × 111 × 111", params: 320 },
  { name: "Conv2", detail: "Conv2d(32→64, 3×3) → activation → MaxPool 2×2 → Dropout 0.3", outShape: "64 × 54 × 54", params: 18496 },
  { name: "Conv3", detail: "Conv2d(64→128, 3×3) → activation → MaxPool 2×2 → Dropout 0.3", outShape: "128 × 26 × 26", params: 73856 },
  { name: "FC1", detail: "Linear(86 528 → 256) → activation → Dropout 0.3", outShape: "256", params: 22151424 },
  { name: "FC2", detail: "Linear(256 → 128) → activation → Dropout 0.3", outShape: "128", params: 32896 },
  { name: "FC3", detail: "Linear(128 → 1) → Sigmoid", outShape: "1", params: 129 },
];

export const totalParams = 22277121;

export const trainingHyperparams = [
  { label: "Optimizer", value: "Adam" },
  { label: "Learning rate", value: "1e-3" },
  { label: "Loss", value: "Binary cross-entropy" },
  { label: "Batch size", value: "32" },
  { label: "Dropout", value: "0.3" },
  { label: "Image size", value: "224 × 224" },
  { label: "Random seed", value: "42" },
];

// --- 6-step methodology --------------------------------------------------

export const methodology = [
  {
    step: "Data preprocessing",
    detail:
      "Per-pixel normalization (X' = (X − μ) / σ) and uniform resize to 224 × 224.",
  },
  {
    step: "Data augmentation",
    detail:
      "Random rotation ±15°, horizontal flip (p = 0.5), random crop, color-jitter on brightness and contrast.",
  },
  {
    step: "Image enhancement",
    detail:
      "Canny edge detection: Gaussian smoothing → Sobel gradient → double-thresholding (T_L = 50, T_H = 150). Highlights fracture lines.",
  },
  {
    step: "CNN architecture",
    detail:
      "Three Conv-MaxPool-Dropout blocks → three fully-connected layers → sigmoid head for binary classification.",
  },
  {
    step: "Optimization",
    detail:
      "Adam optimizer with binary cross-entropy loss; learning rate 0.001; batch size 32.",
  },
  {
    step: "Cross validation",
    detail:
      "10-fold cross validation alongside a held-out test split evaluated with a fixed random seed (42) for reproducibility.",
  },
];

// --- 15-config results table ---------------------------------------------

export type Activation = "ReLU" | "Leaky ReLU" | "PReLU";

export type RunResult = {
  activation: Activation;
  epochs: number;
  // Single-run, seed=42, held-out test set
  singleAcc: number;
  singleP: number;
  singleR: number;
  singleF1: number;
  // 10-fold cross validation (mean ± std)
  kfoldAcc: number;
  kfoldAccStd: number;
  kfoldP: number;
  kfoldPStd: number;
  kfoldR: number;
  kfoldRStd: number;
  kfoldF1: number;
  kfoldF1Std: number;
};

// Verbatim from Table 4.
export const runs: RunResult[] = [
  { activation: "ReLU", epochs: 1, singleAcc: 68.9223, singleP: 72.3529, singleR: 61.5, singleF1: 66.4865, kfoldAcc: 63.3469, kfoldAccStd: 2.9675, kfoldP: 71.0981, kfoldPStd: 3.858, kfoldR: 46.1781, kfoldRStd: 11.6057, kfoldF1: 55.0309, kfoldF1Std: 7.1486 },
  { activation: "ReLU", epochs: 5, singleAcc: 79.9499, singleP: 78.8462, singleR: 82.0, singleF1: 80.3922, kfoldAcc: 79.551, kfoldAccStd: 2.4757, kfoldP: 81.9932, kfoldPStd: 4.2173, kfoldR: 76.6146, kfoldRStd: 6.5565, kfoldF1: 78.8944, kfoldF1Std: 2.6981 },
  { activation: "ReLU", epochs: 10, singleAcc: 88.4712, singleP: 90.10442, singleR: 86.5, singleF1: 88.2653, kfoldAcc: 86.2449, kfoldAccStd: 3.2783, kfoldP: 83.3174, kfoldPStd: 4.167, kfoldR: 91.027, kfoldRStd: 5.6036, kfoldF1: 86.8516, kfoldF1Std: 3.3689 },
  { activation: "ReLU", epochs: 15, singleAcc: 90.9774, singleP: 87.6147, singleR: 95.5, singleF1: 91.3876, kfoldAcc: 90.2041, kfoldAccStd: 2.7758, kfoldP: 88.3017, kfoldPStd: 1.9189, kfoldR: 92.7546, kfoldRStd: 4.8933, kfoldF1: 90.414, kfoldF1Std: 2.8921 },
  { activation: "ReLU", epochs: 20, singleAcc: 95.7393, singleP: 94.2029, singleR: 97.5, singleF1: 95.8231, kfoldAcc: 91.8367, kfoldAccStd: 1.9188, kfoldP: 89.4889, kfoldPStd: 2.5207, kfoldR: 94.9599, kfoldRStd: 2.4073, kfoldF1: 92.1111, kfoldF1Std: 1.7719 },

  { activation: "Leaky ReLU", epochs: 1, singleAcc: 65.6642, singleP: 72.9927, singleR: 50.0, singleF1: 59.3472, kfoldAcc: 65.1837, kfoldAccStd: 5.7789, kfoldP: 75.5281, kfoldPStd: 6.2414, kfoldR: 46.0705, kfoldRStd: 15.7945, kfoldF1: 55.4379, kfoldF1Std: 12.4205 },
  { activation: "Leaky ReLU", epochs: 5, singleAcc: 83.7093, singleP: 81.106, singleR: 88.0, singleF1: 84.4125, kfoldAcc: 86.6531, kfoldAccStd: 2.2545, kfoldP: 86.2974, kfoldPStd: 3.615, kfoldR: 87.6285, kfoldRStd: 5.0681, kfoldF1: 86.7862, kfoldF1Std: 2.2712 },
  { activation: "Leaky ReLU", epochs: 10, singleAcc: 92.4812, singleP: 93.8144, singleR: 91.0, singleF1: 92.3858, kfoldAcc: 91.4082, kfoldAccStd: 1.6988, kfoldP: 89.5506, kfoldPStd: 1.9104, kfoldR: 93.9176, kfoldRStd: 3.6314, kfoldF1: 91.6224, kfoldF1Std: 1.6977 },
  { activation: "Leaky ReLU", epochs: 15, singleAcc: 94.9875, singleP: 93.6893, singleR: 96.5, singleF1: 95.0739, kfoldAcc: 93.1633, kfoldAccStd: 1.1037, kfoldP: 90.9511, kfoldPStd: 2.4193, kfoldR: 96.0329, kfoldRStd: 1.5358, kfoldF1: 93.3866, kfoldF1Std: 0.9079 },
  { activation: "Leaky ReLU", epochs: 20, singleAcc: 95.2381, singleP: 93.3014, singleR: 97.5, singleF1: 95.3545, kfoldAcc: 94.3673, kfoldAccStd: 0.9581, kfoldP: 91.7914, kfoldPStd: 1.5468, kfoldR: 97.5031, kfoldRStd: 1.0438, kfoldF1: 94.5508, kfoldF1Std: 0.9132 },

  { activation: "PReLU", epochs: 1, singleAcc: 49.8747, singleP: 0.0, singleR: 0.0, singleF1: 0.0, kfoldAcc: 60.7347, kfoldAccStd: 6.0031, kfoldP: 67.2698, kfoldPStd: 14.0421, kfoldR: 67.4945, kfoldRStd: 32.403, kfoldF1: 59.0141, kfoldF1Std: 16.3904 },
  { activation: "PReLU", epochs: 5, singleAcc: 50.1253, singleP: 50.1253, singleR: 100.0, singleF1: 66.778, kfoldAcc: 79.2653, kfoldAccStd: 4.9682, kfoldP: 85.3079, kfoldPStd: 3.9113, kfoldR: 71.0218, kfoldRStd: 13.2612, kfoldF1: 76.6731, kfoldF1Std: 7.8435 },
  { activation: "PReLU", epochs: 10, singleAcc: 50.1253, singleP: 50.1253, singleR: 100.0, singleF1: 66.778, kfoldAcc: 90.102, kfoldAccStd: 1.298, kfoldP: 89.0486, kfoldPStd: 1.3377, kfoldR: 91.5229, kfoldRStd: 2.7921, kfoldF1: 90.239, kfoldF1Std: 1.384 },
  { activation: "PReLU", epochs: 15, singleAcc: 50.1253, singleP: 50.1253, singleR: 100.0, singleF1: 66.778, kfoldAcc: 92.7755, kfoldAccStd: 1.6459, kfoldP: 92.0687, kfoldPStd: 2.0719, kfoldR: 93.6551, kfoldRStd: 3.0541, kfoldF1: 92.8165, kfoldF1Std: 1.7717 },
  { activation: "PReLU", epochs: 20, singleAcc: 50.1253, singleP: 50.1253, singleR: 100.0, singleF1: 66.778, kfoldAcc: 93.7143, kfoldAccStd: 1.4133, kfoldP: 91.9349, kfoldPStd: 3.2607, kfoldR: 96.0643, kfoldRStd: 2.0327, kfoldF1: 93.8887, kfoldF1Std: 1.2254 },
];

export const activationColors: Record<Activation, string> = {
  ReLU: "#22d3ee",
  "Leaky ReLU": "#a78bfa",
  PReLU: "#f97316",
};

// --- Best configurations -------------------------------------------------

export const bestSingleRun = {
  activation: "ReLU" as const,
  epochs: 20,
  accuracy: 95.74,
  precision: 94.2,
  recall: 97.5,
  f1: 95.82,
};

export const bestKFold = {
  activation: "Leaky ReLU" as const,
  epochs: 20,
  accuracy: 94.37,
  accuracyStd: 0.96,
  precision: 91.79,
  precisionStd: 1.55,
  recall: 97.5,
  recallStd: 1.04,
  f1: 94.55,
  f1Std: 0.91,
};

// PReLU collapses to a single class under seed=42 but recovers under k-fold.
export const preluRecovery = {
  bestKFoldAcc: 93.71,
  bestKFoldEpochs: 20,
};

// --- Confusion matrix (best single-run config) ---------------------------

export const confusionMatrix = {
  config: "ReLU · 20 epochs · seed = 42",
  truePositive: 78,
  falseNegative: 2,
  falsePositive: 5,
  trueNegative: 79,
};

// --- Baseline comparison (Table 5) ---------------------------------------

export const baselineComparison = {
  epochs: 10,
  proposed: {
    name: "Custom CNN + Canny edge",
    accuracy: 88.47,
    precision: 90.1,
    recall: 86.5,
    f1: 88.27,
  },
  baseline: {
    name: "EfficientNetB3 (pretrained)",
    accuracy: 63.33,
    precision: 54.31,
    recall: 52.5,
    f1: 53.29,
  },
};

// --- Model complexity (Tables 6-7) ---------------------------------------

export const modelComplexity = {
  proposed: {
    totalParams: 22277121,
    trainableParams: 22277121,
    frozenParams: 0,
    convLayers: 3,
    arch: "Custom shallow CNN",
    note: "99.4 % of parameters live in FC1 (86 528 → 256). Conv layers add up to less than 93 000.",
  },
  baseline: {
    totalParams: 11573040,
    trainableParams: 789505,
    frozenParams: 10783535,
    convLayers: 30,
    arch: "Pretrained deep CNN",
    note: "EfficientNetB3 backbone frozen; only 0.79 M classification-head parameters are trained.",
  },
};

// --- Headline metrics for the hero ---------------------------------------

export const headlineMetrics = {
  bestSingleAccuracy: 95.74,
  bestKFoldF1: 94.55,
  totalImages: 4906,
  configsTested: 15,
};

// --- Environment ---------------------------------------------------------

export const environment = [
  { label: "Python", value: "3.12.12" },
  { label: "PyTorch", value: "2.9.0 + cu126" },
  { label: "torchvision", value: "0.24.0 + cu126" },
  { label: "scikit-learn", value: "1.6.1" },
  { label: "NumPy", value: "2.0.2" },
  { label: "OpenCV", value: "4.12.0.88" },
  { label: "Matplotlib", value: "3.10.0" },
  { label: "Hardware", value: "Intel i7 · NVIDIA 6 GB · 16 GB RAM" },
];
