"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { DerechoInformaticoSlugs } from "@/utils/data/routes";
import React from "react";

const DerechoInformatico = () => {
  const { videos, files, loading } = useCourseData("Derecho Informatico");
  return (
    <AppLayout title="Derecho Informatico" activeTopicId="6">
      <MainSemesterLayout
        title="Derecho Informatico"
        slugs={DerechoInformaticoSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default DerechoInformatico;
