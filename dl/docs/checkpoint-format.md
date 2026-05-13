# Checkpoint format

The notebooks save per-layer state dicts into a single `.pth` file. There is
no enclosing `nn.Module`, so loading is layer-by-layer rather than
`model.load_state_dict(...)`.

The conv layers are named `con1` / `con2` / `con3` (no `v`). Match that
exactly when loading — `conv1_state_dict` will silently miss.

## Save

```python
torch.save({
    "con1_state_dict": con1.state_dict(),
    "con2_state_dict": con2.state_dict(),
    "con3_state_dict": con3.state_dict(),
    "fc1_state_dict":  fc1.state_dict(),
    "fc2_state_dict":  fc2.state_dict(),
    "fc3_state_dict":  fc3.state_dict(),
    "optimizer_state_dict": optimizer.state_dict(),
}, "run.pth")
```

## Load

```python
con1 = nn.Conv2d(1, 32, 3)         # 1 input channel — Canny edge map
con2 = nn.Conv2d(32, 64, 3)
con3 = nn.Conv2d(64, 128, 3)
fc1  = nn.Linear(128 * 26 * 26, 256)
fc2  = nn.Linear(256, 128)
fc3  = nn.Linear(128, 1)

ckpt = torch.load("run.pth", map_location="cpu")
con1.load_state_dict(ckpt["con1_state_dict"])
con2.load_state_dict(ckpt["con2_state_dict"])
con3.load_state_dict(ckpt["con3_state_dict"])
fc1.load_state_dict(ckpt["fc1_state_dict"])
fc2.load_state_dict(ckpt["fc2_state_dict"])
fc3.load_state_dict(ckpt["fc3_state_dict"])
```

## Activation

Each experiment fixes one activation and applies it after `con1`, `con2`,
`con3`, `fc1`, `fc2`. For `ReLU` and `Leaky ReLU` the activation has no
learnable parameters. For `PReLU`, each instance owns one learnable `α`
parameter — if you load a PReLU checkpoint into a fresh model, also
instantiate `nn.PReLU(init=0.25)` five times and load their state dicts (the
notebooks save them alongside the conv / fc keys).
