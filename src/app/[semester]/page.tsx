import AppLayout from "@/components/AppLayout";
import Grids from "@/components/Grids";
import TitleCourse from "@/components/TitleCourse";
import { getTopics, getCourses } from "../../../lib/appwrite-server";
import React from "react";
import { routetype } from "@/types/index";
import { SemesterRoutes } from "@/utils/data/routes";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

// Componente para manejar semestres dinámicos que no tienen carpeta física (ej. /quintosemestre)
export default async function DynamicSemesterPage({
  params,
}: {
  params: { semester: string };
}) {
  const decodedSemester = decodeURIComponent(params.semester);
  const topics = await getTopics();
  
  if (!topics) {
    notFound();
  }

  // Buscar el tema correspondiente en la base de datos
  const currentTopic = topics.find(
    (t) => normalizeString(t.semester) === normalizeString(decodedSemester)
  );

  if (!currentTopic) {
    // Si no está en DB, verificamos si de casualidad estaba en el estático y no tiene archivo
    const staticMatch = SemesterRoutes.find((r) => normalizeString(r.name) === normalizeString(decodedSemester));
    if(!staticMatch) {
      notFound();
    }
  }

  const topicName = currentTopic ? currentTopic.semester : decodedSemester;
  const topicId = currentTopic ? currentTopic.$id : null;

  let coursesList: routetype[] = [];

  if (topicId) {
    const rawCourses = await getCourses(topicId);
    if (rawCourses) {
      coursesList = rawCourses.map((c, idx) => ({
        id: idx + 1,
        name: c.course,
        href: `/${normalizeString(topicName)}/${normalizeString(c.course)}`,
        bgColor: "bg-surface-container-lowest",
        image: "",
        mainroute: `/${normalizeString(topicName)}`
      }));
    }
  }

  return (
    <AppLayout title={topicName} activeTopicId={topicId}>
      <section className="min-h-screen flex flex-col items-center gap-2 p-4">
        <div className="max-w-7xl mx-auto w-full">
          <TitleCourse course={topicName} />
          {/* Grids se encarga de mostrar el skeleton "Aún no se han agregado cursos..." si la lista está vacía */}
          <Grids mainSemester={coursesList} />
        </div>
      </section>
    </AppLayout>
  );
}
