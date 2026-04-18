"use client";

import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";
import usePrecalculo from "@/hooks/usePrecalculo";
import BotonUtil from "@/utils/BotonUtil";
import TitleCourse from "@/components/TitleCourse";
import AppLayout from "@/components/AppLayout";

export default function ReglaDescartesExacto() {
  const { setInput2, input2, resultado, handleResolver } = usePrecalculo();

  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <div className="min-h-screen flex flex-col items-center gap-2 p-4 bg-background text-foreground">
        <TitleCourse course=" Descarte de Signos" />
        <div className="flex flex-col w-full items-center justify-center gap-2">
          <div className="flex flex-col max-sm:flex-col items-center justify-center gap-2 max-sm:text-xs">
            <input
              className="flex w-full text-center p-2 border border-outline-variant bg-surface-container-lowest text-on-surface rounded-lg max-sm:text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              spellCheck={false}
            />{" "}
            <InlineMath math={`P(x) = ${input2}`} />
          </div>
          <BotonUtil
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow rounded-lg max-sm:text-xs"
            onClick={handleResolver}
            label="Resolver"
          />
        </div>

        {resultado ? (
          <div className="flex flex-col w-96 items-center justify-center px-4 gap-2 max-sm:text-xs ">
            {/* Paso 1 */}
            <h2 className="text-lg max-sm:text-xs font-semibold">
              1. Encontrando los ceros racionales posibles
            </h2>
            <p className="max-sm:text-xs">
              Según el teorema del factor racional, los posibles ceros son{" "}
              <InlineMath
                math={`
                 \\frac{p}{q},
              `}
              />{" "}
              con p divisores del término independiente y q divisores del
              coeficiente líder.
            </p>

            <BlockMath
              math={`p = ${Math.abs(
                resultado.coeffs[resultado.coeffs.length - 1],
              )} \;\\Rightarrow\; \\pm 1, \\pm ${Math.abs(
                resultado.coeffs[resultado.coeffs.length - 1],
              )}`}
            />

            <BlockMath
              math={`q = ${Math.abs(
                resultado.coeffs[0],
              )} \;\\Rightarrow\; \\pm 1, \\pm ${Math.abs(resultado.coeffs[0])}`}
            />

            <p>
              Lista no simplificada (todas las combinaciones{" "}
              <InlineMath
                math={`
                 \\frac{p}{q}
              `}
              />{" "}
              ):
            </p>
            <BlockMath math={resultado.latexListRaw} />

            <p>Lista simplificada:</p>
            <BlockMath math={resultado.latexSimplified || "\text{(ninguna)"} />

            {/* Paso 2 */}
            <h2 className="text-lg font-semibold">
              2. Aplicar Regla de Descartes para ceros reales positivos
            </h2>
            <p>
              Escribimos los términos (en orden) y marcamos con color y flecha
              los cambios de signo:
            </p>
            <BlockMath math={resultado.latexPxColored} />

            <p className="bg-surface-container-low border border-outline-variant p-3 rounded-xl text-on-surface">
              Se observa <strong>{resultado.cambiosPos}</strong> cambio(s) de
              signo → {resultado.cambiosPos} o{" "}
              {Math.max(0, resultado.cambiosPos - 2)} ceros reales positivos.
            </p>

            {/* Paso 3 */}
            <h2 className="text-lg font-semibold">
              3. Aplicar Regla de Descartes para ceros reales negativos
            </h2>
            <p>Primero sustituimos x por -x sin reducir:</p>
            <BlockMath math={resultado.latexPminusRaw} />

            <p>
              Reduciendo términos (aplicando{" "}
              <InlineMath math={`\(-x)^k =  1(x)^k`} /> y marcando cambios de
              signo:
            </p>
            <BlockMath math={resultado.latexPminusReduced} />

            <p className="bg-surface-container-low border border-outline-variant p-3 rounded-xl text-on-surface">
              Se observa <strong>{resultado.cambiosNeg}</strong> cambio(s) de
              signo → {resultado.cambiosNeg} o{" "}
              {Math.max(0, resultado.cambiosNeg - 2)} ceros reales negativos.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">
            Ingrese un polinomio y presione Resolver para ver los pasos.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
