"use client";
import Cards from "@/components/Cards";
import { SemesterRoutes } from "@/utils/data/routes";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center gap-2 p-4">
      <h1 className="text-center w-full text-2xl font-extrabold max-sm:text-xl">
        {" "}
        Ingeniería en Sistemas
      </h1>

      <Cards optionCards={SemesterRoutes} />
    </section>
  );
}
