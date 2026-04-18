"use client";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import Fraction from "fraction.js";
import BotonUtil from "@/utils/BotonUtil";
import useAlgebra from "@/hooks/useAlgebra";
import { Matrix } from "@/types/index";
import TitleCourse from "@/components/TitleCourse";
import AppLayout from "@/components/AppLayout";

export default function CramerSolver() {
  const {
    size2,
    matrix3,
    result,
    showFraction,
    setShowFraction,
    solve3,
    handleChange3,
    handleSizeChange3,
    matrixToString,
    determinantExpression,
  } = useAlgebra();

  return (
     <AppLayout title="Segundo Semestre" activeTopicId="2">
    <div className="p-6 bg-background text-foreground min-h-screen">
      <TitleCourse course="Método de Cramer" />

      <div className="flex flex-col gap-2 items-center">
        <div className="flex flex-row gap-2">
          <div className="flex flex-col items-center justify-center  gap-4">
            {[2, 3, 4].map((n) => (
              <BotonUtil
                label={`${n}x${n}`}
                key={n}
                onClick={() => handleSizeChange3(n)}
              className={`px-2 py-1 text-xs transition-colors rounded-md shadow-sm ${
                size2 === n ? "bg-primary text-primary-foreground" : "bg-surface-container-low text-on-surface border border-outline-variant hover:bg-surface-container-high"
              }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {matrix3.map((row, i) => (
              <div key={i} className="flex gap-2">
                {row.map((val, j) => (
                  <input
                    key={j}
                    type="number"
                    value={val.toString()}
                    onChange={(e) => handleChange3(e, i, j)}
                  className={`border border-outline-variant text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-md p-2 w-12 text-center transition-all ${
                    j === size2 ? "bg-primary/20" : "bg-surface-container-lowest"
                  }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-4">
          <BotonUtil
            label="Resolver"
            onClick={solve3}
            className="px-4 text-xs py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow rounded-md"
          />
          <BotonUtil
            label={` ${showFraction ? "Decimales" : "Fracciones"}`}
            onClick={() => setShowFraction(!showFraction)}
            className="px-4 py-2 text-xs bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant transition-colors shadow-sm rounded-md"
          />
        </div>
      </div>

      {result && (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant shadow-sm">
          {result.sols.map((sol, i) => {
            const coeffs = matrix3.map((row) => row.slice(0, size2));
            const constants: Fraction[] = matrix3.map(
              (row) => new Fraction(row[size2])
            );
            const modified: Matrix = coeffs.map((row, r) =>
              row.map((val, c) => (c === i ? constants[r] : val))
            );
            const frac = showFraction
              ? sol.toFraction(false)
              : sol.valueOf().toFixed(4);
            return (
              <div
                key={i}
                className="flex flex-col gap-2 items-center bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-4 w-96"
              >
                <p>
                  Valor de <InlineMath math={`x_{${i + 1}}`} />
                </p>{" "}
                <div className=" text-sm ">
                  <BlockMath
                    math={`x_{${i + 1}} = \\frac{\\Delta_{${
                      i + 1
                    }}}{\\Delta_{${"S"}}} =  
\\frac{\\begin{vmatrix} ${matrixToString(modified)} \\end{vmatrix}}
{\\begin{vmatrix} ${matrixToString(coeffs)} \\end{vmatrix}}`}
                  />

                  <div className="w-auto h-16 max-sm:h-10 flex items-center text-xl overflow-x-auto max-w-full max-sm:text-xs bg-surface-container-high text-on-surface rounded-xl px-4 mt-2">
                    <InlineMath
                      math={`  
 \\frac{${determinantExpression(modified)}}{${determinantExpression(coeffs)}} 
`}
                    />
                  </div>
                  <BlockMath math={`= ${frac}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {result && (
        <h3 className="text-lg font-bold flex flex-col items-center justify-center">
          Solución del sistema:
          <BlockMath
            math={`\\left( ${
              result
                ? result.sols
                    .map((s) =>
                      showFraction
                        ? s.toFraction(false)
                        : s.valueOf().toFixed(4)
                    )
                    .join(",   ")
                : ""
            } \\right)`}
          />
        </h3>
      )}
    </div></AppLayout>
  );
}
