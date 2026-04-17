"use client";

import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { AlgebraLinealSlugs } from "@/utils/data/routes";

const Algebralineal = () => {
  const { videos, files, loading } = useCourseData("Algebra Lineal");

  return (
    <AppLayout title="Álgebra Lineal" activeTopicId="5">
      <MainSemesterLayout
        title="Álgebra Lineal"
        slugs={AlgebraLinealSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Algebralineal;
