"use client";
import TitleCourse from "@/components/TitleCourse";
import { SegundoSemestreCursos } from "@/utils/data/routes";
import AppLayout from "@/components/AppLayout";
import Grids from "@/components/Grids";

const SegundoSemestre = () => {
  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <section className="min-h-screen flex flex-col items-center gap-2 p-4">
        <div className="max-w-7xl mx-auto">
          <TitleCourse course="Segundo Semestre" />
          <Grids mainSemester={SegundoSemestreCursos} />
        </div>
      </section>
    </AppLayout>
  );
};

export default SegundoSemestre;
