"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { ContabilidadSlugs } from "@/utils/data/routes";

const Contabilidad = () => {
  const { videos, files, loading } = useCourseData("Contabilidad II");
  return (
    <AppLayout title="Contabilidad" activeTopicId="6">
      <MainSemesterLayout
        title="Contabilidad  II"
        slugs={ContabilidadSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Contabilidad;
