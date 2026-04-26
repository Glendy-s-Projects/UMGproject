"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Fisica1Slugs } from "@/utils/data/routes";
import React from "react";

const Fisica1 = () => {
  const { videos, files, loading } = useCourseData("Física I");
  return (
    <AppLayout title="Física 1" activeTopicId="3">
      <MainSemesterLayout
        title="Física 1"
        slugs={Fisica1Slugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Fisica1;
