import { useState } from "react";

export type Variable = "velocidad" | "distancia" | "tiempo";
export type VelocityUnit = "km/h" | "m/s" | "mi/h";
export type DistanceUnit = "km" | "m" | "mi" | "ft" | "cm";
export type TimeUnit = "h" | "min" | "s";
export type TabType = "basico" | "grafica";

export const useMRUProvider = () => {
  const [activeTab, setActiveTab] = useState<TabType>("basico");
  const [calcular, setCalcular] = useState<Variable>("tiempo");
  const [velocidad, setVelocidad] = useState("");
  const [velocidadUnit, setVelocidadUnit] = useState<VelocityUnit>("km/h");
  const [distancia, setDistancia] = useState("");
  const [distanciaUnit, setDistanciaUnit] = useState<DistanceUnit>("km");
  const [tiempo, setTiempo] = useState("");
  const [tiempoUnit, setTiempoUnit] = useState<TimeUnit>("h");
  const [resultado, setResultado] = useState<string | null>(null);
  const [pasos, setPasos] = useState<string[]>([]);

  // Estados para velocidad desde gráfica
  const [t0, setT0] = useState("");
  const [x0, setX0] = useState("");
  const [t1, setT1] = useState("");
  const [x1, setX1] = useState("");
  const [graphUnit, setGraphUnit] = useState<DistanceUnit>("m");
  const [graphTimeUnit, setGraphTimeUnit] = useState<TimeUnit>("s");

  const convertToSI = (
    value: number,
    unit: VelocityUnit | DistanceUnit | TimeUnit,
    type: "velocity" | "distance" | "time",
  ): number => {
    if (type === "velocity") {
      const conversions: Record<VelocityUnit, number> = {
        "km/h": 1 / 3.6,
        "m/s": 1,
        "mi/h": 0.44704,
      };
      return value * conversions[unit as VelocityUnit];
    }
    if (type === "distance") {
      const conversions: Record<DistanceUnit, number> = {
        km: 1000,
        m: 1,
        mi: 1609.34,
        ft: 0.3048,
        cm: 0.01,
      };
      return value * conversions[unit as DistanceUnit];
    }
    const conversions: Record<TimeUnit, number> = { h: 3600, min: 60, s: 1 };
    return value * conversions[unit as TimeUnit];
  };

  const convertFromSI = (
    value: number,
    unit: VelocityUnit | DistanceUnit | TimeUnit,
    type: "velocity" | "distance" | "time",
  ): number => {
    if (type === "velocity") {
      const conversions: Record<VelocityUnit, number> = {
        "km/h": 3.6,
        "m/s": 1,
        "mi/h": 2.23694,
      };
      return value * conversions[unit as VelocityUnit];
    }
    if (type === "distance") {
      const conversions: Record<DistanceUnit, number> = {
        km: 0.001,
        m: 1,
        mi: 0.000621371,
        ft: 3.28084,
        cm: 100,
      };
      return value * conversions[unit as DistanceUnit];
    }
    const conversions: Record<TimeUnit, number> = {
      h: 1 / 3600,
      min: 1 / 60,
      s: 1,
    };
    return value * conversions[unit as TimeUnit];
  };

  const calcularMRU = () => {
    try {
      const steps: string[] = [];

      if (calcular === "tiempo") {
        const vInput = parseFloat(velocidad);
        const dInput = parseFloat(distancia);

        if (velocidadUnit !== "m/s") {
          const vInMS = convertToSI(vInput, velocidadUnit, "velocity");
          if (velocidadUnit === "km/h") {
            steps.push(`\\text{Convertir velocidad a m/s:}`);
            steps.push(
              `${vInput}\\text{ km/h} \\times \\frac{1000\\text{ m}}{3600\\text{ s}} = ${vInMS.toFixed(2)}\\text{ m/s}`,
            );
          } else {
            steps.push(
              `\\text{Convertir velocidad: } ${vInput}\\text{ ${velocidadUnit}} = ${vInMS.toFixed(2)}\\text{ m/s}`,
            );
          }
        }

        const d = convertToSI(dInput, distanciaUnit, "distance");
        if (distanciaUnit !== "m") {
          steps.push(
            `\\text{Convertir distancia: } ${dInput}\\text{ ${distanciaUnit}} = ${d.toFixed(2)}\\text{ m}`,
          );
        }

        steps.push(`\\text{Despejar tiempo: } t = \\frac{d}{v}`);

        const v = convertToSI(vInput, velocidadUnit, "velocity");
        steps.push(
          `t = \\frac{${d.toFixed(2)}\\text{ m}}{${v.toFixed(2)}\\text{ m/s}}`,
        );

        const t = d / v;
        steps.push(`t = ${t.toFixed(2)}\\text{ segundos}`);

        const tConverted = convertFromSI(t, tiempoUnit, "time");
        const hours = Math.floor(t / 3600);
        const seconds = Math.floor(t % 3600);
        setResultado(
          `t = ${t.toFixed(2)} segundos = ${tConverted.toFixed(4)} ${tiempoUnit} (${hours}h ${seconds}s)`,
        );
      } else if (calcular === "distancia") {
        const vInput = parseFloat(velocidad);
        const tInput = parseFloat(tiempo);

        const v = convertToSI(vInput, velocidadUnit, "velocity");
        const t = convertToSI(tInput, tiempoUnit, "time");

        if (velocidadUnit !== "m/s") {
          if (velocidadUnit === "km/h") {
            steps.push(`\\text{Convertir velocidad a m/s:}`);
            steps.push(
              `${vInput}\\text{ km/h} \\times \\frac{1000}{3600} = ${v.toFixed(2)}\\text{ m/s}`,
            );
          } else {
            steps.push(
              `\\text{Convertir velocidad: } ${vInput}\\text{ ${velocidadUnit}} = ${v.toFixed(2)}\\text{ m/s}`,
            );
          }
        }
        if (tiempoUnit !== "s") {
          steps.push(
            `\\text{Convertir tiempo: } ${tInput}\\text{ ${tiempoUnit}} = ${t.toFixed(2)}\\text{ s}`,
          );
        }

        steps.push(`\\text{Calcular distancia: } d = v \\times t`);
        steps.push(
          `d = ${v.toFixed(2)}\\text{ m/s} \\times ${t.toFixed(2)}\\text{ s}`,
        );

        const d = v * t;
        steps.push(`d = ${d.toFixed(2)}\\text{ metros}`);

        const dKm = d * 0.001;
        const dMi = d * 0.000621371;
        const dFt = d * 3.28084;
        const dCm = d * 100;

        if (distanciaUnit !== "m") {
          const factor =
            distanciaUnit === "ft"
              ? "3.28084"
              : distanciaUnit === "km"
                ? "0.001"
                : distanciaUnit === "cm"
                  ? "100"
                  : "0.000621371";
          const dConverted = convertFromSI(d, distanciaUnit, "distance");
          steps.push(
            `\\text{Convertir a ${distanciaUnit} (1 m = ${factor} ${distanciaUnit}):}`,
          );
          steps.push(
            `${d.toFixed(2)} \\times ${factor} = ${dConverted.toFixed(2)}\\text{ ${distanciaUnit}}`,
          );
        }

        setResultado(
          `d = ${d.toFixed(2)} m = ${dKm.toFixed(4)} km = ${dFt.toFixed(2)} ft = ${dCm.toFixed(2)} cm = ${dMi.toFixed(4)} mi`,
        );
      } else {
        const dInput = parseFloat(distancia);
        const tInput = parseFloat(tiempo);

        const d = convertToSI(dInput, distanciaUnit, "distance");
        const t = convertToSI(tInput, tiempoUnit, "time");

        if (distanciaUnit !== "m") {
          steps.push(
            `\\text{Convertir distancia: } ${dInput}\\text{ ${distanciaUnit}} = ${d.toFixed(2)}\\text{ m}`,
          );
        }
        if (tiempoUnit !== "s") {
          steps.push(
            `\\text{Convertir tiempo: } ${tInput}\\text{ ${tiempoUnit}} = ${t.toFixed(2)}\\text{ s}`,
          );
        }

        steps.push(`\\text{Fórmula: } v = \\frac{d}{t}`);
        steps.push(
          `v = \\frac{${d.toFixed(2)}\\text{ m}}{${t.toFixed(2)}\\text{ s}}`,
        );

        const v = d / t;
        steps.push(`v = ${v.toFixed(2)}\\text{ m/s}`);

        const vConverted = convertFromSI(v, velocidadUnit, "velocity");
        if (velocidadUnit !== "m/s") {
          steps.push(`v = ${vConverted.toFixed(4)}\\text{ ${velocidadUnit}}`);
        }
        setResultado(`v = ${vConverted.toFixed(4)} ${velocidadUnit}`);
      }

      setPasos(steps);
    } catch {
      setResultado("Error: Verifica los valores ingresados");
      setPasos([]);
    }
  };

  const calcularDesdeGrafica = () => {
    try {
      const steps: string[] = [];
      const t0Val = parseFloat(t0);
      const x0Val = parseFloat(x0);
      const t1Val = parseFloat(t1);
      const x1Val = parseFloat(x1);

      steps.push(
        `\\text{Puntos: } (t_0, x_0) = (${t0Val}, ${x0Val}) \\text{ y } (t_1, x_1) = (${t1Val}, ${x1Val})`,
      );
      steps.push(
        `\\text{Fórmula: } v = \\frac{\\Delta x}{\\Delta t} = \\frac{x_1 - x_0}{t_1 - t_0}`,
      );

      const deltaX = x1Val - x0Val;
      const deltaT = t1Val - t0Val;

      steps.push(
        `\\Delta x = ${x1Val} - ${x0Val} = ${deltaX}\\text{ ${graphUnit}}`,
      );
      steps.push(
        `\\Delta t = ${t1Val} - ${t0Val} = ${deltaT}\\text{ ${graphTimeUnit}}`,
      );
      steps.push(
        `v = \\frac{${deltaX}}{${deltaT}} = ${(deltaX / deltaT).toFixed(2)}\\text{ ${graphUnit}/${graphTimeUnit}}`,
      );

      const vResult = deltaX / deltaT;
      setResultado(`v = ${vResult.toFixed(2)} ${graphUnit}/${graphTimeUnit}`);
      setPasos(steps);
    } catch {
      setResultado("Error: Verifica los valores ingresados");
      setPasos([]);
    }
  };

  return {
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
  };
};
