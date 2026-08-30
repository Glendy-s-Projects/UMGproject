"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Estadistica1Slugs } from "@/utils/data/routes";
import React from "react";

const Estadistica1 = () => {
  const { videos, files, loading } = useCourseData("Estadistica I");
  return (
    <AppLayout title="Estadistica 1" activeTopicId="4">
      <MainSemesterLayout
        title="Estadistica 1"
        slugs={Estadistica1Slugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Estadistica1;
