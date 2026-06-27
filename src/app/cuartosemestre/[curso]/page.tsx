"use client";

import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTopicByName, getCourses, getTopics } from "../../../../lib/appwrite";

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
  const [topicId, setTopicId] = useState<string | null>(null);
  const [loadingCourseName, setLoadingCourseName] = useState(true);
  const [allTopics, setAllTopics] = useState<{ $id: string; semester: string }[]>([]);

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const topics = await getTopics();
        if (topics) {
          const typedTopics = topics as unknown as Array<{ $id: string; semester: string }>;
          setAllTopics(typedTopics.map(t => ({ $id: t.$id, semester: t.semester })));
        }
        
        const topic = await getTopicByName("Cuarto Semestre");
        if (!topic) {
          setCourseName(null);
          setLoadingCourseName(false);
          return;
        }

        setTopicId(topic.$id);
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

  const customTopics = allTopics.length > 0 ? allTopics.map(t => ({
    $id: t.$id,
    semester: t.semester
  })) : undefined;

  if (loadingCourseName) {
    return (
      <AppLayout title="Cargando..." activeTopicId={topicId} customTopics={customTopics}>
        <div className="flex items-center justify-center min-h-screen">
          <p>Cargando curso...</p>
        </div>
      </AppLayout>
    );
  }

  if (!courseName) {
    return (
      <AppLayout title="Curso no encontrado" activeTopicId={topicId} customTopics={customTopics}>
        <div className="flex items-center justify-center min-h-screen">
          <p>Curso no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={courseName} activeTopicId={topicId} customTopics={customTopics}>
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
