"use client";
import Cards from "@/components/Cards";
import TitleCourse from "@/components/TitleCourse";
import { SemesterRoutes } from "@/utils/data/routes";

export default function Home() {
  // Estados para manejar los datos, la carga y los posibles errores

  return (
    <section className="min-h-screen flex flex-col items-center gap-2 p-4">
      <TitleCourse course=" Ingeniería en Sistemas" />

      <Cards optionCards={SemesterRoutes} />
    </section>
  );
}
