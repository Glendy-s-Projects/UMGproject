"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Calculo1Slugs } from "@/utils/data/routes";
import React from "react";

const Calculo1 = () => {
  const { videos, files, loading } = useCourseData("Cálculo 1");
  return (
    <AppLayout title="Cálculo 1" activeTopicId="3">
      <MainSemesterLayout
        title="Cálculo 1"
        slugs={Calculo1Slugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Calculo1;
