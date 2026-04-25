import Link from "next/link";
import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { Skeleton } from "@/context/components/ui/skeleton";
import { routetype } from "@/types/index";
import { BookIcon } from "@phosphor-icons/react/dist/ssr";

const Grids = ({
  mainSemester,
  loading = false,
}: {
  mainSemester: routetype[];
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <Skeleton className="md:col-span-8 rounded-xl min-h-[400px] bg-surface-container-low" />
        <Skeleton className="md:col-span-4 rounded-xl min-h-[400px] bg-surface-container-low" />
        <Skeleton className="md:col-span-4 rounded-xl min-h-[250px] bg-surface-container-low" />
        <Skeleton className="md:col-span-4 rounded-xl min-h-[250px] bg-surface-container-low" />
        <Skeleton className="md:col-span-4 rounded-xl min-h-[250px] bg-surface-container-low" />
      </div>
    );
  }

  if (!mainSemester || mainSemester.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl  p-8 min-h-[400px]">
        <p className="text-2xl font-bold text-on-surface-variant">
          Aún no se han agregado cursos para este semestre. Vuelve pronto.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {mainSemester.map((cursos, index) => {
        // Diseño principal para el primer curso
        if (index === 0) {
          return (
            <Link
              href={cursos.href}
              className="md:col-span-8 group bg-surface-container-low rounded-xl p-1 relative overflow-hidden transition-all duration-300 hover:bg-surface-dim"
              key={cursos.id}
            >
              <div className="bg-surface-container-lowest h-full rounded-[calc(0.75rem-2px)] p-8 flex flex-col justify-between min-h-[400px]">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-surface-container-high rounded-lg">
                    {cursos.icon ? (
                      <cursos.icon className="text-4xl" />
                    ) : (
                      <span className="material-symbols-outlined text-4xl">
                        <BookIcon />
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-5xl font-black tracking-tighter text-black mb-6">
                    {cursos.name}
                  </h2>
                  <button className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold text-sm hover:opacity-90 transition-opacity cursor-pointer">
                    Ver Contenido
                  </button>
                </div>
              </div>
            </Link>
          );
        }

        // Diseño secundario para el segundo curso
        if (index === 1) {
          return (
            <Link
              href={cursos.href}
              className="md:col-span-4 bg-surface-container-low rounded-xl p-1 transition-all duration-300 hover:bg-surface-dim"
              key={cursos.id}
            >
              <div className="bg-surface-container-lowest h-full rounded-[calc(0.75rem-2px)] p-8 flex flex-col">
                <div className="mb-auto">
                  <div className="w-12 h-12 flex items-center justify-center bg-surface-container-high rounded-full mb-6">
                    {cursos.icon ? (
                      <cursos.icon className="text-2xl" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl">
                        <BookIcon />
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-black mb-2">
                    {cursos.name}
                  </h2>
                </div>
              </div>
            </Link>
          );
        }
        return (
          <Link
            href={cursos.href}
            className="md:col-span-4 bg-surface-container-low rounded-xl p-1 transition-all duration-300 hover:bg-surface-dim"
            key={cursos.id}
          >
            <div className="bg-surface-container-lowest h-full rounded-[calc(0.75rem-2px)] p-8">
              <div className="flex flex-col h-full">
                <div className="mb-6 flex justify-between">
                  {cursos.icon && <cursos.icon className="text-3xl" />}
                  <span className="material-symbols-outlined text-zinc-300">
                    <MdArrowOutward />
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-black mt-auto">
                  {cursos.name}
                </h2>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Grids;
