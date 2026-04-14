"use client";
import { useState } from "react";
import Cards from "@/components/Cards";
import { SemesterRoutes } from "@/utils/data/routes";
import AppSidebar from "@/components/Sidebar";
import { SidebarInset, SidebarTrigger } from "@/context/components/ui/sidebar";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/context/components/ui/breadcrumb";

export default function Home() {
  const router = useRouter();

  // Convertimos las rutas estáticas al formato que espera el Sidebar
  const staticTopics = SemesterRoutes.map((route) => ({
    $id: route.id.toString(),
    semester: route.name,
  }));

  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

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
            <span>Ingenieria en Sistemas</span>
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
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-primary">
                  Ingeniería
                  <br />
                  en Sistemas
                </h1>
                <p className="max-w-xl text-black font-body leading-relaxed text-lg">
                  Bienvenido a tu viaje académico en Ingeniería en Sistemas.
                  Aquí encontrarás recursos, guías y apoyo para cada semestre de
                  la carrera Ingenieria en Sistemas. Explora los temas, accede a
                  materiales de estudio y prepárate para cada fase de tu
                  formación. ¡Vamos juntos hacia el éxito académico!
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-surface-container-high p-6"></div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-outline-variant/20">
            {SemesterRoutes.map((route) => (
              <Link
                className="group bg-surface-container-lowest border-r border-black/5 hover:bg-black hover:text-white transition-colors duration-300 p-10 flex flex-col h-[500px] relative overflow-hidden"
                key={route.id}
                href={route.mainroute}
              >
                <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase"></span>
                  <span className="material-symbols-outlined opacity-30 group-hover:opacity-100 transition-opacity">
                    <MdArrowOutward />
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <div className="terminal-num text-8xl font-black tracking-tighter mb-4 opacity-10 group-hover:opacity-20 absolute -top-4 -right-4 uppercase">
                    {route.acronym}
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                      {route.name}
                    </h2>
                    <ul className="text-[11px] font-bold tracking-widest space-y-2 opacity-60 group-hover:opacity-100 transition-opacity uppercase">
                      {route.routes.map((route) => (
                        <li key={route.id}>- {route.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </main>
      </SidebarInset>
    </>
  );
}
