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
  // Ángulo
  { id: "deg", name: "Grados sexagesimales", category: "angle" },
  { id: "rad", name: "Radianes", category: "angle" },
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
  km3: {
    dam3: 1000000,
    m3: 1000000000,
    dm3: 1000000000000,
    cm3: 1000000000000000,
    L: 1000000000000,
  },
  dam3: { km3: 0.000001, m3: 1000, dm3: 1000000, cm3: 1000000000, L: 1000000 },
  m3: { km3: 0.000000001, dam3: 0.001, dm3: 1000, cm3: 1000000, L: 1000 },
  dm3: { km3: 0.000000000001, dam3: 0.000001, m3: 0.001, cm3: 1000, L: 1 },
  cm3: {
    km3: 0.000000000000001,
    dam3: 0.000000001,
    m3: 0.000001,
    dm3: 0.001,
    L: 0.001,
  },
  L: { km3: 0.000000000001, dam3: 0.000001, m3: 0.001, dm3: 1, cm3: 1000 },
  // Área
  ft2: { m2: 0.092903 },
  m2: { ft2: 10.7639 },
  // Ángulo
  deg: { rad: 0.0174532925 },
  rad: { deg: 57.2957795 },
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
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-900 mb-2">
            Paso 1: Factor de conversión
          </h4>
          <div className="bg-white p-3 rounded border border-blue-300">
            <BlockMath
              math={`1 \\text{ ${fromUnitName}} = ${factor} \\text{ ${toUnitName}}`}
            />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-900 mb-2">
            Paso 2: Aplicar el factor
          </h4>
          <div className="bg-white p-3 rounded border border-green-300">
            <BlockMath
              math={`= ${value} \\text{ ${fromUnitName}} \\times \\left( \\frac{${factor}\\text{ ${toUnitName}}} {1 \\text{ ${fromUnitName}}} \\right)`}
            />

            <BlockMath
              math={` = ${result.toFixed(2)} \\text{ ${toUnitName}}`}
            />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="bg-white p-3 rounded border border-purple-300">
            <BlockMath
              math={`${value} \\text{ ${fromUnitName}} = ${result.toFixed(2)} \\text{ ${toUnitName}}`}
            />
          </div>
        </div>
      </div>
    );
  };

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
            <div className=" max-h-[600px] pr-2 ">
              {renderSteps()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversiones;
