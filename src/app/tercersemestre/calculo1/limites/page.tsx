"use client";
import React, { useState } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import * as math from "mathjs";
import TitleCourse from "@/components/TitleCourse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type ParteFuncion = {
  expresion: string;
  condicion: string;
  valor?: string;
};

const Limites = () => {
  const [tipoFuncion, setTipoFuncion] = useState<"simple" | "partes">("simple");
  const [funcion, setFuncion] = useState("");
  const [puntoLimite, setPuntoLimite] = useState("");
  const [partes, setPartes] = useState<ParteFuncion[]>([
    { expresion: "", condicion: "x < 0", valor: "0" },
    { expresion: "", condicion: "x >= 0", valor: "0" },
  ]);
  const [resultado, setResultado] = useState<{
    expresion: string;
    punto: string;
    valorDirecto: string | null;
    esIndeterminado: boolean;
    limite: string;
    pasos: string[];
    valorLimite: number | null;
    esPorPartes: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  const [datosGrafica, setDatosGrafica] = useState<
    Array<{ x: number; y: number | null }>
  >([]);

  const ejemplos = [
    { 
      tipo: "simple" as const,
      funcion: "(2*x + 3)/(x - 2)", 
      punto: "2", 
      nombre: "f(x) = (2x + 3)/(x - 2) en x=2" 
    },
    { 
      tipo: "simple" as const,
      funcion: "(x^2 - 9)/(x - 3)", 
      punto: "3", 
      nombre: "f(x) = (x² - 9)/(x - 3) en x=3" 
    },
    { 
      tipo: "partes" as const,
      partes: [
        { expresion: "1/(x + 2)", condicion: "x != -2", valor: "-2" },
        { expresion: "1", condicion: "x = -2", valor: "-2" }
      ],
      punto: "-2",
      nombre: "f(x) por partes (x ≠ -2)" 
    },
    { 
      tipo: "partes" as const,
      partes: [
        { expresion: "exp(x)", condicion: "x < 0", valor: "0" },
        { expresion: "x^2", condicion: "x >= 0", valor: "0" }
      ],
      punto: "0",
      nombre: "f(x) = e^x / x² por partes" 
    },
    { 
      tipo: "partes" as const,
      partes: [
        { expresion: "(x^2 - x)/(x^2 - 1)", condicion: "x != 1", valor: "1" },
        { expresion: "1", condicion: "x = 1", valor: "1" }
      ],
      punto: "1",
      nombre: "f(x) racional por partes" 
    },
  ];

  const cargarEjemplo = (ejemplo: typeof ejemplos[0]) => {
    if (ejemplo.tipo === "simple") {
      setTipoFuncion("simple");
      setFuncion(ejemplo.funcion);
    } else {
      setTipoFuncion("partes");
      setPartes(ejemplo.partes);
    }
    setPuntoLimite(ejemplo.punto);
    setResultado(null);
    setError("");
  };

  const agregarParte = () => {
    setPartes([...partes, { expresion: "", condicion: "x < 0", valor: "0" }]);
  };

  const eliminarParte = (index: number) => {
    if (partes.length > 1) {
      setPartes(partes.filter((_, i) => i !== index));
    }
  };

  const actualizarParte = (index: number, campo: keyof ParteFuncion, valor: string) => {
    const nuevasPartes = [...partes];
    nuevasPartes[index] = { ...nuevasPartes[index], [campo]: valor };
    setPartes(nuevasPartes);
  };

  const convertirALatex = (expr: string): string => {
    try {
      const node = math.parse(expr);
      return node.toTex();
    } catch {
      return expr;
    }
  };

  const evaluarFuncion = (expr: string, x: number): number | null => {
    try {
      const scope = { x };
      return math.evaluate(expr, scope);
    } catch {
      return null;
    }
  };

  const evaluarCondicion = (condicion: string, valor: string, x: number): boolean => {
    const valorNum = parseFloat(valor);
    if (condicion.includes("!=")) {
      return Math.abs(x - valorNum) > 0.0001;
    } else if (condicion.includes("<=")) {
      return x <= valorNum;
    } else if (condicion.includes(">=")) {
      return x >= valorNum;
    } else if (condicion.includes("<")) {
      return x < valorNum;
    } else if (condicion.includes(">")) {
      return x > valorNum;
    } else if (condicion.includes("=")) {
      return Math.abs(x - valorNum) < 0.0001;
    }
    return false;
  };

  const evaluarFuncionPorPartes = (x: number): number | null => {
    for (const parte of partes) {
      if (evaluarCondicion(parte.condicion, parte.valor || "0", x)) {
        return evaluarFuncion(parte.expresion, x);
      }
    }
    return null;
  };

  const obtenerExpresionPorPartes = (x: number, esExacto: boolean = false): string | null => {
    for (const parte of partes) {
      const cumpleCondicion = evaluarCondicion(parte.condicion, parte.valor || "0", x);
      if (esExacto && parte.condicion.includes("=") && !parte.condicion.includes("!=")) {
        if (cumpleCondicion) return parte.expresion;
      } else if (!esExacto && cumpleCondicion) {
        return parte.expresion;
      }
    }
    return null;
  };

  const generarDatosGrafica = (funcionSimple: string, punto: number, esPorPartes: boolean) => {
    const datos: Array<{ x: number; y: number | null }> = [];
    const rango = 5;
    const inicio = punto - rango;
    const fin = punto + rango;
    const pasos = 200;
    const incremento = (fin - inicio) / pasos;

    for (let i = 0; i <= pasos; i++) {
      const x = inicio + i * incremento;
      let y: number | null = null;
      
      if (esPorPartes) {
        y = evaluarFuncionPorPartes(x);
      } else {
        y = evaluarFuncion(funcionSimple, x);
      }
      
      if (y !== null && isFinite(y) && Math.abs(y) < 100) {
        datos.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
      } else {
        datos.push({ x: parseFloat(x.toFixed(4)), y: null });
      }
    }
    return datos;
  };

  const generarLatexPorPartes = (): string => {
    let latex = "f(x) = \\begin{cases} ";
    partes.forEach((parte, idx) => {
      const expresionLatex = convertirALatex(parte.expresion);
      const condicionLatex = parte.condicion
        .replace("!=", "\\neq")
        .replace("<=", "\\leq")
        .replace(">=", "\\geq");
      latex += `${expresionLatex} & \\text{si } ${condicionLatex}`;
      if (idx < partes.length - 1) {
        latex += " \\\\ ";
      }
    });
    latex += " \\end{cases}";
    return latex;
  };

  const calcularLimite = () => {
    setError("");
    setResultado(null);
    setDatosGrafica([]);

    const esPorPartes = tipoFuncion === "partes";

    if (!esPorPartes && !funcion.trim()) {
      setError("Por favor ingresa una función");
      return;
    }

    if (esPorPartes && partes.some(p => !p.expresion.trim())) {
      setError("Por favor completa todas las expresiones");
      return;
    }

    if (!puntoLimite.trim()) {
      setError("Por favor ingresa un punto");
      return;
    }

    try {
      const punto = parseFloat(puntoLimite);
      if (isNaN(punto)) {
        setError("El punto debe ser un número válido");
        return;
      }

      const pasos: string[] = [];
      const expresionMostrar = esPorPartes ? generarLatexPorPartes() : `f(x) = ${convertirALatex(funcion)}`;
      pasos.push(`\\text{Función: } ${expresionMostrar}`);
      pasos.push(`\\text{Límite a evaluar: } \\lim_{x \\to ${punto}} f(x)`);

      let esIndeterminado = false;
      let limite = "";
      let valorLimite: number | null = null;
      let valorDirecto: number | null = null;

      const epsilon = 0.0001;
      let limitePorIzquierda: number | null = null;
      let limitePorDerecha: number | null = null;

      if (esPorPartes) {
        valorDirecto = evaluarFuncionPorPartes(punto);
        limitePorIzquierda = evaluarFuncionPorPartes(punto - epsilon);
        limitePorDerecha = evaluarFuncionPorPartes(punto + epsilon);

        const expresionIzq = obtenerExpresionPorPartes(punto - epsilon);
        const expresionDer = obtenerExpresionPorPartes(punto + epsilon);
        const expresionPunto = obtenerExpresionPorPartes(punto, true);

        pasos.push(`\\text{Para } x < ${punto}: f(x) = ${convertirALatex(expresionIzq || "")}`);
        pasos.push(`\\text{Límite por la izquierda: } \\lim_{x \\to ${punto}^-} f(x) = ${limitePorIzquierda?.toFixed(4) || "indefinido"}`);
        
        pasos.push(`\\text{Para } x > ${punto}: f(x) = ${convertirALatex(expresionDer || "")}`);
        pasos.push(`\\text{Límite por la derecha: } \\lim_{x \\to ${punto}^+} f(x) = ${limitePorDerecha?.toFixed(4) || "indefinido"}`);

        if (expresionPunto && valorDirecto !== null) {
          pasos.push(`\\text{Valor en el punto: } f(${punto}) = ${valorDirecto.toFixed(4)}`);
        }
      } else {
        valorDirecto = evaluarFuncion(funcion, punto);
        limitePorIzquierda = evaluarFuncion(funcion, punto - epsilon);
        limitePorDerecha = evaluarFuncion(funcion, punto + epsilon);

        pasos.push(`\\text{Límite por la izquierda: } \\lim_{x \\to ${punto}^-} f(x) \\approx ${limitePorIzquierda?.toFixed(4) || "indefinido"}`);
        pasos.push(`\\text{Límite por la derecha: } \\lim_{x \\to ${punto}^+} f(x) \\approx ${limitePorDerecha?.toFixed(4) || "indefinido"}`);
      }

      if (
        limitePorIzquierda !== null &&
        limitePorDerecha !== null &&
        isFinite(limitePorIzquierda) &&
        isFinite(limitePorDerecha)
      ) {
        if (Math.abs(limitePorIzquierda - limitePorDerecha) < 0.01) {
          valorLimite = (limitePorIzquierda + limitePorDerecha) / 2;
          limite = valorLimite.toFixed(4);
          pasos.push(`\\text{Como } \\lim_{x \\to ${punto}^-} f(x) = \\lim_{x \\to ${punto}^+} f(x), \\text{ el límite existe}`);
          pasos.push(`\\therefore \\lim_{x \\to ${punto}} f(x) = ${limite}`);
          
          if (valorDirecto !== null && Math.abs(valorDirecto - valorLimite) < 0.01) {
            pasos.push(`\\text{Como } f(${punto}) = ${valorDirecto.toFixed(4)} = \\lim_{x \\to ${punto}} f(x), \\text{ continua en } x = ${punto}`);
          } else if (valorDirecto !== null) {
            pasos.push(`\\text{Como } f(${punto}) = ${valorDirecto.toFixed(4)} \\neq \\lim_{x \\to ${punto}} f(x), \\text{ discontinuidad removible}`);
          }
        } else {
          limite = "\\text{No existe}";
          esIndeterminado = true;
          pasos.push(`\\text{Los límites laterales son diferentes, el límite no existe}`);
          pasos.push(`\\text{Discontinuidad de salto en } x = ${punto}`);
        }
      } else {
        if (!isFinite(limitePorIzquierda || 0) || !isFinite(limitePorDerecha || 0)) {
          limite = "\\pm\\infty";
          esIndeterminado = true;
          pasos.push(`\\text{El límite tiende al infinito}`);
        } else {
          limite = "\\text{No existe}";
          esIndeterminado = true;
        }
      }

      const datos = generarDatosGrafica(funcion, punto, esPorPartes);
      setDatosGrafica(datos);

      setResultado({
        expresion: esPorPartes ? generarLatexPorPartes() : convertirALatex(funcion),
        punto: String(punto),
        valorDirecto: valorDirecto !== null ? String(valorDirecto) : null,
        esIndeterminado,
        limite,
        pasos,
        valorLimite,
        esPorPartes,
      });
    } catch (err) {
      setError("Error al procesar la función. Verifica la sintaxis.");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-7xl mx-auto">
      <TitleCourse course="Calculadora de Límites" />

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="font-bold text-lg mb-2">📝 Instrucciones:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Usa <code className="bg-white px-1 rounded">x</code> como variable</li>
          <li>Operaciones: <code className="bg-white px-1 rounded">+, -, *, /, ^</code></li>
          <li>Raíz cuadrada: <code className="bg-white px-1 rounded">sqrt(x)</code></li>
          <li>Funciones: <code className="bg-white px-1 rounded">sin(x), cos(x), tan(x), log(x), exp(x)</code></li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <h2 className="font-bold text-lg mb-3">💡 Ejemplos rápidos:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {ejemplos.map((ejemplo, idx) => (
            <button
              key={idx}
              onClick={() => cargarEjemplo(ejemplo)}
              className="p-2 bg-white rounded border border-green-300 hover:bg-green-100 transition text-sm text-left"
            >
              <div className="font-semibold">{ejemplo.nombre}</div>
              <div className="text-xs text-gray-600">x → {ejemplo.punto}</div>
              <div className="text-xs text-blue-600 mt-1">
                {ejemplo.tipo === "partes" ? "📋 Por partes" : "📊 Simple"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h2 className="font-bold text-lg mb-3">🔧 Tipo de función:</h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setTipoFuncion("simple");
              setResultado(null);
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              tipoFuncion === "simple"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-100"
            }`}
          >
            📊 Función Simple
          </button>
          <button
            onClick={() => {
              setTipoFuncion("partes");
              setResultado(null);
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              tipoFuncion === "partes"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-100"
            }`}
          >
            📋 Función por Partes
          </button>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border">
        {tipoFuncion === "simple" ? (
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Función f(x):</label>
              <input
                type="text"
                value={funcion}
                onChange={(e) => setFuncion(e.target.value)}
                placeholder="Ej: (2*x + 3)/(x - 2)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Definición por partes:</h3>
              <button
                onClick={agregarParte}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm"
              >
                ➕ Agregar Parte
              </button>
            </div>
            {partes.map((parte, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-600">Parte {index + 1}</span>
                  {partes.length > 1 && (
                    <button
                      onClick={() => eliminarParte(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expresión:</label>
                    <input
                      type="text"
                      value={parte.expresion}
                      onChange={(e) => actualizarParte(index, "expresion", e.target.value)}
                      placeholder="Ej: x^2"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Condición:</label>
                    <select
                      value={parte.condicion.split(" ")[1]}
                      onChange={(e) => {
                        const operador = e.target.value;
                        actualizarParte(index, "condicion", `x ${operador} ${parte.valor || "0"}`);
                      }}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    >
                      <option value="<">{"<"} (menor que)</option>
                      <option value="<=">{"<="} (menor o igual)</option>
                      <option value="=">{"="} (igual)</option>
                      <option value=">=">{"≥"} (mayor o igual)</option>
                      <option value=">">{">"} (mayor que)</option>
                      <option value="!=">{"≠"} (diferente de)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Valor de comparación:</label>
                    <input
                      type="text"
                      value={parte.valor || "0"}
                      onChange={(e) => {
                        actualizarParte(index, "valor", e.target.value);
                        const operador = parte.condicion.split(" ")[1];
                        actualizarParte(index, "condicion", `x ${operador} ${e.target.value}`);
                      }}
                      placeholder="Ej: 0"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <label className="block font-semibold mb-2">Punto donde evaluar el límite (x →):</label>
          <input
            type="text"
            value={puntoLimite}
            onChange={(e) => setPuntoLimite(e.target.value)}
            placeholder="Ej: 3"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          onClick={calcularLimite}
          className="w-full mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Calcular Límite
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {resultado && (
        <div className="mt-6 space-y-6">
          {datosGrafica.length > 0 && (
            <div className="p-6 bg-white rounded-lg shadow-lg border">
              <h2 className="text-2xl font-bold mb-4 text-center">📈 Gráfica de la Función</h2>
              <div style={{ width: "100%", height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={datosGrafica}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="x"
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      label={{
                        value: "x",
                        position: "insideBottom",
                        offset: -10,
                      }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      label={{
                        value: "f(x)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine
                      x={parseFloat(resultado.punto)}
                      stroke="red"
                      strokeDasharray="5 5"
                      label={{ value: `x = ${resultado.punto}`, position: "top" }}
                    />
                    {resultado.valorLimite !== null && isFinite(resultado.valorLimite) && (
                      <ReferenceLine
                        y={resultado.valorLimite}
                        stroke="green"
                        strokeDasharray="5 5"
                        label={{
                          value: `L = ${resultado.valorLimite.toFixed(2)}`,
                          position: "right",
                        }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                      name="f(x)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                  <span className="text-red-600 font-bold">Línea roja:</span> Punto del límite
                  {resultado.valorLimite !== null && isFinite(resultado.valorLimite) && (
                    <>
                      {" | "}
                      <span className="text-green-600 font-bold">Línea verde:</span> Valor del límite
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="p-6 bg-white rounded-lg shadow-lg border">
            <h2 className="text-2xl font-bold mb-4 text-center">📊 Solución</h2>
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-300 mb-6">
              <div className="text-center">
                <BlockMath
                  math={`\\lim_{x \\to ${resultado.punto}} f(x) = ${resultado.limite}`}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Pasos de la solución:</h3>
              {resultado.pasos.map((paso, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="font-semibold text-blue-600 mb-2">
                    Paso {idx + 1}:
                  </div>
                  <BlockMath math={paso} />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-bold mb-2">ℹ️ Información:</h3>
              {resultado.esPorPartes ? (
                <p className="text-sm">
                  Función definida por partes. Se evaluaron los límites
                  laterales para determinar la continuidad.
                  {resultado.esIndeterminado && " Se detectó una discontinuidad."}
                </p>
              ) : resultado.esIndeterminado ? (
                <p className="text-sm">
                  Forma indeterminada detectada. Se calcularon los límites laterales.
                </p>
              ) : (
                <p className="text-sm">
                  Límite calculado por sustitución directa (función continua).
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Limites;
