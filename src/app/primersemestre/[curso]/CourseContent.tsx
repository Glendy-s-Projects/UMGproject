"use client";

import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";

interface CourseContentProps {
  courseName: string;
}

export default function CourseContent({ courseName }: CourseContentProps) {
  const { videos, files, loading } = useCourseData(courseName);

  return (
    <MainSemesterLayout
      title={courseName}
      slugs={[]}
      videos={videos}
      files={files}
      loading={loading}
    />
  );
}
