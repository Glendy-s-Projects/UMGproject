"use client";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import usePrecalculo from "@/hooks/usePrecalculo";
import TitleCourse from "@/components/TitleCourse";
import AppLayout from "@/components/AppLayout";

const PolynomialDivision: React.FC = () => {
  const {
    P,
    setP,
    D,
    setD,
    error,
    result,
    dividend,
    divisor,
    coeffsToLatexDESC,
    quotientLatex,
    remainderLatex,
    VISIBLE_STEPS,
  } = usePrecalculo();

  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <div className="p-4 text-foreground bg-background min-h-screen font-serif">
        <TitleCourse course=" División larga de polinomios" />
        <div className="flex flex-col gap-2 w-full items-center justify-center text-xl font-bold mb-4">
          <label className="text-sm">
            P(x):
            <input
              className="ml-2 text-on-surface bg-surface-container-lowest border border-outline-variant px-2 py-1 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={P}
              onChange={(e) => setP(e.target.value)}
              placeholder="Ej: 8x^4+6x^2-3x+1"
            />{" "}
            <InlineMath math={`P(x) = ${coeffsToLatexDESC(dividend)}`} />
          </label>
          <label className="text-sm">
            D(x):
            <input
              className="ml-2 text-on-surface bg-surface-container-lowest border border-outline-variant px-2 py-1 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={D}
              onChange={(e) => setD(e.target.value)}
              placeholder="Ej: 2x^2-x+2"
            />{" "}
            <InlineMath math={`D(x) = ${coeffsToLatexDESC(divisor)}`} />
          </label>
        </div>

        {/* Enunciado */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-center ">
            encuentre <InlineMath math="Q(x)" /> y <InlineMath math="R(x)" />
          </div>
          <br />
          <InlineMath math="P(x) = D(x)\,Q(x) + R(x)" />.
        </div>

        {error && <div className="mb-4 font-semibold text-destructive">{error}</div>}

        {/* ====== Tabla con estructura fija como la imagen ====== */}
        {result && (
          <div className="overflow-x-auto">
            <table className="table-auto border border-outline-variant bg-surface-container-lowest mx-auto text-lg rounded-lg overflow-hidden shadow-sm">
              <tbody>
                <tr>
                  {/* Columna izquierda: Divisor */}
                  <td className="px-4 py-2 text-center align-top border border-outline-variant">
                    <BlockMath math={coeffsToLatexDESC(divisor)} />
                  </td>

                  {/* Columna central: Dividendo y pasos (hasta VISIBLE_STEPS) */}
                  <td className="px-4 py-2 text-left border border-outline-variant">
                    {/* Dividend o inicial */}
                    <BlockMath math={coeffsToLatexDESC(dividend)} />
                    {/* Pasos */}
                    {result.steps2.slice(0, VISIBLE_STEPS).map((s, i) => (
                      <div key={i}>
                        <BlockMath
                          math={`-\\left(${coeffsToLatexDESC(
                            s.subtrahend,
                          )}\\right)`}
                        />
                        <BlockMath math={coeffsToLatexDESC(s.remainder)} />
                      </div>
                    ))}
                  </td>

                  {/* Columna derecha: Cociente (arriba) y Residuo (abajo) */}
                  <td className="px-4 py-2 font-bold border border-outline-variant align-top">
                    <div>
                      <BlockMath math={quotientLatex} />
                    </div>
                    <div className="mt-8">
                      <BlockMath math={remainderLatex} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Resultado final */}
            <div className="mt-6 text-center text-xl">
              <BlockMath
                math={`P(x) = \\left(${coeffsToLatexDESC(
                  divisor,
                )}\\right)\\left(${quotientLatex}\\right)+\\left(${remainderLatex}\\right)`}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PolynomialDivision;
