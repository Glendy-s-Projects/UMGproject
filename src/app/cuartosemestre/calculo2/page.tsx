"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Calculo2Slugs } from "@/utils/data/routes";
import React from "react";

const Calculo2 = () => {
  const { videos, files, loading } = useCourseData("Calculo 2");
  return (
    <AppLayout title="Calculo 2" activeTopicId="4">
      <MainSemesterLayout
        title="Calculo 2"
        slugs={Calculo2Slugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Calculo2;
