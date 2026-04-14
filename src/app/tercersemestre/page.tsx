"use client";
import Cards from "@/components/Cards";
import TitleCourse from "@/components/TitleCourse";
import { SemesterRoutes, TercerSemestreCursos } from "@/utils/data/routes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AppSidebar from '@/components/Sidebar';
import { SidebarInset, SidebarTrigger } from "@/context/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/context/components/ui/breadcrumb";

const TercerSemestre = () => {
  const router = useRouter();

  const staticTopics = SemesterRoutes.map((route) => ({
    $id: route.id.toString(),
    semester: route.name,
  }));

  const [activeTopicId, setActiveTopicId] = useState<string | null>("1");

  const handleTopicSelect = (id: string) => {
    setActiveTopicId(id);
    const topic = SemesterRoutes.find((r) => r.id.toString() === id);
    if (topic) {
      router.push(topic.mainroute);
    }
  };
  return (
    
    <>
      <AppSidebar
        topics={staticTopics}
        activeTopicId={activeTopicId}
        onTopicSelect={handleTopicSelect}
        isAdmin={false}
      />
      <SidebarInset>
        <header className="sticky top-0 w-full z-30 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-outline-variant/15">
          <div className="flex items-center px-4 md:px-8 h-20 w-full max-w-screen-2xl mx-auto gap-2 md:gap-4 text-xl md:text-2xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 uppercase">
            <SidebarTrigger />
            <span>Segundo Semestre</span>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-8 md:py-12 max-w-screen-xl w-full mx-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tercer Semestre</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </main>
        <section className="min-h-screen flex flex-col items-center gap-2 p-4 ">
          <main className=" px-8 pb-16">
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
                {TercerSemestreCursos.map((cursos, index) => {
                  // Diseño principal para el primer curso
                  if (index === 0) {
                    return (
                      <div className="md:col-span-8 group bg-surface-container-low rounded-xl p-1 relative overflow-hidden transition-all duration-300 hover:bg-surface-dim" key={cursos.id}>
                        <div className="bg-surface-container-lowest h-full rounded-[calc(0.75rem-2px)] p-8 flex flex-col justify-between min-h-[400px]">
                          <div className="flex justify-between items-start">
                            <div className="p-4 bg-surface-container-high rounded-lg">
                              <span className="material-symbols-outlined text-4xl">
                                {cursos.icon ? <cursos.icon /> : "menu_book"}
                              </span>
                            </div>
                            <span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                              Destacado
                            </span>
                          </div>
                          <div>
                            <p className="text-zinc-400 text-sm font-medium mb-2">Principal</p>
                            <h2 className="text-5xl font-black tracking-tighter text-black mb-6">
                              {cursos.name}
                            </h2>
                            <div className="flex gap-4 items-center">
                              <button className="bg-primary text-on-primary px-6 py-3 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                                Ver Curso
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Diseño secundario para el segundo curso
                  if (index === 1) {
                    return (
                      <div className="md:col-span-4 bg-surface-container-low rounded-xl p-1 transition-all duration-300 hover:bg-surface-dim" key={cursos.id}>
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
                          <div className="pt-8 mt-8 border-t border-surface-container-high">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-zinc-400">ESTADO</span>
                              <span className="text-xs font-bold text-primary">Activo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Diseño estándar (tarjetas pequeñas) para el resto de cursos
                  const defaultIcons = ["", "", "functions", "view_in_ar", "account_balance"];
                  const iconName = defaultIcons[index] || "folder";

                  return (
                    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-1 transition-all duration-300 hover:bg-surface-dim" key={cursos.id}>
                      <div className="bg-surface-container-lowest h-full rounded-[calc(0.75rem-2px)] p-8">
                        <div className="flex flex-col h-full">
                          <div className="mb-6 flex justify-between">
                            <span className="material-symbols-outlined text-3xl">
                              {cursos.icon ? <cursos.icon /> : iconName}
                            </span>
                            <span className="material-symbols-outlined text-zinc-300">
                              north_east
                            </span>
                          </div>
                          <h2 className="text-2xl font-black tracking-tighter text-black mt-auto">
                            {cursos.name}
                          </h2>
                          <p className="text-zinc-400 text-xs mt-1">
                            Ver recursos
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </section>
      </SidebarInset>
    </>
  );
};

export default TercerSemestre;
