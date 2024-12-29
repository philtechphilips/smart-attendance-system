"use client";
import React, { useState } from "react";
import AttendanceList from "./AttendanceList";

const Attendances = () => {
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
            Attendance
          </span>
          <span
            className={`${
              activeEvent === 1 &&
              "border-b-4 px-4 border-[#4253F0] rounded-b-sm font_gilroy_semi-bold text-base leading-6"
            } py-4 cursor-pointer `}
            onClick={() => handleActiveEvent(1)}
          >
            Dumped Attendance
          </span>
        </div>
      </div>

      <div className="event__list__container">
        <AttendanceList />
      </div>
    </>
  );
};

export default Attendances;
