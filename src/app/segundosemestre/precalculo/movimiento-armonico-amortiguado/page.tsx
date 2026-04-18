"use client";

import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import usePrecalculo from "@/hooks/usePrecalculo";
import TitleCourse from "@/components/TitleCourse";
import AppLayout from "@/components/AppLayout";

export default function DampedMotion() {
  const { k2, setK2, c2, setC2, f2, setF2, data7 } = usePrecalculo();

  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <div className="flex flex-col gap-2 min-h-screen bg-background text-foreground p-4">
        <TitleCourse course="Movimiento Armónico Amortiguado" />
        <div className="flex flex-wrap items-center justify-center gap-4 bg-surface-container-low border border-outline-variant rounded-xl p-4">
          <InlineMath math={"y = ke^{-ct} \\sin(\\omega t)"} />
          <InlineMath math={"y = ke^{-ct} \\cos(\\omega t), \\quad c > 0"} />
        </div>
        {/* Inputs dinámicos */}
        <div className="flex flex-wrap w-full items-center justify-center gap-4">
          <div>
            <label className="block text-xs font-medium">
              k (amplitud inicial)
            </label>
            <input
              type="number"
              value={k2}
              step="0.1"
              onChange={(e) => setK2(Number(e.target.value))}
              className="border border-outline-variant bg-surface-container-lowest text-on-surface rounded-md p-1 w-auto focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">
              c (amortiguamiento)
            </label>
            <input
              type="number"
              value={c2}
              step="0.1"
              onChange={(e) => setC2(Number(e.target.value))}
              className="border border-outline-variant bg-surface-container-lowest text-on-surface rounded-md p-1 w-auto focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium">f (frecuencia)</label>
            <input
              type="number"
              value={f2}
              step="0.1"
              onChange={(e) => setF2(Number(e.target.value))}
              className="border border-outline-variant bg-surface-container-lowest text-on-surface rounded-md p-1 w-auto focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap w-full items-center justify-center gap-4">
          <InlineMath math={`k = ${k2}`} />
          <InlineMath math={`c = ${c2}`} />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <InlineMath
            math={`f = ${f2} = \\tfrac{\\omega}{2\\pi} \\; \\Rightarrow \\; \\omega = ${
              2 * f2
            }\\pi`}
          />
          <InlineMath
            math={`p = \\tfrac{2\\pi}{\\omega} = \\tfrac{2\\pi}{${
              2 * f2
            }\\pi} = \\tfrac{1}{${f2}} = ${(1 / f2).toFixed(2)}`}
          />
          <h3 className="font-semibold">Ecuación final:</h3>
          <InlineMath
            math={`y = ${k2} e^{- ${c2} t}  \\cos(${2 * f2}\\pi t)`}
          />
        </div>

        {/* Gráfica */}
        <div className="w-full h-[380px] bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data7}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="t"
                label={{
                  value: "t",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#1f77b4"
                dot={false}
                name="y(t)"
              />
              <Line
                type="monotone"
                dataKey="upper"
                stroke="red"
                strokeDasharray="5 5"
                dot={false}
                name="envolvente superior"
              />
              <Line
                type="monotone"
                dataKey="lower"
                stroke="red"
                strokeDasharray="5 5"
                dot={false}
                name="envolvente inferior"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
