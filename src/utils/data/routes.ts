import { SemesterType } from "@/types/index";

export const SemesterRoutes: SemesterType[] = [
  {
    id: 1,
    name: "Primer Semestre",
    mainroute: "/primersemestre",
    routes: [],
    image: "/1.webp",
    bgColor: "#75fad7",
  },
  {
    id: 2,
    name: "Segundo Semestre",
    mainroute: "/segundosemestre",
    routes: [
      {
        id: 1,
        name: "Algoritmos",
        href: "/segundosemestre/algoritmos",
        bgColor: "bg-blue-300",
        image: "/Algoritmos.webp",
        subroutes: [
          {
            id: 1,
            name: "Videos Algoritmos",
            href: "/segundosemestre/algoritmos/videos-algoritmos",
            videos: [],
          },
          {
            id: 2,
            name: "Archivos de Drive",
            href: `/segundosemestre/algoritmos/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1cqIH25UKQGlKZg4XZs_w1Npq9NEVcnMo?usp=drive_link",
          },
        ],
      },
      {
        id: 2,
        name: "Precálculo",
        href: "/segundosemestre/precalculo",
        bgColor: "bg-teal-300",
        image: "/precalculo.webp",
        subroutes: [
          {
            id: 1,
            name: "Ecuaciones",
            href: "/segundosemestre/precalculo/ecuaciones",
          },
          {
            id: 2,
            name: "Geometraía Analítica",
            href: "/segundosemestre/precalculo/geometria-analitica",
          },
          {
            id: 3,
            name: "Polinomios",
            href: "/segundosemestre/precalculo/polinomios",
          },
          {
            id: 4,
            name: "Gráficas de polinomios",
            href: "/segundosemestre/precalculo/graficaspolionmios",
          },
          {
            id: 5,
            name: "División de polinomios",
            href: "/segundosemestre/precalculo/division-de-polinomios",
          },
          {
            id: 6,
            name: "Descarte de Signos",
            href: "/segundosemestre/precalculo/descarte-de-signos",
          },
          {
            id: 7,
            name: "Límites Superiores e Inferiores",
            href: "/segundosemestre/precalculo/limites-superiores-e-inferiores",
          },
          {
            id: 8,
            name: "Números Complejos",
            href: "/segundosemestre/precalculo/numeros-complejos",
          },
          {
            id: 9,
            name: "Identidades Fundamentales",
            href: "/segundosemestre/precalculo/identidades-fundamentales",
          },
          {
            id: 10,
            name: "Curvas Seno y Coseno",
            href: "/segundosemestre/precalculo/curvas-seno-y-coseno",
          },
          {
            id: 11,
            name: "Curvas Seno y Coseno Desplazadas",
            href: "/segundosemestre/precalculo/curvas-seno-y-coseno-desplazadas",
          },
          {
            id: 12,
            name: "Movimiento Armonico Simple",
            href: "/segundosemestre/precalculo/movimiento-armonico-simple",
          },
          {
            id: 13,
            name: "Movimiento Armonico Amortiguado",
            href: "/segundosemestre/precalculo/movimiento-armonico-amortiguado",
          },
          {
            id: 14,
            name: "Videos Precálculo",
            href: "/segundosemestre/precalculo/videos-precalculo",
            videos: [],
          },
          {
            id: 15,
            name: "Archivos de Drive",
            href: `/segundosemestre/precalculo/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1bLDdLOgMvMl6kUpS4_i80M0N4nzpDzCr?usp=sharing",
          },
        ],
      },
      {
        id: 3,
        name: "Algebra Lineal",
        href: "/segundosemestre/algebralineal",
        bgColor: "bg-green-300",
        image: "/algebra.webp",
        subroutes: [
          {
            id: 1,
            name: "Método de Gauss",
            href: "/segundosemestre/algebralineal/metodo-gauss",
          },
          {
            id: 2,
            name: "Método de Saruss",
            href: "/segundosemestre/algebralineal/metodo-de-saruss",
          },
          {
            id: 3,
            name: "Método de Laplace",
            href: "/segundosemestre/algebralineal/metodo-de-laplace",
          },
          {
            id: 4,
            name: "Método de Crammer",
            href: "/segundosemestre/algebralineal/metodo-de-cramer",
          },
          {
            id: 5,
            name: "Vectores 2D",
            href: "/segundosemestre/algebralineal/vectores2D",
          },
          {
            id: 6,
            name: "Vectores 3D",
            href: "/segundosemestre/algebralineal/vectores3D",
          },
          {
            id: 7,
            name: "Videos Álgebra Lineal",
            href: "/segundosemestre/algebralineal/videos-algebra-lineal",
            videos: [],
          },
          {
            id: 8,
            name: "Archivos de Drive",
            href: `/segundosemestre/algebralineal/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1IC-IWt4Hz-70pWdKSjurKT8nNe1mVDD9?usp=sharing",
          },
        ],
      },
      {
        id: 4,
        name: "Contabilidad II",
        href: "/segundosemestre/contabilidad",
        bgColor: "bg-green-100",
        image: "/contabilidad.webp",
        subroutes: [
          {
            id: 1,
            name: "Videos Contabilidad II",
            href: "/segundosemestre/contabilidad/videos-contabilidad-ii",
            videos: [],
          },
          {
            id: 2,
            name: "Archivos de Drive",
            href: `/segundosemestre/contabilidad/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1l4PZvpoxFMO85cL-exJRuBvyuTCH39RI?usp=sharing",
          },
        ],
      },
      {
        id: 5,
        name: "Matemática Discreta",
        href: "/segundosemestre/matematicadiscreta",
        bgColor: "bg-amber-300",
        image: "/matematicadiscreta1.webp",
        subroutes: [
          {
            id: 1,
            name: "Conversión de binario",
            href: "/segundosemestre/matematicadiscreta/conversion-binario",
          },
          {
            id: 2,
            name: "Compuertas lógicas",
            href: "/segundosemestre/matematicadiscreta/compuertas-logicas",
          },
          {
            id: 3,
            name: "Videos Matemática Discreta",
            href: "/segundosemestre/matematicadiscreta/videos-matematica-discreta",
            videos: [],
          },
          {
            id: 4,
            name: "Archivos de Drive",
            href: `/segundosemestre/matematicadiscreta/archivos-drive`,
            file: "https://drive.google.com/drive/folders/1LkQZL204S-4ic5xAeRCdVmra3UF5hhjM?usp=sharing",
          },
        ],
      },
    ],
    image: "/2.webp",
    bgColor: "#facc15",
  },
  {
    id: 3,
    name: "Tercer Semestre",
    mainroute: "/tercersemestre",
    routes: [
      {
        id: 1,
        name: "Fisica 1",
        href: "/tercersemestre/fisica1",
        bgColor: "bg-blue-300",
        image: "/fisica1.webp",
        subroutes: [
          {
            id: 1,
            name: "Videos Fisica 1",
            href: "/tercersemestre/fisica1/videos-fisica1",
          },
          {
            id: 2,
            name: "Archivos de Drive",
            href: `/tercersemestre/fisica1/archivos-drive`,
            file: "https://docs.google.com/document/d/1UCuLfq72FKuBNcmB7bTL3ss9CkE0ImASOkQSNtY_pys/edit?usp=sharing",
          },
        ],
      },
    ],
    image: "/3.webp",
    bgColor: "#fca5a5",
  },
];

export const cursos =
  SemesterRoutes.find((route) => route.id === 2)?.routes || [];

// Función para obtener las rutas de un curso específico por su ID
export const getTemasByCursoId = (cursoId: number) => {
  return (
    SemesterRoutes.find((route) => route.id === 2)?.routes.find(
      (r) => r.id === cursoId,
    )?.subroutes || []
  );
};

// Exportaciones específicas para cada curso
export const AlgoritmoSlugs = getTemasByCursoId(1); // ID 3 = Algebra Lineal
export const PrecalculoSlugs = getTemasByCursoId(2); // ID 3 = Algebra Lineal
export const AlgebraLinealSlugs = getTemasByCursoId(3); // ID 3 = Algebra Lineal
export const ContabilidadSlugs = getTemasByCursoId(4); // ID 4 = Contabilidad II
export const MatematicaDiscretaSlugs = getTemasByCursoId(5); // ID 5 = Matemática Discreta
