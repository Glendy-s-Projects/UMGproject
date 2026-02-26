"use client";
import TitleCourse from "@/components/TitleCourse";
import { TercerSemestreCursos } from "@/utils/data/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TercerSemestre = () => {
  return (
    <section className="min-h-screen flex flex-col items-center p-4">
      <TitleCourse course="Tercer Semestre" />

      <div className="flex flex-row h-full max-sm:flex-col items-center justify-center gap-2   ">
        {TercerSemestreCursos.map((curso) => (
          <Link
            key={curso.id}
            href={curso.href}
            className="w-auto max-sm:w-full h-auto text-center"
          >
            <Image
              src={curso.image}
              alt={curso.name}
              width={200}
              height={100}
              className="rounded-t-lg shadow-md transition-transform transform h-44 w-96 object-cover"
            />
            <div className={`flex flex-col ${curso.bgColor} p-2 rounded-b-lg`}>
              <h1 className="font-extrabold text-2xl">{curso.name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TercerSemestre;
