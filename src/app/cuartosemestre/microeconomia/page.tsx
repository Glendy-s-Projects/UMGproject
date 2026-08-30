"use client";
import AppLayout from "@/components/AppLayout";
import MainSemesterLayout from "@/components/MainSemesterLayout";
import useCourseData from "@/hooks/useCourseData";
import { MicroeconomiaSlugs } from "@/utils/data/routes";
import React from "react";

const Microeconomia = () => {
  const { videos, files, loading } = useCourseData("Microeconomia");
  return (
    <AppLayout title="Microeconomia" activeTopicId="4">
      <MainSemesterLayout
        title="Microeconomia"
        slugs={MicroeconomiaSlugs}
        videos={videos}
        files={files}
        loading={loading}
      />
    </AppLayout>
  );
};

export default Microeconomia;
