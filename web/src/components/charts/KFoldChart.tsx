"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { runs } from "@/lib/data";

type Metric = "Acc" | "P" | "R" | "F1";

const metricMeta: Record<Metric, string> = {
  Acc: "Accuracy",
  P: "Precision",
  R: "Recall",
  F1: "F1 Score",
};

function pickSingle(r: (typeof runs)[number], m: Metric) {
  if (m === "Acc") return r.singleAcc;
  if (m === "P") return r.singleP;
  if (m === "R") return r.singleR;
  return r.singleF1;
}
function pickKFold(r: (typeof runs)[number], m: Metric) {
  if (m === "Acc") return r.kfoldAcc;
  if (m === "P") return r.kfoldP;
  if (m === "R") return r.kfoldR;
  return r.kfoldF1;
}

export function KFoldChart() {
  const [metric, setMetric] = useState<Metric>("Acc");

  const data = runs.map((r) => ({
    config: `${shortAct(r.activation)}-${r.epochs}`,
    single: Number(pickSingle(r, metric).toFixed(2)),
    kfold: Number(pickKFold(r, metric).toFixed(2)),
  }));

  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.04] p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            Held-out vs 10-fold · {metricMeta[metric]}
          </h3>
          <p className="mt-1 text-sm text-foreground/50">
            All 15 configurations side by side. Watch the PReLU bars on the
            right.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-full border border-foreground/10 bg-background/60 p-1">
          {(Object.keys(metricMeta) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                metric === m
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {metricMeta[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[440px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: -8, bottom: 32 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="config"
              stroke="var(--chart-axis)"
              tick={{ fontSize: 10, fill: "var(--chart-axis)" }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={50}
            />
            <YAxis
              domain={[0, 100]}
              stroke="var(--chart-axis)"
              tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: "var(--chart-grid)" }}
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
            <Bar
              dataKey="single"
              name="Held-out (seed=42)"
              fill="#f87171"
              radius={[4, 4, 0, 0]}
              animationDuration={700}
            />
            <Bar
              dataKey="kfold"
              name="10-fold CV"
              fill="#60a5fa"
              radius={[4, 4, 0, 0]}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function shortAct(act: string) {
  if (act === "Leaky ReLU") return "LReLU";
  if (act === "PReLU") return "PReLU";
  return "ReLU";
}
