"use client";
import TitleCourse from "@/components/TitleCourse";
import AppLayout from "@/components/AppLayout";
import Grids from "@/components/Grids";
import { PrimerSemestreCursos } from "@/utils/data/routes";

const PrimerSemestre = () => {
  return (
    <AppLayout title="Primer Semestre" activeTopicId="1">
      <section className="min-h-screen flex flex-col items-center gap-2 p-4">
        <div className="max-w-7xl mx-auto">
          <TitleCourse course="Primer Semestre" />
          <Grids mainSemester={PrimerSemestreCursos} />
        </div>
      </section>
    </AppLayout>
  );
};

export default PrimerSemestre;
