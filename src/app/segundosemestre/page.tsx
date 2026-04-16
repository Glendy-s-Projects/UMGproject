"use client";
import TitleCourse from "@/components/TitleCourse";
import { SegundoSemestreCursos } from "@/utils/data/routes";
import AppLayout from "@/components/AppLayout";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";

const SegundoSemestre = () => {
  return (
    <AppLayout
      title="Segundo Semestre"
      activeTopicId="2"
    >
      <section className="min-h-screen flex flex-col items-center gap-2 p-4">
        <main className="px-8 pb-16">
            <div className="max-w-7xl mx-auto">
              <header className="mb-16">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div className="max-w-2xl">
                    <TitleCourse course="Segundo Semestre" />
                  </div>
                  <div className="flex flex-col items-start lg:items-end gap-2"></div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {SegundoSemestreCursos.map((cursos, index) => {
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
                              <span className="material-symbols-outlined text-4xl">
                                {cursos.icon ? <cursos.icon /> : "menu_book"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h2 className="text-5xl font-black tracking-tighter text-black mb-6">
                              {cursos.name}
                            </h2>
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
                              <span className="material-symbols-outlined text-2xl">
                                {cursos.icon ? <cursos.icon /> : "grid_4x4"}
                              </span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tighter text-black mb-2">
                              {cursos.name}
                            </h2>
                            <p className="text-on-surface-variant text-sm leading-relaxed">
                              Conceptos fundamentales y teoría.
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  // Diseño estándar (tarjetas pequeñas) para el resto de cursos
                  const defaultIcons = [
                    "",
                    "",
                    "functions",
                    "view_in_ar",
                    "account_balance",
                  ];
                  const iconName = defaultIcons[index] || "folder";

                  return (
                    <Link
                      href={cursos.href}
                      className="md:col-span-4 bg-surface-container-low rounded-xl p-1 transition-all duration-300 hover:bg-surface-dim"
                      key={cursos.id}
                    >
                      <div className="bg-surface-container-lowest h-full rounded-[calc(0.75rem-2px)] p-8">
                        <div className="flex flex-col h-full">
                          <div className="mb-6 flex justify-between">
                            <span className="material-symbols-outlined text-3xl">
                              {cursos.icon ? <cursos.icon /> : iconName}
                            </span>
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
            </div>
        </main>
      </section>
    </AppLayout>
  );
};

export default SegundoSemestre;
