"use client";
import TitleCourse from "@/components/TitleCourse";
import React, { useState } from "react";
import AppSidebar from "@/components/Sidebar";
import { SidebarInset, SidebarTrigger } from "@/context/components/ui/sidebar";
import { SemesterRoutes } from "@/utils/data/routes";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/context/components/ui/breadcrumb";

const PrimerSemestre = () => {
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

      <SidebarInset className="flex flex-col flex-1 w-full bg-background transition-all duration-200 ease-linear">
        <header className="sticky top-0 w-full z-30 bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-outline-variant/15">
          <div className="flex items-center px-4 md:px-8 h-20 w-full max-w-screen-2xl mx-auto gap-2 md:gap-4 text-xl md:text-2xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 uppercase">
            <SidebarTrigger />
            <span>Primer Semestre</span>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-8 md:py-12 max-w-screen-xl w-full mx-auto">
          <div className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Primer Semestre</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <section className="flex flex-col items-center justify-start gap-8 p-4">
            <TitleCourse course="Primer Semestre" />
            <div className="h-full flex justify-center  ">
              <p className="">Aun no hay cursos disponibles para este semestre.</p>
            </div>
          </section>
        </main>
      </SidebarInset>
    </>
  );
};

export default PrimerSemestre;
