import { useMemo, useState } from "react";
import { BlockMath } from "react-katex";

type Unit = {
  id: string;
  name: string;
  category: string;
};

export const useFisicaProvider = () => {
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
    dam3: {
      km3: 0.000001,
      m3: 1000,
      dm3: 1000000,
      cm3: 1000000000,
      L: 1000000,
    },
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

  return {
    units,
    conversionFactors,
    inputValue,
    setInputValue,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    calculation,
    getAvailableToUnits,
    renderSteps,
  };
};
