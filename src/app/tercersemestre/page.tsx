"use client";
import Cards from "@/components/Cards";
import TitleCourse from "@/components/TitleCourse";
import { TercerSemestreCursos } from "@/utils/data/routes";
import React from "react";

const TercerSemestre = () => {
  return (
    <section className="min-h-screen flex flex-col items-center p-4">
      <TitleCourse course="Tercer Semestre" />

      <Cards optionCards={TercerSemestreCursos} />
    </section>
  );
};

export default TercerSemestre;
