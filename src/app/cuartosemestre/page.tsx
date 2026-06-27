import AppLayout from "@/components/AppLayout";
import Grids from "@/components/Grids";
import TitleCourse from "@/components/TitleCourse";
import { getTopics, getCourses } from "../../../lib/appwrite-server";
import { routetype } from "@/types/index";
import React from "react";

export const dynamic = "force-dynamic";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

export default async function CuartoSemestre() {
  const topics = await getTopics();

  let coursesList: routetype[] = [];
  let topicId = "4";

  if (topics) {
    const topic = topics.find((t) => normalizeString(t.semester) === normalizeString("Cuarto Semestre"));
    if (topic) {
      topicId = topic.$id;
      const rawCourses = await getCourses(topic.$id);
      
      if (rawCourses) {
        coursesList = rawCourses.map((c, idx) => ({
          id: idx + 1,
          name: c.course,
          href: `/cuartosemestre/${normalizeString(c.course)}`,
          bgColor: "bg-surface-container-lowest",
          image: "",
          mainroute: "/cuartosemestre"
        }));
      }
    }
  }

  const customTopics = topics ? topics.map((t) => ({
    $id: t.$id,
    semester: t.semester,
  })) : undefined;

  return (
    <AppLayout title="Cuarto Semestre" activeTopicId={topicId} customTopics={customTopics}>
      <section className="min-h-screen flex flex-col items-center gap-2 p-4">
        <div className="max-w-7xl mx-auto w-full">
          <TitleCourse course="Cuarto Semestre" />
          <Grids mainSemester={coursesList} />
        </div>
      </section>
    </AppLayout>
  );
}
