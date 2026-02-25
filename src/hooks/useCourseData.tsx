"use client";

import { useEffect, useState } from "react";
import { getCourseByName } from "../../lib/appwrite";
import { FileData, Video } from "../../type";

const useCourseData = (courseName: string) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseByName(courseName);

        if (courseData) {
          setVideos((courseData.videos || []) as unknown as Video[]);
          setFiles((courseData.files || []) as unknown as FileData[]);
        } else {
          setError(`No se encontró el curso: ${courseName}`);
        }
      } catch (err) {
        setError("Error al cargar los datos del curso");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseName) {
      fetchCourseData();
    }
  }, [courseName]);

  return { videos, files, loading, error };
};

export default useCourseData;
