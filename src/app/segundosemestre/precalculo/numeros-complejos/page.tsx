"use client";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import usePrecalculo from "@/hooks/usePrecalculo";
import { Op } from "@/types/index";
import TitleCourse from "@/components/TitleCourse";
import AppLayout from "@/components/AppLayout";

// ------- componente principal -------
export default function ComplexSteps() {
  const {
    a2,
    b2,
    setA2,
    setB2,
    complexLatex,
    setOp,
    op,
    steps2,
    prettyResult,
    powSteps,
    setExp,
    exp,
  } = usePrecalculo();

  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <div className="min-h-screen flex flex-col p-4 gap-4 items-center bg-background text-foreground">
        <TitleCourse course="Operaciones con Números Complejos" />
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <div className="flex flex-row gap-4 border border-outline-variant bg-surface-container-low p-4 rounded-xl shadow-sm">
            {/* A */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-2">Número A</div>
              <div className="flex flex-row   gap-2 items-center justify-center">
                <input
                  type="number"
                  className="rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface p-2 w-16 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={a2.re}
                  onChange={(e) => setA2({ ...a2, re: Number(e.target.value) })}
                  placeholder="Parte real"
                />
                <input
                  type="number"
                  className="rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface p-2 w-16 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={a2.im}
                  onChange={(e) => setA2({ ...a2, im: Number(e.target.value) })}
                  placeholder="Parte imaginaria"
                />
              </div>
            </div>

            {/* B */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-2">Número B</div>
              <div className="flex flex-row w-full gap-2 items-center justify-center">
                <input
                  type="number"
                  className="rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface p-2 w-16 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={b2.re}
                  onChange={(e) => setB2({ ...b2, re: Number(e.target.value) })}
                  placeholder="Parte real"
                />
                <input
                  type="number"
                  className="rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface p-2 w-16 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={b2.im}
                  onChange={(e) => setB2({ ...b2, im: Number(e.target.value) })}
                  placeholder="Parte imaginaria"
                />
              </div>
            </div>
          </div>
          {/* Operación */}
          <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low shadow-sm">
            <div className="flex flex-row items-center justify-between gap-2">
              <span className="font-medium">
                A:
                <InlineMath math={complexLatex(a2, false)} />{" "}
              </span>{" "}
              <span className="font-medium">
                B:
                <InlineMath math={complexLatex(b2, false)} />
              </span>
            </div>
            <select
              className="w-full rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface p-2 mt-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={op}
              onChange={(e) => setOp(e.target.value as Op)}
            >
              <option value="add">Suma (A + B)</option>
              <option value="sub">Resta (A − B)</option>
              <option value="mul">Multiplicación (A·B)</option>
              <option value="div">División (A / B)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-row max-sm:flex-col w-full items-start justify-center gap-2">
          {/* Pasos */}
          <div className="border border-outline-variant flex flex-col rounded-xl p-4 items-center justify-center w-full bg-surface-container-low shadow-sm">
            <h1 className="text-sm font-semibold">Procedimiento paso a paso</h1>
            <div className="flex flex-col">
              {steps2.map((eq, i) => (
                <div key={i} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-2 my-1 overflow-x-auto">
                  <BlockMath math={eq} />
                </div>
              ))}
            </div>
            {/* Resultado principal */}
            <div className="flex flex-row gap-4 border border-outline-variant bg-primary/10 shadow-md rounded-2xl p-4 mt-4 items-center">
              <div className="flex justify-between items-center">
                <h1 className="text-sm font-medium">Resultado</h1>
              </div>
              <div className="text-lg">
                <InlineMath math={prettyResult} />
              </div>
            </div>
          </div>

          {/* Potencias de i */}
          <div className="p-4 flex flex-col rounded-xl border border-outline-variant w-full bg-surface-container-low shadow-sm">
            <div className="flex items-center  gap-2">
              <h1 className="text-sm font-semibold">
                Potencias de <InlineMath math="i^n" />
              </h1>
              <div>
                <label className="text-xs block">n (entero)</label>
                <input
                  type="number"
                  className="rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface p-1 w-16 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={exp}
                  onChange={(e) => setExp(Number(e.target.value))}
                />
              </div>
            </div>

            {powSteps.map((eq, i) => (
              <div key={i} className="rounded-lg bg-surface-container-lowest border border-outline-variant p-2 my-1 overflow-x-auto">
                <BlockMath math={eq} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          En división se usa el conjugado para eliminar la parte imaginaria del
          denominador.
        </p>
      </div>
    </AppLayout>
  );
}
