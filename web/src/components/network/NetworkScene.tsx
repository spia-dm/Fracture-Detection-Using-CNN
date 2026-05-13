"use client";

import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

type LayerSpec = {
  name: string;
  spatial: number;
  channels: number;
  kind: "conv" | "fc" | "input" | "output";
  detail: string;
  /** voxel-grid resolution for the heightmap preview above each layer */
  voxelGrid: number;
};

const layers: LayerSpec[] = [
  { name: "Input", spatial: 224, channels: 1, kind: "input", detail: "1 × 224 × 224", voxelGrid: 32 },
  { name: "Conv1", spatial: 111, channels: 32, kind: "conv", detail: "32 × 111²", voxelGrid: 24 },
  { name: "Conv2", spatial: 54, channels: 64, kind: "conv", detail: "64 × 54²", voxelGrid: 14 },
  { name: "Conv3", spatial: 26, channels: 128, kind: "conv", detail: "128 × 26²", voxelGrid: 8 },
  { name: "FC1", spatial: 1, channels: 256, kind: "fc", detail: "256", voxelGrid: 0 },
  { name: "FC2", spatial: 1, channels: 128, kind: "fc", detail: "128", voxelGrid: 0 },
  { name: "FC3", spatial: 1, channels: 1, kind: "output", detail: "Sigmoid", voxelGrid: 0 },
];

function useThemeColors() {
  const [colors, setColors] = useState({
    fg: "#0a0a0a",
    bg: "#fafaf9",
    muted: "#71717a",
  });
  useEffect(() => {
    const read = () => {
      const theme =
        document.documentElement.getAttribute("data-theme") ?? "light";
      setColors(
        theme === "dark"
          ? { fg: "#ededed", bg: "#060607", muted: "#a1a1aa" }
          : { fg: "#0a0a0a", bg: "#fafaf9", muted: "#71717a" },
      );
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);
  return colors;
}

function vizSize(layer: LayerSpec): [number, number, number] {
  const depth = 0.18 + Math.log10(layer.channels + 1) * 0.35;
  const face = 0.35 + Math.log10(layer.spatial + 1) * 0.65;
  return [depth, face, face];
}

function positions() {
  const gap = 1.8;
  const out: number[] = [];
  let cursor = 0;
  layers.forEach((layer, i) => {
    const [d] = vizSize(layer);
    if (i === 0) {
      cursor = d / 2;
    } else {
      const [prevD] = vizSize(layers[i - 1]);
      cursor += prevD / 2 + gap + d / 2;
    }
    out.push(cursor);
  });
  const total =
    out[out.length - 1] + vizSize(layers[layers.length - 1])[0] / 2;
  return out.map((x) => x - total / 2);
}

const layerColor = (kind: LayerSpec["kind"]) => {
  switch (kind) {
    case "input":
      return "#94a3b8";
    case "conv":
      return "#22d3ee";
    case "fc":
      return "#a78bfa";
    case "output":
      return "#f97316";
  }
};

// Procedural X-ray ---------------------------------------------------------

function drawXray(ctx: CanvasRenderingContext2D, size: number) {
  ctx.fillStyle = "#04060c";
  ctx.fillRect(0, 0, size, size);

  const grad = ctx.createLinearGradient(size * 0.3, 0, size * 0.7, 0);
  grad.addColorStop(0, "rgba(160,200,235,0)");
  grad.addColorStop(0.5, "rgba(220,235,255,0.95)");
  grad.addColorStop(1, "rgba(160,200,235,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(size * 0.36, size * 0.05);
  ctx.quadraticCurveTo(size * 0.5, size * 0.5, size * 0.45, size * 0.95);
  ctx.lineTo(size * 0.62, size * 0.95);
  ctx.quadraticCurveTo(size * 0.58, size * 0.5, size * 0.68, size * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(220,235,255,0.85)";
  ctx.beginPath();
  ctx.ellipse(
    size * 0.52,
    size * 0.12,
    size * 0.16,
    size * 0.09,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

  ctx.strokeStyle = "#22d3ee";
  ctx.lineWidth = Math.max(2, size / 90);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(size * 0.4, size * 0.55);
  ctx.lineTo(size * 0.55, size * 0.6);
  ctx.lineTo(size * 0.5, size * 0.66);
  ctx.lineTo(size * 0.6, size * 0.7);
  ctx.stroke();
}

function useXrayCanvas() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    drawXray(canvas.getContext("2d")!, 256);
    return canvas;
  }, []);
}

// Voxel heightmap (single grid above each conv / input layer) -------------

function VoxelHeightmap({
  source,
  grid,
  width,
  accent,
  pulsePhase,
}: {
  source: HTMLCanvasElement;
  grid: number;
  width: number;
  accent: string;
  pulsePhase: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const cells = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = grid;
    c.height = grid;
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(source, 0, 0, grid, grid);
    const px = ctx.getImageData(0, 0, grid, grid).data;
    const out: { x: number; y: number; intensity: number }[] = [];
    for (let j = 0; j < grid; j++) {
      for (let i = 0; i < grid; i++) {
        const idx = (j * grid + i) * 4;
        const intensity = (px[idx] + px[idx + 1] + px[idx + 2]) / (3 * 255);
        out.push({ x: i, y: j, intensity });
      }
    }
    return out;
  }, [source, grid]);

  const cellSize = (width * 0.92) / grid;
  const halfSpan = (width * 0.92) / 2;

  useLayoutEffect(() => {
    if (!ref.current) return;
    const dummy = new THREE.Object3D();
    const base = new THREE.Color(accent);
    const hi = new THREE.Color("#ffffff");
    cells.forEach((cell, i) => {
      const h = 0.04 + Math.pow(cell.intensity, 1.3) * 0.5;
      dummy.position.set(
        cell.x * cellSize - halfSpan + cellSize / 2,
        h / 2,
        cell.y * cellSize - halfSpan + cellSize / 2,
      );
      dummy.scale.set(cellSize * 0.84, h, cellSize * 0.84);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
      const c = base.clone().lerp(hi, cell.intensity * 0.65);
      ref.current!.setColorAt(i, c);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [cells, accent, cellSize, halfSpan]);

  // Soft pulse
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const p = Math.max(0, Math.sin(t * 1.5 + pulsePhase));
    ref.current.scale.y = 1 + p * 0.15;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, cells.length]}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.45} metalness={0.1} />
    </instancedMesh>
  );
}

// Scene --------------------------------------------------------------------

export function NetworkScene() {
  const xs = useMemo(positions, []);
  const theme = useThemeColors();
  const xrayCanvas = useXrayCanvas();

  return (
    <group position={[0, -0.4, 0]}>
      {/* Flow rail */}
      <mesh position={[(xs[0] + xs[xs.length - 1]) / 2, -0.2, 0]}>
        <boxGeometry args={[xs[xs.length - 1] - xs[0] + 2, 0.014, 0.014]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} />
      </mesh>

      {layers.map((layer, i) => {
        const size = vizSize(layer);
        const color = layerColor(layer.kind);
        return (
          <group key={layer.name} position={[xs[i], 0, 0]}>
            {/* Solid box (inset slightly so the wireframe overlay never z-fights) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[size[0] * 0.98, size[1] * 0.98, size[2] * 0.98]} />
              <meshStandardMaterial
                color={color}
                transparent
                opacity={
                  layer.kind === "input" || layer.kind === "output"
                    ? 0.32
                    : 0.45
                }
                roughness={0.55}
                metalness={0.1}
              />
            </mesh>

            {/* Wireframe sitting just outside, no depth test so it always renders cleanly */}
            <mesh>
              <boxGeometry args={size} />
              <meshBasicMaterial
                color={color}
                wireframe
                transparent
                opacity={0.6}
                depthTest={false}
              />
            </mesh>

            {/* Voxel heightmap above the box for input + conv layers */}
            {layer.voxelGrid > 0 && (
              <group position={[0, size[1] / 2 + 0.7, 0]}>
                <VoxelHeightmap
                  source={xrayCanvas}
                  grid={layer.voxelGrid}
                  width={Math.max(1.4, size[1] * 1.1)}
                  accent={color}
                  pulsePhase={i * 0.6}
                />
                <Billboard position={[0, -0.18, 0]}>
                  <Text
                    fontSize={0.13}
                    color={theme.muted}
                    outlineWidth={0.012}
                    outlineColor={theme.bg}
                    anchorX="center"
                    anchorY="middle"
                    material-toneMapped={false}
                  >
                    {`${layer.voxelGrid} × ${layer.voxelGrid}`}
                  </Text>
                </Billboard>
              </group>
            )}

            {/* Billboard-anchored labels: always face the camera */}
            <Billboard
              position={[
                0,
                size[1] / 2 + (layer.voxelGrid > 0 ? 1.6 : 0.55),
                0,
              ]}
            >
              <Text
                fontSize={0.3}
                color={theme.fg}
                outlineWidth={0.025}
                outlineColor={theme.bg}
                anchorX="center"
                anchorY="middle"
                material-toneMapped={false}
              >
                {layer.name}
              </Text>
              <Text
                position={[0, -0.27, 0]}
                fontSize={0.17}
                color={theme.muted}
                outlineWidth={0.015}
                outlineColor={theme.bg}
                anchorX="center"
                anchorY="middle"
                material-toneMapped={false}
              >
                {layer.detail}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
