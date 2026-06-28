import AppLayout from "../../../components/AppLayout";
import { getTopicByName, getCourses } from "../../../../lib/appwrite";
import CourseContent from "./CourseContent";


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

export default async function DynamicCoursePage({ params }: PageProps) {
  const cursoSlug = params.curso;
  let courseName: string | null = null;

  try {
    const topic = await getTopicByName("Primer Semestre");
    if (topic) {
      const courses = await getCourses(topic.$id);
      if (courses) {
        const normalizedSlug = normalizeString(cursoSlug);
        const course = courses.find(
          (c) => normalizeString(c.course) === normalizedSlug
        );
        courseName = course ? course.course : null;
      }
    }
  } catch (error) {
    console.error("Error finding course:", error);
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
      <CourseContent courseName={courseName} />
    </AppLayout>
  );
}
