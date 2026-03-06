'use client'
import React, { useState } from 'react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

type Variable = 'velocidad' | 'distancia' | 'tiempo'
type VelocityUnit = 'km/h' | 'm/s' | 'mi/h'
type DistanceUnit = 'km' | 'm' | 'mi' | 'ft' | 'cm'
type TimeUnit = 'h' | 'min' | 's'
type TabType = 'basico' | 'grafica' | 'encuentro'

const MovimientoRectilineoUniforme = () => {
  const [activeTab, setActiveTab] = useState<TabType>('basico')
  const [calcular, setCalcular] = useState<Variable>('tiempo')
  const [velocidad, setVelocidad] = useState('')
  const [velocidadUnit, setVelocidadUnit] = useState<VelocityUnit>('km/h')
  const [distancia, setDistancia] = useState('')
  const [distanciaUnit, setDistanciaUnit] = useState<DistanceUnit>('km')
  const [tiempo, setTiempo] = useState('')
  const [tiempoUnit, setTiempoUnit] = useState<TimeUnit>('h')
  const [resultado, setResultado] = useState<string | null>(null)
  const [pasos, setPasos] = useState<string[]>([])
  
  // Estados para velocidad desde gráfica
  const [t0, setT0] = useState('')
  const [x0, setX0] = useState('')
  const [t1, setT1] = useState('')
  const [x1, setX1] = useState('')
  const [graphUnit, setGraphUnit] = useState<DistanceUnit>('m')
  const [graphTimeUnit, setGraphTimeUnit] = useState<TimeUnit>('s')
  
  // Estados para encuentro
  const [x1_0, setX1_0] = useState('')
  const [v1, setV1] = useState('')
  const [x2_0, setX2_0] = useState('')
  const [v2, setV2] = useState('')
  const [encuentroDistUnit, setEncuentroDistUnit] = useState<DistanceUnit>('km')
  const [encuentroVelUnit, setEncuentroVelUnit] = useState<VelocityUnit>('km/h')

  const convertToSI = (value: number, unit: VelocityUnit | DistanceUnit | TimeUnit, type: 'velocity' | 'distance' | 'time'): number => {
    if (type === 'velocity') {
      const conversions: Record<VelocityUnit, number> = { 'km/h': 1/3.6, 'm/s': 1, 'mi/h': 0.44704 }
      return value * conversions[unit as VelocityUnit]
    }
    if (type === 'distance') {
      const conversions: Record<DistanceUnit, number> = { 'km': 1000, 'm': 1, 'mi': 1609.34, 'ft': 0.3048, 'cm': 0.01 }
      return value * conversions[unit as DistanceUnit]
    }
    const conversions: Record<TimeUnit, number> = { 'h': 3600, 'min': 60, 's': 1 }
    return value * conversions[unit as TimeUnit]
  }

  const convertFromSI = (value: number, unit: VelocityUnit | DistanceUnit | TimeUnit, type: 'velocity' | 'distance' | 'time'): number => {
    if (type === 'velocity') {
      const conversions: Record<VelocityUnit, number> = { 'km/h': 3.6, 'm/s': 1, 'mi/h': 2.23694 }
      return value * conversions[unit as VelocityUnit]
    }
    if (type === 'distance') {
      const conversions: Record<DistanceUnit, number> = { 'km': 0.001, 'm': 1, 'mi': 0.000621371, 'ft': 3.28084, 'cm': 100 }
      return value * conversions[unit as DistanceUnit]
    }
    const conversions: Record<TimeUnit, number> = { 'h': 1/3600, 'min': 1/60, 's': 1 }
    return value * conversions[unit as TimeUnit]
  }

  const calcularMRU = () => {
    try {
      const steps: string[] = []
      
      if (calcular === 'tiempo') {
        const vInput = parseFloat(velocidad)
        const dInput = parseFloat(distancia)
        
        // Paso 1: Conversión de velocidad si es necesario
        if (velocidadUnit !== 'm/s') {
          const vInMS = convertToSI(vInput, velocidadUnit, 'velocity')
          if (velocidadUnit === 'km/h') {
            steps.push(`\\text{Convertir velocidad a m/s:}`)
            steps.push(`${vInput}\\text{ km/h} \\times \\frac{1000\\text{ m}}{3600\\text{ s}} = ${vInMS.toFixed(2)}\\text{ m/s}`)
          } else {
            steps.push(`\\text{Convertir velocidad: } ${vInput}\\text{ ${velocidadUnit}} = ${vInMS.toFixed(2)}\\text{ m/s}`)
          }
        }
        
        // Paso 2: Conversión de distancia si es necesario
        const d = convertToSI(dInput, distanciaUnit, 'distance')
        if (distanciaUnit !== 'm') {
          steps.push(`\\text{Convertir distancia: } ${dInput}\\text{ ${distanciaUnit}} = ${d.toFixed(2)}\\text{ m}`)
        }
        
        // Paso 3: Fórmula
        steps.push(`\\text{Despejar tiempo: } t = \\frac{d}{v}`)
        
        // Paso 4: Sustitución
        const v = convertToSI(vInput, velocidadUnit, 'velocity')
        steps.push(`t = \\frac{${d.toFixed(2)}\\text{ m}}{${v.toFixed(2)}\\text{ m/s}}`)
        
        // Paso 5: Resultado
        const t = d / v
        steps.push(`t = ${t.toFixed(2)}\\text{ segundos}`)
        
        const tConverted = convertFromSI(t, tiempoUnit, 'time')
        const hours = Math.floor(t / 3600)
        const seconds = Math.floor(t % 3600)
        setResultado(`t = ${t.toFixed(2)} segundos = ${tConverted.toFixed(4)} ${tiempoUnit} (${hours}h ${seconds}s)`)
        
      } else if (calcular === 'distancia') {
        const vInput = parseFloat(velocidad)
        const tInput = parseFloat(tiempo)
        
        // Conversiones
        const v = convertToSI(vInput, velocidadUnit, 'velocity')
        const t = convertToSI(tInput, tiempoUnit, 'time')
        
        if (velocidadUnit !== 'm/s') {
          if (velocidadUnit === 'km/h') {
            steps.push(`\\text{Convertir velocidad a m/s:}`)
            steps.push(`${vInput}\\text{ km/h} \\times \\frac{1000}{3600} = ${v.toFixed(2)}\\text{ m/s}`)
          } else {
            steps.push(`\\text{Convertir velocidad: } ${vInput}\\text{ ${velocidadUnit}} = ${v.toFixed(2)}\\text{ m/s}`)
          }
        }
        if (tiempoUnit !== 's') {
          steps.push(`\\text{Convertir tiempo: } ${tInput}\\text{ ${tiempoUnit}} = ${t.toFixed(2)}\\text{ s}`)
        }
        
        steps.push(`\\text{Calcular distancia: } d = v \\times t`)
        steps.push(`d = ${v.toFixed(2)}\\text{ m/s} \\times ${t.toFixed(2)}\\text{ s}`)
        
        const d = v * t
        steps.push(`d = ${d.toFixed(2)}\\text{ metros}`)
        
        // Convertir a todas las unidades
        const dKm = d * 0.001
        const dMi = d * 0.000621371
        const dFt = d * 3.28084
        const dCm = d * 100
        
        if (distanciaUnit !== 'm') {
          const factor = distanciaUnit === 'ft' ? '3.28084' : distanciaUnit === 'km' ? '0.001' : distanciaUnit === 'cm' ? '100' : '0.000621371'
          const dConverted = convertFromSI(d, distanciaUnit, 'distance')
          steps.push(`\\text{Convertir a ${distanciaUnit} (1 m = ${factor} ${distanciaUnit}):}`)
          steps.push(`${d.toFixed(2)} \\times ${factor} = ${dConverted.toFixed(2)}\\text{ ${distanciaUnit}}`)
        }
        
        setResultado(`d = ${d.toFixed(2)} m = ${dKm.toFixed(4)} km = ${dFt.toFixed(2)} ft = ${dCm.toFixed(2)} cm = ${dMi.toFixed(4)} mi`)
        
      } else {
        const dInput = parseFloat(distancia)
        const tInput = parseFloat(tiempo)
        
        // Conversiones
        const d = convertToSI(dInput, distanciaUnit, 'distance')
        const t = convertToSI(tInput, tiempoUnit, 'time')
        
        if (distanciaUnit !== 'm') {
          steps.push(`\\text{Convertir distancia: } ${dInput}\\text{ ${distanciaUnit}} = ${d.toFixed(2)}\\text{ m}`)
        }
        if (tiempoUnit !== 's') {
          steps.push(`\\text{Convertir tiempo: } ${tInput}\\text{ ${tiempoUnit}} = ${t.toFixed(2)}\\text{ s}`)
        }
        
        steps.push(`\\text{Fórmula: } v = \\frac{d}{t}`)
        steps.push(`v = \\frac{${d.toFixed(2)}\\text{ m}}{${t.toFixed(2)}\\text{ s}}`)
        
        const v = d / t
        steps.push(`v = ${v.toFixed(2)}\\text{ m/s}`)
        
        const vConverted = convertFromSI(v, velocidadUnit, 'velocity')
        if (velocidadUnit !== 'm/s') {
          steps.push(`v = ${vConverted.toFixed(4)}\\text{ ${velocidadUnit}}`)
        }
        setResultado(`v = ${vConverted.toFixed(4)} ${velocidadUnit}`)
      }
      
      setPasos(steps)
    } catch {
      setResultado('Error: Verifica los valores ingresados')
      setPasos([])
    }
  }

  const calcularDesdeGrafica = () => {
    try {
      const steps: string[] = []
      const t0Val = parseFloat(t0)
      const x0Val = parseFloat(x0)
      const t1Val = parseFloat(t1)
      const x1Val = parseFloat(x1)
      
      steps.push(`\\text{Puntos: } (t_0, x_0) = (${t0Val}, ${x0Val}) \\text{ y } (t_1, x_1) = (${t1Val}, ${x1Val})`)
      steps.push(`\\text{Fórmula: } v = \\frac{\\Delta x}{\\Delta t} = \\frac{x_1 - x_0}{t_1 - t_0}`)
      
      const deltaX = x1Val - x0Val
      const deltaT = t1Val - t0Val
      
      steps.push(`\\Delta x = ${x1Val} - ${x0Val} = ${deltaX}\\text{ ${graphUnit}}`)
      steps.push(`\\Delta t = ${t1Val} - ${t0Val} = ${deltaT}\\text{ ${graphTimeUnit}}`)
      steps.push(`v = \\frac{${deltaX}}{${deltaT}} = ${(deltaX/deltaT).toFixed(2)}\\text{ ${graphUnit}/${graphTimeUnit}}`)
      
      const vResult = deltaX / deltaT
      setResultado(`v = ${vResult.toFixed(2)} ${graphUnit}/${graphTimeUnit}`)
      setPasos(steps)
    } catch {
      setResultado('Error: Verifica los valores ingresados')
      setPasos([])
    }
  }

  const calcularEncuentro = () => {
    try {
      const steps: string[] = []
      const x1_0Val = parseFloat(x1_0)
      const v1Val = parseFloat(v1)
      const x2_0Val = parseFloat(x2_0)
      const v2Val = parseFloat(v2)
      
      steps.push(`\\text{Ecuaciones de posición:}`)
      steps.push(`x_1(t) = ${x1_0Val} + ${v1Val}t`)
      steps.push(`x_2(t) = ${x2_0Val} + ${v2Val}t`)
      steps.push(`\\text{Condición de encuentro: } x_1(t) = x_2(t)`)
      steps.push(`${x1_0Val} + ${v1Val}t = ${x2_0Val} + ${v2Val}t`)
      
      const coefT = v1Val - v2Val
      const constante = x2_0Val - x1_0Val
      
      steps.push(`${v1Val}t - ${v2Val}t = ${x2_0Val} - ${x1_0Val}`)
      steps.push(`${coefT}t = ${constante}`)
      
      const tEncuentro = constante / coefT
      steps.push(`t = \\frac{${constante}}{${coefT}} = ${tEncuentro.toFixed(2)}\\text{ unidades de tiempo}`)
      
      const xEncuentro = x1_0Val + v1Val * tEncuentro
      steps.push(`\\text{Posición de encuentro:}`)
      steps.push(`x = ${x1_0Val} + ${v1Val}(${tEncuentro.toFixed(2)}) = ${xEncuentro.toFixed(2)}\\text{ ${encuentroDistUnit}}`)
      
      setResultado(`Se encuentran en t = ${tEncuentro.toFixed(2)} unidades, en x = ${xEncuentro.toFixed(2)} ${encuentroDistUnit}`)
      setPasos(steps)
    } catch {
      setResultado('Error: Verifica los valores ingresados')
      setPasos([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
          Movimiento Rectilíneo Uniforme (MRU)
        </h1>
        
        {/* Pestañas */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
          <button
            onClick={() => { setActiveTab('basico'); setResultado(null); setPasos([]) }}
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'basico' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-400'}`}
          >
            Cálculo Básico
          </button>
          <button
            onClick={() => { setActiveTab('grafica'); setResultado(null); setPasos([]) }}
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'grafica' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-400'}`}
          >
            Desde Gráfica
          </button>
          <button
            onClick={() => { setActiveTab('encuentro'); setResultado(null); setPasos([]) }}
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'encuentro' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-400'}`}
          >
            Encuentro
          </button>
        </div>
        
        {/* Contenido Cálculo Básico */}
        {activeTab === 'basico' && (
          <>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ¿Qué deseas calcular?
          </label>
          <select
            value={calcular}
            onChange={(e) => { setCalcular(e.target.value as Variable); setResultado(null); setPasos([]) }}
            className="w-full p-3 border-2 border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="tiempo">Tiempo</option>
            <option value="distancia">Distancia</option>
            <option value="velocidad">Velocidad</option>
          </select>
        </div>

        {calcular !== 'velocidad' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Velocidad</label>
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
                onChange={(e) => setVelocidadUnit(e.target.value as VelocityUnit)}
                className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="km/h">km/h</option>
                <option value="m/s">m/s</option>
                <option value="mi/h">mi/h</option>
              </select>
            </div>
          </div>
        )}

        {calcular !== 'distancia' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Distancia</label>
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
                onChange={(e) => setDistanciaUnit(e.target.value as DistanceUnit)}
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

        {calcular !== 'tiempo' && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tiempo</label>
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
        
        {/* Contenido Velocidad desde Gráfica */}
        {activeTab === 'grafica' && (
          <>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Punto Inicial (t₀, x₀)</h3>
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
              <h3 className="font-semibold text-gray-700 mb-3">Punto Final (t₁, x₁)</h3>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unidad de distancia</label>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unidad de tiempo</label>
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
        
        {/* Contenido Encuentro */}
        {activeTab === 'encuentro' && (
          <>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Móvil 1: x₁(t) = x₁₀ + v₁·t</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={x1_0}
                  onChange={(e) => setX1_0(e.target.value)}
                  placeholder="Posición inicial x₁₀"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  value={v1}
                  onChange={(e) => setV1(e.target.value)}
                  placeholder="Velocidad v₁"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Móvil 2: x₂(t) = x₂₀ + v₂·t</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={x2_0}
                  onChange={(e) => setX2_0(e.target.value)}
                  placeholder="Posición inicial x₂₀"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  value={v2}
                  onChange={(e) => setV2(e.target.value)}
                  placeholder="Velocidad v₂"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unidad de distancia</label>
                <select
                  value={encuentroDistUnit}
                  onChange={(e) => setEncuentroDistUnit(e.target.value as DistanceUnit)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="km">km</option>
                  <option value="m">m</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unidad de velocidad</label>
                <select
                  value={encuentroVelUnit}
                  onChange={(e) => setEncuentroVelUnit(e.target.value as VelocityUnit)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="km/h">km/h</option>
                  <option value="m/s">m/s</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={calcularEncuentro}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
            >
              Calcular Encuentro
            </button>
          </>
        )}

        {pasos.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <h2 className="text-lg font-bold text-green-900 mb-3">Pasos de la solución:</h2>
              {pasos.map((paso, idx) => (
                <div key={idx} className="mb-3 text-center">
                  <BlockMath math={paso} />
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-indigo-50 border-2 border-indigo-300 rounded-lg">
              <h2 className="text-lg font-bold text-indigo-900 mb-2">Resultado Final:</h2>
              <p className="text-xl text-indigo-700 font-semibold">{resultado}</p>
            </div>
          </div>
        )}

        {activeTab === 'basico' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Fórmulas MRU:</h3>
            <div className="space-y-2 text-center">
              <div><InlineMath math="v = \\frac{d}{t}" /></div>
              <div><InlineMath math="d = v \\times t" /></div>
              <div><InlineMath math="t = \\frac{d}{v}" /></div>
            </div>
          </div>
        )}
        
        {activeTab === 'grafica' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Fórmula:</h3>
            <div className="text-center">
              <BlockMath math="v = \\frac{\\Delta x}{\\Delta t} = \\frac{x_1 - x_0}{t_1 - t_0}" />
            </div>
          </div>
        )}
        
        {activeTab === 'encuentro' && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">Condición de encuentro:</h3>
            <div className="text-center">
              <BlockMath math="x_1(t) = x_2(t)" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovimientoRectilineoUniforme