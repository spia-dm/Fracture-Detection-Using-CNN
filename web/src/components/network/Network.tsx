"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { NetworkScene } from "./NetworkScene";

export function Network() {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.04]">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 3.5, 14]} fov={38} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[5, 6, 4]} intensity={0.8} castShadow />
        <directionalLight position={[-4, 3, -3]} intensity={0.3} color="#a78bfa" />
        <Suspense fallback={null}>
          <NetworkScene />
        </Suspense>
        <OrbitControls
          enableZoom
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3.2}
          minDistance={9}
          maxDistance={22}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.25em] text-foreground/40">
        drag to rotate
      </div>

      {/* Legend */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5 text-xs">
        <LegendItem color="#a1a1aa" label="Input" />
        <LegendItem color="#22d3ee" label="Conv block" />
        <LegendItem color="#a78bfa" label="FC layer" />
        <LegendItem color="#f97316" label="Output" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-foreground/60">
      <span
        className="inline-block h-2 w-2 rounded-sm"
        style={{ background: color }}
      />
      {label}
    </div>
  );
}
