"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { AlgoritmoSlugs } from "@/utils/data/routes";

const Algoritmos = () => {
  const { videos, files, loading } = useCourseData("Algoritmos");
  return (
    <AppLayout title="Algoritmos" activeTopicId="3">
      <MainSemesterLayout
        title="Algoritmos"
        slugs={AlgoritmoSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Algoritmos;
