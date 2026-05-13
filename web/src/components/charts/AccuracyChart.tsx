"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { runs, activationColors, type Activation } from "@/lib/data";

type Metric = "Acc" | "P" | "R" | "F1";

const metricLabels: Record<Metric, string> = {
  Acc: "Accuracy",
  P: "Precision",
  R: "Recall",
  F1: "F1 Score",
};

const activations: Activation[] = ["ReLU", "Leaky ReLU", "PReLU"];

function pickField(
  r: (typeof runs)[number],
  mode: "single" | "kfold",
  m: Metric,
) {
  if (mode === "single") {
    if (m === "Acc") return r.singleAcc;
    if (m === "P") return r.singleP;
    if (m === "R") return r.singleR;
    return r.singleF1;
  }
  if (m === "Acc") return r.kfoldAcc;
  if (m === "P") return r.kfoldP;
  if (m === "R") return r.kfoldR;
  return r.kfoldF1;
}

export function AccuracyChart({ mode = "single" }: { mode?: "single" | "kfold" }) {
  const [metric, setMetric] = useState<Metric>("Acc");

  const data = useMemo(() => {
    const epochSet = new Set<number>();
    runs.forEach((r) => epochSet.add(r.epochs));
    const epochs = Array.from(epochSet).sort((a, b) => a - b);

    return epochs.map((e) => {
      const row: Record<string, number | string> = { epochs: e };
      activations.forEach((act) => {
        const run = runs.find((r) => r.epochs === e && r.activation === act);
        if (run) row[act] = pickField(run, mode, metric);
      });
      return row;
    });
  }, [metric, mode]);

  const subtitle =
    mode === "single"
      ? "Held-out test split · seed = 42"
      : "10-fold cross validation · mean over folds";

  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            {metricLabels[metric]} across epochs
          </h3>
          <p className="mt-1 text-sm text-foreground/50">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-foreground/10 bg-background/60 p-1">
          {(Object.keys(metricLabels) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                metric === m
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              <span className="sm:hidden">{m}</span>
              <span className="hidden sm:inline">{metricLabels[m]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-[280px] sm:h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="epochs"
              stroke="var(--chart-axis)"
              tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
              label={{
                value: "Epochs",
                position: "insideBottom",
                offset: -4,
                fill: "var(--chart-axis)",
                fontSize: 12,
              }}
              type="number"
              domain={[0, 22]}
              ticks={[1, 5, 10, 15, 20]}
            />
            <YAxis
              domain={[0, 100]}
              stroke="var(--chart-axis)"
              tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
              tickFormatter={(v) => `${v}%`}
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
              <Line
                key={act}
                type="monotone"
                dataKey={act}
                stroke={activationColors[act]}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 0, fill: activationColors[act] }}
                activeDot={{
                  r: 6,
                  stroke: activationColors[act],
                  strokeWidth: 2,
                  fill: "var(--chart-active-fill)",
                }}
                connectNulls
                animationDuration={900}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
