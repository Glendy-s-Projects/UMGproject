"use client";
import { PrecalculoSlugs } from "@/utils/data/routes";
import AppLayout from "@/components/AppLayout";
import useCourseData from "@/hooks/useCourseData";
import MainSemesterLayout from "@/components/MainSemesterLayout";

const Precalculo = () => {
  const { videos, files, loading } = useCourseData("Precalculo");

  return (
    <AppLayout title="Segundo Semestre" activeTopicId="2">
      <MainSemesterLayout
        title="Precálculo"
        slugs={PrecalculoSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Precalculo;
