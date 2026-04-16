"use client";
import TitleCourse from "@/components/TitleCourse";
import { TercerSemestreCursos } from "@/utils/data/routes";
import AppLayout from "@/components/AppLayout";
import Grids from "@/components/Grids";

const TercerSemestre = () => {
  return (
    <AppLayout title="Tercer Semestre" activeTopicId="3">
      <section className="min-h-screen flex flex-col items-center gap-2 p-4 ">
        <div className="max-w-7xl mx-auto">
          <TitleCourse course="Tercer Semestre" />
          <Grids mainSemester={TercerSemestreCursos} />
        </div>
      </section>
    </AppLayout>
  );
};

export default TercerSemestre;
