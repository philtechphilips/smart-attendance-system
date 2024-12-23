"use client";
import React, { useState } from "react";
import CourseList from "./Courses";

const Academics = () => {
  const currTab = localStorage.getItem("currEventTab");
  const [activeEvent, setActiveEvent] = useState(currTab ? +currTab : 0);
  const handleActiveEvent = (index: number) => {
    localStorage.setItem("currEventTab", String(index));
    setActiveEvent(index);
  };

  return (
    <>
      <div className="flex border-b-2 border-[#E6E6E6] bg-[#FFFFFF] px-10">
        <div className="flex gap-12">
          <span
            className={`${
              activeEvent === 0 &&
              "border-b-4 px-4 border-[#4253F0] rounded-b-sm font_gilroy_semi-bold text-base leading-6"
            } py-4 cursor-pointer`}
            onClick={() => handleActiveEvent(0)}
          >
            Courses
          </span>
          {/* <span
            className={`${
              activeEvent === 1 &&
              "border-b-4 px-4 border-[#4253F0] rounded-b-sm font_gilroy_semi-bold text-base leading-6"
            } py-4 cursor-pointer `}
            onClick={() => handleActiveEvent(1)}
          >
            Department Staffs
          </span> */}
        </div>
      </div>

      <div className="event__list__container">
        {activeEvent === 0 && <CourseList />}
      </div>
    </>
  );
};

export default Academics;
