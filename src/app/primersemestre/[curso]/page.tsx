"use client";

import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTopicByName, getCourses } from "../../../../lib/appwrite";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

const DynamicCourse = () => {
  const params = useParams();
  const cursoSlug = params.curso as string;
  const [courseName, setCourseName] = useState<string | null>(null);
  const [loadingCourseName, setLoadingCourseName] = useState(true);

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const topic = await getTopicByName("Primer Semestre");
        if (!topic) {
          setCourseName(null);
          setLoadingCourseName(false);
          return;
        }

        const courses = await getCourses(topic.$id);
        if (courses) {
          const normalizedSlug = normalizeString(cursoSlug);
          const course = courses.find(
            (c) => normalizeString(c.course) === normalizedSlug,
          );
          setCourseName(course ? course.course : null);
        }
      } catch (error) {
        console.error("Error finding course:", error);
        setCourseName(null);
      } finally {
        setLoadingCourseName(false);
      }
    };
    fetchCourseName();
  }, [cursoSlug]);

  const { videos, files, loading } = useCourseData(courseName || "");

  if (loadingCourseName) {
    return (
      <AppLayout title="Cargando..." activeTopicId="1">
        <div className="flex items-center justify-center min-h-screen">
          <p>Cargando curso...</p>
        </div>
      </AppLayout>
    );
  }

  if (!courseName) {
    return (
      <AppLayout title="Curso no encontrado" activeTopicId="1">
        <div className="flex items-center justify-center min-h-screen">
          <p>Curso no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={courseName} activeTopicId="1">
      <MainSemesterLayout
        title={courseName}
        slugs={[]}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default DynamicCourse;
