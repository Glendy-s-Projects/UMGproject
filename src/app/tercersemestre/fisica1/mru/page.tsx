"use client";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";
import TitleCourse from "@/components/TitleCourse";
import { DistanceUnit, TimeUnit, useMRUProvider, Variable, VelocityUnit } from "@/context/MRUProvider";

const MovimientoRectilineoUniforme = () => {
  const {
    activeTab,
    setActiveTab,
    calcular,
    setCalcular,
    velocidad,
    setVelocidad,
    velocidadUnit,
    setVelocidadUnit,
    distancia,
    setDistancia,
    distanciaUnit,
    setDistanciaUnit,
    tiempo,
    setTiempo,
    tiempoUnit,
    setTiempoUnit,
    resultado,
    setResultado,
    pasos,
    setPasos,
    t0,
    setT0,
    x0,
    setX0,
    t1,
    setT1,
    x1,
    setX1,
    graphUnit,
    setGraphUnit,
    graphTimeUnit,
    setGraphTimeUnit,
    calcularMRU,
    calcularDesdeGrafica,
  } = useMRUProvider();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <TitleCourse course="Movimiento Rectilíneo Uniforme (MRU)" />
        </div>

        <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => {
              setActiveTab("basico");
              setResultado(null);
              setPasos([]);
            }}
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === "basico" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-indigo-400"}`}
          >
            Cálculo Básico
          </button>
          <button
            onClick={() => {
              setActiveTab("grafica");
              setResultado(null);
              setPasos([]);
            }}
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === "grafica" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-indigo-400"}`}
          >
            Desde Gráfica
          </button>
        </div>

        {activeTab === "basico" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ¿Qué deseas calcular?
              </label>
              <select
                value={calcular}
                onChange={(e) => {
                  setCalcular(e.target.value as Variable);
                  setResultado(null);
                  setPasos([]);
                }}
                className="w-full p-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="tiempo">Tiempo</option>
                <option value="distancia">Distancia</option>
                <option value="velocidad">Velocidad</option>
              </select>
            </div>

            {calcular !== "velocidad" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Velocidad
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={velocidad}
                    onChange={(e) => setVelocidad(e.target.value)}
                    placeholder="Ingresa la velocidad"
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <select
                    value={velocidadUnit}
                    onChange={(e) =>
                      setVelocidadUnit(e.target.value as VelocityUnit)
                    }
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="km/h">km/h</option>
                    <option value="m/s">m/s</option>
                    <option value="mi/h">mi/h</option>
                  </select>
                </div>
              </div>
            )}

            {calcular !== "distancia" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Distancia
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={distancia}
                    onChange={(e) => setDistancia(e.target.value)}
                    placeholder="Ingresa la distancia"
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <select
                    value={distanciaUnit}
                    onChange={(e) =>
                      setDistanciaUnit(e.target.value as DistanceUnit)
                    }
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="km">km</option>
                    <option value="m">m</option>
                    <option value="cm">cm</option>
                    <option value="ft">ft</option>
                    <option value="mi">mi</option>
                  </select>
                </div>
              </div>
            )}

            {calcular !== "tiempo" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiempo
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={tiempo}
                    onChange={(e) => setTiempo(e.target.value)}
                    placeholder="Ingresa el tiempo"
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <select
                    value={tiempoUnit}
                    onChange={(e) => setTiempoUnit(e.target.value as TimeUnit)}
                    className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="h">h</option>
                    <option value="min">min</option>
                    <option value="s">s</option>
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={calcularMRU}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Calcular
            </button>
          </>
        )}

        {activeTab === "grafica" && (
          <>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Punto Inicial (t₀, x₀)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={t0}
                  onChange={(e) => setT0(e.target.value)}
                  placeholder="t₀"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  value={x0}
                  onChange={(e) => setX0(e.target.value)}
                  placeholder="x₀"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Punto Final (t₁, x₁)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={t1}
                  onChange={(e) => setT1(e.target.value)}
                  placeholder="t₁"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  value={x1}
                  onChange={(e) => setX1(e.target.value)}
                  placeholder="x₁"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unidad de distancia
                </label>
                <select
                  value={graphUnit}
                  onChange={(e) => setGraphUnit(e.target.value as DistanceUnit)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="m">m</option>
                  <option value="km">km</option>
                  <option value="cm">cm</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unidad de tiempo
                </label>
                <select
                  value={graphTimeUnit}
                  onChange={(e) => setGraphTimeUnit(e.target.value as TimeUnit)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="s">s</option>
                  <option value="min">min</option>
                  <option value="h">h</option>
                </select>
              </div>
            </div>

            <button
              onClick={calcularDesdeGrafica}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Calcular Velocidad
            </button>
          </>
        )}

        {pasos.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <h2 className="text-lg font-bold text-green-900 mb-3">
                Pasos de la solución:
              </h2>
              {pasos.map((paso, idx) => (
                <div key={idx} className="mb-3 text-center">
                  <BlockMath math={paso} />
                </div>
              ))}
            </div>

            <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-lg">
              <h2 className="text-lg font-bold text-indigo-900 mb-2">
                Resultado Final:
              </h2>
              <p className="text-xl text-indigo-700 font-semibold">
                {resultado}
              </p>
            </div>
          </div>
        )}

        {/* {activeTab === "basico" && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Fórmulas MRU:</h3>
            <div className="space-y-2 text-center">
              <div>
                <InlineMath math={`v = \\frac{d}{t}`} />
              </div>
              <div>
                <InlineMath math={`d = v \\times t`} />
              </div>
              <div>
                <InlineMath math={`t = \\frac{d}{v}`} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "grafica" && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Fórmula:</h3>
            <div className="text-center">
              <BlockMath math="v = \\frac{\\Delta x}{\\Delta t} = \\frac{x_1 - x_0}{t_1 - t_0}" />
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default MovimientoRectilineoUniforme;
