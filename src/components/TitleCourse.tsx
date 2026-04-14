//import BotonBack from "@/utils/BotonBack";
import React from "react";

type TitleCourseProps = {
  course: string;
};

const TitleCourse = ({ course }: TitleCourseProps) => {
  return (
    <div className="flex flex-row w-full h-full ">
     {/* <BotonBack /> */}
      <h1 className="text-6xl lg:text-[5rem] font-black tracking-tighter leading-none text-black dark:text-white">
        {course}
      </h1>
    </div>
  );
};

export default TitleCourse;
