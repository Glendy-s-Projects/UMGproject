"use client";

import { useEffect, useState } from "react";
import { getTopicByName, getCourses } from "../../lib/appwrite";
import { routetype } from "../types";

const useCoursesFromDB = (semesterName: string, semesterPath: string) => {
  const [courses, setCourses] = useState<routetype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener el topic por nombre
        const topic = await getTopicByName(semesterName);
        if (!topic) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // 2. Obtener los cursos del topic
        const dbCourses = await getCourses(topic.$id);

        if (dbCourses && dbCourses.length > 0) {
          const formattedCourses = dbCourses.map((dbCourse, index) => {
            // Generar slug del nombre del curso
            const slug = dbCourse.course
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") // Remover acentos
              .replace(/\s+/g, ""); // Remover espacios

            return {
              id: index + 1,
              name: dbCourse.course,
              href: `${semesterPath}/${slug}`,
              bgColor: dbCourse.bgColor || "bg-gray-300",
              image: "/default-course.webp",
              subroutes: [],
            };
          });

          setCourses(formattedCourses);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses from DB:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [semesterName, semesterPath]);

  return { courses, loading };
};

export default useCoursesFromDB;
