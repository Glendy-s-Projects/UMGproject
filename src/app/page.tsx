"use client";
import AppLayout from "@/components/AppLayout";
import { SemesterRoutes } from "@/utils/data/routes";
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTopics, getCourses } from "../../lib/appwrite";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

export default function Home() {
  const [routes, setRoutes] = useState(SemesterRoutes);

  useEffect(() => {
    const fetchDynamicRoutes = async () => {
      try {
        const topics = await getTopics();
        if (topics) {
          const updatedRoutes = [...SemesterRoutes];
          const coursesData = await Promise.all(
            topics.map(async (topic) => {
              const courses = await getCourses(topic.$id);
              return { topic, courses };
            })
          );

          coursesData.forEach(({ topic, courses }) => {
            if (courses && courses.length > 0) {
              const routeIndex = updatedRoutes.findIndex(
                (r) => r.name.toLowerCase() === topic.semester.toLowerCase()
              );
              if (routeIndex !== -1) {
                const staticSubRoutes = updatedRoutes[routeIndex].routes || [];
                const dynamicSubRoutes = courses.map((c, idx) => ({
                  id: staticSubRoutes.length + idx + 1,
                  name: c.course,
                  href: `${updatedRoutes[routeIndex].mainroute}/${normalizeString(c.course)}`,
                  bgColor: "bg-surface-container-lowest",
                  image: "",
                }));

                const allSubRoutes = [...staticSubRoutes];
                dynamicSubRoutes.forEach((dynRoute) => {
                  if (!allSubRoutes.some((sr) => sr.name.toLowerCase() === dynRoute.name.toLowerCase())) {
                    allSubRoutes.push(dynRoute);
                  }
                });

                updatedRoutes[routeIndex] = {
                  ...updatedRoutes[routeIndex],
                  routes: allSubRoutes,
                };
              }
            }
          });

          setRoutes(updatedRoutes);
        }
      } catch (error) {
        console.error("Error fetching dynamic courses:", error);
      }
    };
    fetchDynamicRoutes();
  }, []);

  return (
    <AppLayout title="Ingenieria en Sistemas">
      <main className="flex-1 px-4 md:px-8 py-8 md:py-12 max-w-screen-xl w-full mx-auto">
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 text-primary">
                Ingeniería
                <br />
                en Sistemas
              </h1>
              <p className="max-w-xl text-black font-body leading-relaxed text-lg">
                Bienvenido a tu viaje académico en Ingeniería en Sistemas. Aquí
                encontrarás recursos, guías y apoyo para cada semestre de la
                carrera Ingenieria en Sistemas. Explora los temas, accede a
                materiales de estudio y prepárate para cada fase de tu
                formación. ¡Vamos juntos hacia el éxito académico!
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-outline-variant/20">
          {routes.map((route, index) => {
            const bgColors = [
              "bg-surface-container-lowest",
              "bg-surface-container-low",
              "bg-surface-container-high",
              "bg-surface-container-highest",
            ];
            const bgColorClass = bgColors[index % bgColors.length];

            return (
              <Link
                className={`group ${bgColorClass} border-r border-black/5 hover:bg-black hover:text-white transition-colors duration-300 p-10 flex flex-col h-[500px] relative overflow-hidden`}
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
            );
          })}
        </section>
      </main>
    </AppLayout>
  );
}
