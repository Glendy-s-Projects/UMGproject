"use client";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import usePrecalculo from "@/hooks/usePrecalculo";
import TitleCourse from "@/components/TitleCourse";
import AppLayout from "@/components/AppLayout";

const PolynomialGX = () => {
  const {
    gLatex,
    polynomialExpr,
    handlePolynomialChange,
    factorization,
    roots,
    criticalPoints,
    data2,
    xMin,
    xMax,
  } = usePrecalculo();

  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <div className="px-6 py-2 flex flex-col min-h-screen bg-background text-foreground">
        <TitleCourse course="Gráfica de Polinomios" />

        <div className="flex flex-col max-sm:flex-col  items-center justify-center gap-2 ">
          <label className="font-medium">Ingrese el polinomio:</label>
          <div className="flex flex-col gap-2 pb-2 items-center">
            <div className="flex items-center gap-2">
              <span>f(x) =</span>
              <input
                type="text"
                value={polynomialExpr}
                onChange={handlePolynomialChange}
                className="border border-outline-variant bg-surface-container-lowest text-on-surface rounded-md px-2 py-1 flex-grow focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Ejemplo: x^3-2x^2-3x"
              />{" "}
            </div>
            <InlineMath math={`f(x) = ${gLatex}`} />
          </div>
        </div>

        {/* PASO A PASO con react-katex */}
        <div className="flex flex-row max-sm:flex-col w-full  gap-2">
          <div className=" w-auto">
            <h1 className=" font-semibold text-lg">
              Paso a paso (factorización y ceros)
            </h1>
            <div className="flex flex-col h-auto text-sm border border-outline-variant bg-surface-container-lowest p-4 rounded-xl">
              <BlockMath math={`f(x) = ${gLatex}`} />
              <BlockMath math={`f(x) = ${gLatex} = 0`} />
              <BlockMath math={`${factorization.expandedForm}`} />
              <BlockMath math={`${factorization.factorsForm}`} />
              <BlockMath math={`${factorization.equationForm}`} />
              <BlockMath math={`${factorization.rootsForm}`} />
            </div>
            {factorization.hasMultipleRoots && (
              <div className="mt-4 text-sm text-on-surface-variant">
                <strong>Observación:</strong> la raíz \(x=
                {factorization.multipleRootValue}\) tiene multiplicidad 2 (raíz
                doble).
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 w-full">
            <div className="w-full h-[420px]">
              <ResponsiveContainer>
                <LineChart
                  data={data2}
                  margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    domain={[xMin, xMax]}
                    tickCount={13}
                    label={{
                      value: "x",
                      position: "insideBottomRight",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "f(x)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip />
                  <Legend />

                  <ReferenceLine y={0} stroke="#888" strokeDasharray="4 4" />

                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="#1e40af"
                    strokeWidth={2}
                    dot={false}
                    name="f(x)"
                    isAnimationActive={false}
                  />

                  {roots.map((r, i) => (
                    <ReferenceDot
                      key={`root-${i}`}
                      x={r.x}
                      y={r.y}
                      r={6}
                      fill="#dc2626"
                      stroke="none"
                      label={{ value: `x=${r.x}`, position: "top" }}
                    />
                  ))}

                  {criticalPoints.map((p, i) => (
                    <ReferenceDot
                      key={`crit-${i}`}
                      x={p.x}
                      y={p.y}
                      r={6}
                      fill={p.type === "max" ? "#16a34a" : "#f59e0b"}
                      stroke="none"
                      label={{ value: p.label, position: "top" }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PolynomialGX;
