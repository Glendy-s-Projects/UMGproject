"use client";
import Cards from "@/components/Cards";
import TitleCourse from "@/components/TitleCourse";
import { SegundoSemestreCursos } from "@/utils/data/routes";
import React from "react";

const SegundoSemestre = () => {
  return (
    <section className="min-h-screen flex flex-col items-center gap-2 p-4 ">
      <TitleCourse course="Segundo Semestre" />

      <Cards optionCards={SegundoSemestreCursos} />
    </section>
  );
};

export default SegundoSemestre;
