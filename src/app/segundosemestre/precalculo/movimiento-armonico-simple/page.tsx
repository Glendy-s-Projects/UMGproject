"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import TitleCourse from "@/components/TitleCourse";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonUtil from "@/utils/BotonUtil";
import AppLayout from "@/components/AppLayout";

export default function SHMStepsVisualizer() {
  const {
    amplitudeInput,
    setAmplitudeInput,
    omegaInput,
    setOmegaInput,
    mode,
    setMode,
    a4,
    omegaTex,
    periodTex,
    frequencyTex,
    periodNum,
    frequencyNum,
    data6,
  } = usePrecalculo();

  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <div className="flex flex-col gap-2 min-h-screen bg-background text-foreground p-4">
        <TitleCourse course="Movimiento Armónico Simple" />

        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-wrap gap-4 items-center justify-center w-full">
            <div>
              <label className="block text-sm">a (amplitud)</label>
              <input
                value={amplitudeInput}
                onChange={(e) => setAmplitudeInput(e.target.value)}
                className="w-full p-2 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm">ω (omega)</label>
              <input
                value={omegaInput}
                onChange={(e) => setOmegaInput(e.target.value)}
                className="w-full p-2 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 mt-2">
            <BotonUtil
              label="sin"
              className={`px-4 py-2 rounded-md transition-colors shadow-sm ${
                mode === "sin" ? "bg-primary text-primary-foreground" : "bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container-high"
              }`}
              onClick={() => setMode("sin")}
            />
            <BotonUtil
              label="cos"
              className={`px-4 py-2 rounded-md transition-colors shadow-sm ${
                mode === "cos" ? "bg-primary text-primary-foreground" : "bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container-high"
              }`}
              onClick={() => setMode("cos")}
            />
            <InlineMath math={`y(t)= ${a4}\\${mode}( ${omegaTex}t )`} />
          </div>
        </div>
        <h2 className="font-semibold text-center">Paso a paso</h2>
        <div className="flex flex-wrap  justify-center gap-2 w-full">
          <div className="flex flex-col border-r border-outline-variant pr-4 mr-2">
            <strong>a. Amplitud</strong>
            <BlockMath math={`A=|${a4}|=${Math.abs(a4)}`} />
          </div>

          <div className="flex flex-col items-center gap-4 border-r border-outline-variant pr-4 mr-2">
            <strong>a.2 Periodo</strong>
            <InlineMath math={"p=\\dfrac{2\\pi}{\\omega}"} />
            <InlineMath math={`p=${periodTex} `} />
            <InlineMath math={`p =${periodNum}`} />
          </div>

          <div className="flex flex-col items-center gap-2 ">
            <strong>a.3 Frecuencia</strong>
            <InlineMath math={"f=\\dfrac{\\omega}{2\\pi}"} />
            <InlineMath math={`f=${frequencyTex} `} />
            <InlineMath math={`f = ${frequencyNum}`} />
          </div>
        </div>

        <div className="h-[360px] border border-outline-variant bg-surface-container-lowest rounded-xl p-4 shadow-sm flex flex-col">
          <h1 className="text-center">Gráfica</h1>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data6}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="t"
                tickFormatter={(v) => Number(v).toFixed(2)}
                label={{
                  value: "t (s)",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                domain={[
                  Math.min(...data6.map((d) => d.y)) - 0.5,
                  Math.max(...data6.map((d) => d.y)) + 0.5,
                ]}
              />
              <Tooltip
                formatter={(value: number) =>
                  typeof value === "number" ? value.toFixed(4) : value
                }
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#8884d8"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
