"use client";

import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { runs, activationColors, type Activation } from "@/lib/data";

const activations: Activation[] = ["ReLU", "Leaky ReLU", "PReLU"];

export function MetricRadar({
  mode = "single",
}: {
  mode?: "single" | "kfold";
}) {
  const [epochs, setEpochs] = useState(20);

  const epochOptions = Array.from(new Set(runs.map((r) => r.epochs))).sort(
    (a, b) => a - b,
  );

  const axes = ["Accuracy", "Precision", "Recall", "F1"] as const;

  function pick(r: (typeof runs)[number], axis: (typeof axes)[number]) {
    if (mode === "single") {
      if (axis === "Accuracy") return r.singleAcc;
      if (axis === "Precision") return r.singleP;
      if (axis === "Recall") return r.singleR;
      return r.singleF1;
    }
    if (axis === "Accuracy") return r.kfoldAcc;
    if (axis === "Precision") return r.kfoldP;
    if (axis === "Recall") return r.kfoldR;
    return r.kfoldF1;
  }

  const data = axes.map((axis) => {
    const row: Record<string, number | string> = { metric: axis };
    activations.forEach((act) => {
      const run = runs.find((r) => r.epochs === epochs && r.activation === act);
      if (run) row[act] = pick(run, axis);
    });
    return row;
  });

  const subtitle =
    mode === "single"
      ? `Held-out test split · seed = 42 · ${epochs} epochs`
      : `10-fold CV mean · ${epochs} epochs`;

  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            Activation profile
          </h3>
          <p className="mt-1 text-sm text-foreground/50">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-foreground/10 bg-background/60 p-1">
          {epochOptions.map((e) => (
            <button
              key={e}
              onClick={() => setEpochs(e)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                epochs === e
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {e}e
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] sm:h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="var(--chart-grid)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "var(--chart-axis)", fontSize: 10 }}
              stroke="var(--chart-grid)"
            />
            <Tooltip
              contentStyle={{
                background: "var(--chart-tooltip-bg)",
                border: "1px solid var(--chart-tooltip-border)",
                borderRadius: 12,
                color: "var(--chart-tooltip-fg)",
              }}
              formatter={(value) => `${Number(value).toFixed(2)}%`}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: "var(--chart-axis)", paddingTop: 8 }}
            />
            {activations.map((act) => (
              <Radar
                key={act}
                name={act}
                dataKey={act}
                stroke={activationColors[act]}
                fill={activationColors[act]}
                fillOpacity={0.18}
                strokeWidth={2}
                animationDuration={700}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
