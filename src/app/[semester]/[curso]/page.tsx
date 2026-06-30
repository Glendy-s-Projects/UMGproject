"use client";

import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTopics, getCourses } from "../../../../lib/appwrite";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

const DynamicCourse = () => {
  const params = useParams();
  const semesterSlug = decodeURIComponent(params.semester as string);
  const cursoSlug = decodeURIComponent(params.curso as string);

  //TODO: REMOVER ANYS
  
  const [courseName, setCourseName] = useState<string | null>(null);
  const [semesterName, setSemesterName] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);
  const [loadingCourseName, setLoadingCourseName] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const topics = await getTopics();
        if (!topics) {
          setCourseName(null);
          setLoadingCourseName(false);
          return;
        }

        const normalizedSemester = normalizeString(semesterSlug);
        const topic = topics.find((t) => normalizeString(t.semester) === normalizedSemester);
        
        if (!topic) {
          setCourseName(null);
          setLoadingCourseName(false);
          return;
        }

        setSemesterName(topic.semester);
        setTopicId(topic.$id);

        const courses = await getCourses(topic.$id);
        if (courses) {
          const normalizedCourseSlug = normalizeString(cursoSlug);
          const course = courses.find(
            (c) => normalizeString(c.course) === normalizedCourseSlug,
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
  }, [semesterSlug, cursoSlug]);

  const { videos, files, loading } = useCourseData(courseName || "");

  if (loadingCourseName) {
    return (
      <AppLayout title="Cargando...">
        <div className="flex items-center justify-center min-h-screen">
          <p>Cargando curso...</p>
        </div>
      </AppLayout>
    );
  }

  if (!courseName) {
    return (
      <AppLayout title="Curso no encontrado" activeTopicId={topicId}>
        <div className="flex items-center justify-center min-h-screen">
          <p>Curso no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={courseName} activeTopicId={topicId}>
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
