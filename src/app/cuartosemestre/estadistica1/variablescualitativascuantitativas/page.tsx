"use client";
import React, { useState } from "react";

type Fila = { id: number; min: string; max: string; fi: string };

const iniciales: Fila[] = [
  { id: 1, min: "20", max: "29", fi: "6" },
  { id: 2, min: "30", max: "39", fi: "12" },
  { id: 3, min: "40", max: "49", fi: "20" },
  { id: 4, min: "50", max: "59", fi: "24" },
  { id: 5, min: "60", max: "69", fi: "13" },
  { id: 6, min: "70", max: "79", fi: "5" },
];

const VariableCuantitativaCualitativa = () => {
  const [filas, setFilas] = useState<Fila[]>(iniciales);
  const [nextId, setNextId] = useState(7);

  const actualizar = (id: number, campo: keyof Fila, valor: string) =>
    setFilas(filas.map((f) => (f.id === id ? { ...f, [campo]: valor } : f)));

  const agregarFila = () => {
    setFilas([...filas, { id: nextId, min: "", max: "", fi: "" }]);
    setNextId(nextId + 1);
  };

  const eliminarFila = (id: number) => setFilas(filas.filter((f) => f.id !== id));

  const tabla = filas.reduce(
    (acc, f) => {
      const min = parseFloat(f.min);
      const max = parseFloat(f.max);
      const fi = parseFloat(f.fi);
      if (isNaN(min) || isNaN(max) || isNaN(fi)) return acc;
      const xi = (min + max) / 2;
      const fixi = fi * xi;
      const fa = (acc.at(-1)?.fa ?? 0) + fi;
      return [...acc, { min, max, fi, xi, fixi, fa }];
    },
    [] as { min: number; max: number; fi: number; xi: number; fixi: number; fa: number }[],
  );

  const totalFi = tabla.reduce((s, r) => s + r.fi, 0);
  const totalFixi = tabla.reduce((s, r) => s + r.fixi, 0);
  const c = tabla.length > 0 ? tabla[0].max - tabla[0].min + 1 : 10;
  const media = totalFi > 0 ? totalFixi / totalFi : 0;

  const mitad = totalFi / 2;
  const medIdx = tabla.findIndex((r) => r.fa >= mitad);
  const medRow = medIdx >= 0 ? tabla[medIdx] : null;
  const fAntMed = medIdx > 0 ? tabla[medIdx - 1].fa : 0;
  const mediana = medRow ? medRow.min + ((mitad - fAntMed) / medRow.fi) * c : 0;

  const modRow = tabla.length > 0 ? tabla.reduce((a, b) => (b.fi > a.fi ? b : a)) : null;
  const modIdx = modRow ? tabla.indexOf(modRow) : -1;
  const d1 = modRow ? modRow.fi - (modIdx > 0 ? tabla[modIdx - 1].fi : 0) : 0;
  const d2 = modRow ? modRow.fi - (modIdx < tabla.length - 1 ? tabla[modIdx + 1].fi : 0) : 0;
  const moda = modRow ? modRow.min + (d1 / (d1 + d2)) * c : 0;

  const xMin = tabla.length > 0 ? Math.min(...tabla.map((r) => r.min)) : 0;
  const xMax = tabla.length > 0 ? Math.max(...tabla.map((r) => r.max)) : 0;
  const rango = xMax - xMin;

  const varianza =
    totalFi > 0
      ? tabla.reduce((s, r) => s + r.fi * Math.pow(r.xi - media, 2), 0) / totalFi
      : 0;
  const desviacion = Math.sqrt(varianza);
  const cv = media > 0 ? (desviacion / media) * 100 : 0;

  const inputCls = "w-full text-center bg-transparent outline-none border-none";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Variables Cuantitativas y Cualitativas</h1>
      <div className="overflow-x-auto">
        <table className="border-collapse border border-gray-400 text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-3 py-2">L. Inferior</th>
              <th className="border border-gray-400 px-3 py-2">L. Superior</th>
              <th className="border border-gray-400 px-3 py-2">fi</th>
              <th className="border border-gray-400 px-4 py-2">Marca de clase (xi)</th>
              <th className="border border-gray-400 px-4 py-2">fi · xi</th>
              <th className="border border-gray-400 px-4 py-2">Frecuencia Acumulada</th>
              <th className="border border-gray-400 px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => {
              const min = parseFloat(f.min);
              const max = parseFloat(f.max);
              const fi = parseFloat(f.fi);
              const xi = !isNaN(min) && !isNaN(max) ? (min + max) / 2 : null;
              const fixi = xi !== null && !isNaN(fi) ? fi * xi : null;
              const row = tabla.find((r) => r.min === min && r.max === max && r.fi === fi);
              return (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="border border-gray-400 px-2 py-1">
                    <input className={inputCls} value={f.min} onChange={(e) => actualizar(f.id, "min", e.target.value)} />
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <input className={inputCls} value={f.max} onChange={(e) => actualizar(f.id, "max", e.target.value)} />
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <input className={inputCls} value={f.fi} onChange={(e) => actualizar(f.id, "fi", e.target.value)} />
                  </td>
                  <td className="border border-gray-400 px-4 py-1">{xi !== null ? xi : "-"}</td>
                  <td className="border border-gray-400 px-4 py-1">{fixi !== null ? fixi : "-"}</td>
                  <td className="border border-gray-400 px-4 py-1">{row ? row.fa : "-"}</td>
                  <td className="border border-gray-400 px-2 py-1">
                    <button onClick={() => eliminarFila(f.id)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                  </td>
                </tr>
              );
            })}
            <tr className="font-bold bg-gray-100">
              <td className="border border-gray-400 px-4 py-2" colSpan={2}>Total</td>
              <td className="border border-gray-400 px-4 py-2">{totalFi}</td>
              <td className="border border-gray-400 px-4 py-2">-</td>
              <td className="border border-gray-400 px-4 py-2">{totalFixi}</td>
              <td className="border border-gray-400 px-4 py-2">-</td>
              <td className="border border-gray-400 px-2 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={agregarFila} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        + Agregar fila
      </button>

      {tabla.length > 0 && (
        <div className="mt-6 space-y-2">
          <p><span className="font-bold">Media agrupada:</span> x̄ = Σ(fi · xi) / n = {totalFixi} / {totalFi} = <span className="font-bold">{media.toFixed(2)}</span></p>
          {medRow && <p><span className="font-bold">Mediana:</span> Me = L + ((n/2 - Fa) / f) · c = {medRow.min} + (({mitad} - {fAntMed}) / {medRow.fi}) · {c} = <span className="font-bold">{mediana.toFixed(2)}</span></p>}
          {modRow && <p><span className="font-bold">Moda:</span> Mo = L + (d1 / (d1 + d2)) · c = {modRow.min} + ({d1} / ({d1} + {d2})) · {c} = <span className="font-bold">{moda.toFixed(2)}</span></p>}
          <p><span className="font-bold">Rango aproximado:</span> R = Xmáx - Xmín = {xMax} - {xMin} = <span className="font-bold">{rango}</span></p>
          <p><span className="font-bold">Varianza poblacional:</span> σ² = Σfi(xi - x̄)² / n = <span className="font-bold">{varianza.toFixed(2)}</span></p>
          <p><span className="font-bold">Desviación estándar:</span> σ = √σ² = √{varianza.toFixed(2)} = <span className="font-bold">{desviacion.toFixed(2)}</span></p>
          <p><span className="font-bold">Coeficiente de variación:</span> CV = (σ / x̄) · 100 = ({desviacion.toFixed(2)} / {media.toFixed(2)}) · 100 = <span className="font-bold">{cv.toFixed(2)}%</span></p>
        </div>
      )}
    </div>
  );
};

export default VariableCuantitativaCualitativa;
