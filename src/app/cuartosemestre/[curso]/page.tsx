import AppLayout from "@/components/AppLayout";
import { getTopicByName, getCourses, getTopics } from "../../../../lib/appwrite";
import CourseContent from "@/app/primersemestre/[curso]/CourseContent";
import { Models } from "appwrite";

const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

interface PageProps {
  params: { curso: string };
}

interface Topic extends Models.Document {
  semester: string;
}

interface Course extends Models.Document {
  course: string;
}

export default async function DynamicCoursePage({ params }: PageProps) {
  const cursoSlug = params.curso;
  let courseName: string | null = null;
  let topicId: string | null = null;
  let allTopics: { $id: string; semester: string }[] = [];

  try {
    const topics = await getTopics();
    if (topics) {
      allTopics = (topics as unknown as Topic[]).map((t) => ({ $id: t.$id, semester: t.semester }));
    }

    const topic = await getTopicByName("Cuarto Semestre");
    if (topic) {
      topicId = topic.$id;
      const courses = await getCourses(topic.$id);
      if (courses) {
        const normalizedSlug = normalizeString(cursoSlug);
        const course = (courses as unknown as Course[]).find(
          (c) => normalizeString(c.course) === normalizedSlug
        );
        courseName = course ? course.course : null;
      }
    }
  } catch (error) {
    console.error("Error finding course:", error);
  }

  const customTopics = allTopics.length > 0 ? allTopics : undefined;

  if (!courseName) {
    return (
      <AppLayout title="Curso no encontrado" activeTopicId={topicId || "4"} customTopics={customTopics}>
        <div className="flex items-center justify-center min-h-screen">
          <p>Curso no encontrado</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={courseName} activeTopicId={topicId || "4"} customTopics={customTopics}>
      <CourseContent courseName={courseName} />
    </AppLayout>
  );
}
