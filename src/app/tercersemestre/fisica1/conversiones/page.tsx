"use client";
import "katex/dist/katex.min.css";
import TitleCourse from "@/components/TitleCourse";
import { useFisicaProvider } from "@/context/FisicaProvider";

const Conversiones = () => {
  const {
    units,
    inputValue,
    setInputValue,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    getAvailableToUnits,
    renderSteps,
  } = useFisicaProvider();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <TitleCourse course="Conversiones de Unidades - Física I" />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          {/* Panel de entrada */}
          <div className="bg-white rounded-xl shadow-lg p-2">
            <div className="flex flex-col gap-2">
              {/* Input de valor */}
              <div className="flex flex-row gap-2 items-center justify-center">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valor a convertir:
                  </label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-mono"
                    placeholder="Ingresa un número"
                    step="any"
                  />
                </div>

                {/* Select de unidad origen */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    De:
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => {
                      setFromUnit(e.target.value);
                      // Resetear la unidad destino si no es compatible
                      const newCategory = units.find(
                        (u) => u.id === e.target.value,
                      )?.category;
                      const toCategory = units.find(
                        (u) => u.id === toUnit,
                      )?.category;
                      if (newCategory !== toCategory) {
                        const firstCompatible = units.find(
                          (u) =>
                            u.category === newCategory &&
                            u.id !== e.target.value,
                        );
                        if (firstCompatible) {
                          setToUnit(firstCompatible.id);
                        }
                      }
                    }}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg bg-white cursor-pointer"
                  >
                    {units.map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select de unidad destino */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    A:
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg bg-white cursor-pointer"
                  >
                    {getAvailableToUnits().map((unit) => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de pasos */}
          <div className=" p-2 w-full ">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center text-center justify-center w-full gap-2">
              Paso a Paso
            </h2>
            <div className=" max-h-[600px] pr-2 ">{renderSteps()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversiones;
