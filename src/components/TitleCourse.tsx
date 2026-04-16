//import BotonBack from "@/utils/BotonBack";
import React from "react";

type TitleCourseProps = {
  course: string;
};

const TitleCourse = ({ course }: TitleCourseProps) => {
  return (
    <header className="mb-4">
      <div className="max-w-2xl">
        <div className="flex flex-row w-full h-full ">
          {/* <BotonBack /> */}
          <h1 className="text-4xl lg:text-[4rem] font-black tracking-tighter leading-none text-black dark:text-white">
            {course}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default TitleCourse;
