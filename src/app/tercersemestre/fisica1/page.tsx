"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { Fisica1Slugs } from "@/utils/data/routes";
import React from "react";

const Fisica1 = () => {
  const { videos, files, loading } = useCourseData("Fisica 1");
  return (
    <AppLayout title="Física 1" activeTopicId="2">
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
