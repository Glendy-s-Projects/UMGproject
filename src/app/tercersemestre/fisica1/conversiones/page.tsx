"use client";
import React, { useState, useMemo } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import TitleCourse from "@/components/TitleCourse";

type Unit = {
  id: string;
  name: string;
  category: string;
};

const units: Unit[] = [
  // Velocidad
  { id: "mph", name: "Millas/h", category: "velocity" },
  { id: "kmh", name: "Kilómetros/h", category: "velocity" },
  { id: "cms", name: "cm/s", category: "velocity" },
  // Fuerza
  { id: "N", name: "Newtons", category: "force" },
  { id: "dyn", name: "Dinas", category: "force" },
  // Masa
  { id: "kg", name: "Kilogramos", category: "mass" },
  { id: "g", name: "Gramos", category: "mass" },
  { id: "lb", name: "Libras", category: "mass" },
  // Longitud
  { id: "cm", name: "Centímetros", category: "length" },
  { id: "in", name: "Pulgadas", category: "length" },
  // Volumen
  { id: "km3", name: "Kilómetros cúbicos", category: "volume" },
  { id: "dam3", name: "Decámetros cúbicos", category: "volume" },
  { id: "m3", name: "Metros cúbicos", category: "volume" },
  { id: "dm3", name: "Decímetros cúbicos", category: "volume" },
  { id: "cm3", name: "Centímetros cúbicos", category: "volume" },
  { id: "L", name: "Litros", category: "volume" },
  // Área
  { id: "ft2", name: "Pies cuadrados", category: "area" },
  { id: "m2", name: "Metros cuadrados", category: "area" },
];

const conversionFactors: Record<string, Record<string, number>> = {
  // Velocidad
  mph: { kmh: 1.60934, cms: 44.704 },
  kmh: { mph: 0.621371, cms: 27.7778 },
  cms: { mph: 0.0223694, kmh: 0.036 },
  // Fuerza
  N: { dyn: 100000 },
  dyn: { N: 0.00001 },
  // Masa
  kg: { g: 1000, lb: 2.20462 },
  g: { kg: 0.001, lb: 0.00220462 },
  lb: { kg: 0.453592, g: 453.592 },
  // Longitud
  cm: { in: 0.393701 },
  in: { cm: 2.54 },
  // Volumen
  km3: { dam3: 1000000, m3: 1000000000, dm3: 1000000000000, cm3: 1000000000000000, L: 1000000000000 },
  dam3: { km3: 0.000001, m3: 1000, dm3: 1000000, cm3: 1000000000, L: 1000000 },
  m3: { km3: 0.000000001, dam3: 0.001, dm3: 1000, cm3: 1000000, L: 1000 },
  dm3: { km3: 0.000000000001, dam3: 0.000001, m3: 0.001, cm3: 1000, L: 1 },
  cm3: { km3: 0.000000000000001, dam3: 0.000000001, m3: 0.000001, dm3: 0.001, L: 0.001 },
  L: { km3: 0.000000000001, dam3: 0.000001, m3: 0.001, dm3: 1, cm3: 1000 },
  // Área
  ft2: { m2: 0.092903 },
  m2: { ft2: 10.7639 },
};

const Conversiones = () => {
  const [inputValue, setInputValue] = useState<string>("1");
  const [fromUnit, setFromUnit] = useState<string>("mph");
  const [toUnit, setToUnit] = useState<string>("kmh");

  const calculation = useMemo(() => {
    const value = parseFloat(inputValue) || 0;
    
    if (fromUnit === toUnit) {
      return {
        result: value,
        steps: [],
        formula: "",
        factor: 1,
      };
    }

    const factor = conversionFactors[fromUnit]?.[toUnit];
    
    if (!factor) {
      return {
        result: 0,
        steps: [],
        formula: "",
        factor: 0,
        error: "Conversión no disponible entre estas unidades",
      };
    }

    const result = value * factor;
    const fromUnitName = units.find((u) => u.id === fromUnit)?.name || fromUnit;
    const toUnitName = units.find((u) => u.id === toUnit)?.name || toUnit;

    return {
      result,
      steps: [],
      formula: "",
      factor,
      fromUnitName,
      toUnitName,
    };
  }, [inputValue, fromUnit, toUnit]);

  const getAvailableToUnits = () => {
    if (!fromUnit) return units;
    const fromCategory = units.find((u) => u.id === fromUnit)?.category;
    return units.filter((u) => u.category === fromCategory);
  };

  const renderSteps = () => {
    const value = parseFloat(inputValue) || 0;
    
    if (fromUnit === toUnit) {
      return (
        <div className="text-gray-600 italic">
          Las unidades son las mismas, no se requiere conversión.
        </div>
      );
    }

    if (calculation.error) {
      return (
        <div className="text-red-600 font-semibold">{calculation.error}</div>
      );
    }

    const { factor, result, fromUnitName, toUnitName } = calculation;

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-900 mb-2">Paso 1: Factor de conversión</h4>
          <p className="mb-2">
            El factor de conversión de {fromUnitName} a {toUnitName} es:
          </p>
          <div className="bg-white p-3 rounded border border-blue-300">
            <BlockMath math={`1 \\text{ ${fromUnitName}} = ${factor} \\text{ ${toUnitName}}`} />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-900 mb-2">Paso 2: Aplicar el factor</h4>
          <p className="mb-2">
            Multiplicamos el valor inicial por el factor de conversión:
          </p>
          <div className="bg-white p-3 rounded border border-green-300">
            <BlockMath
              math={`${value} \\text{ ${fromUnitName}} \\times ${factor} = ${result.toFixed(6)} \\text{ ${toUnitName}}`}
            />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-bold text-purple-900 mb-2">Paso 3: Resultado final</h4>
          <div className="bg-white p-3 rounded border border-purple-300">
            <BlockMath
              math={`${value} \\text{ ${fromUnitName}} = ${result.toFixed(4)} \\text{ ${toUnitName}}`}
            />
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-2">📝 Fórmula general</h4>
          <div className="bg-white p-3 rounded border border-amber-300">
            <BlockMath
              math={`\\text{Resultado} = \\text{Valor inicial} \\times \\text{Factor de conversión}`}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <TitleCourse course="Conversiones de Unidades - Física I" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de entrada */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">🔄</span>
              Convertidor
            </h2>

            <div className="space-y-6">
              {/* Input de valor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Valor a convertir:
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg font-mono"
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
                      (u) => u.id === e.target.value
                    )?.category;
                    const toCategory = units.find((u) => u.id === toUnit)?.category;
                    if (newCategory !== toCategory) {
                      const firstCompatible = units.find(
                        (u) => u.category === newCategory && u.id !== e.target.value
                      );
                      if (firstCompatible) {
                        setToUnit(firstCompatible.id);
                      }
                    }
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg bg-white cursor-pointer"
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg bg-white cursor-pointer"
                >
                  {getAvailableToUnits().map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resultado destacado */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white shadow-xl">
                <p className="text-sm font-semibold mb-2 opacity-90">Resultado:</p>
                <div className="text-3xl font-bold break-words">
                  {calculation.result.toFixed(4)}{" "}
                  <span className="text-xl">
                    {units.find((u) => u.id === toUnit)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de pasos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">📐</span>
              Paso a Paso
            </h2>
            <div className="overflow-y-auto max-h-[600px] pr-2">
              {renderSteps()}
            </div>
          </div>
        </div>

        {/* Tabla de referencia */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Tabla de Conversiones Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-2">⚡ Velocidad</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Millas/h ↔ Kilómetros/h</li>
                <li>• Kilómetros/h ↔ cm/s</li>
                <li>• Millas/h ↔ cm/s</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">💪 Fuerza</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Newtons ↔ Dinas</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-900 mb-2">⚖️ Masa</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Kilogramos ↔ Gramos</li>
                <li>• Kilogramos ↔ Libras</li>
                <li>• Gramos ↔ Libras</li>
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-bold text-amber-900 mb-2">📏 Longitud</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Centímetros ↔ Pulgadas</li>
              </ul>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h3 className="font-bold text-pink-900 mb-2">🧊 Volumen</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Kilómetros cúbicos ↔ Decámetros cúbicos</li>
                <li>• Decámetros cúbicos ↔ Metros cúbicos</li>
                <li>• Metros cúbicos ↔ Decímetros cúbicos</li>
                <li>• Decímetros cúbicos ↔ Centímetros cúbicos</li>
                <li>• Centímetros cúbicos ↔ Litros</li>
              </ul>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h3 className="font-bold text-indigo-900 mb-2">📐 Área</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Pies cuadrados ↔ Metros cuadrados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversiones;