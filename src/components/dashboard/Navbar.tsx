import { COLOURS } from "@/constants/colors";
import React, { useState } from "react";

const Navbar = ({ pageTitle }: any) => {
  // const { open, toggleOpen } = navStore();
  // const { user } = useUserStore();
  // const { openTask, toggleOpenTask } = taskStore();

  return (
    <>
      <nav className="w-full flex items-center md:pl-[260px] justify-between  md:px-10 border-b px-5 py-3 bg-neutral-100">
        <i
          className="ri-menu-2-line text-2xl md:hidden flex"
          // onClick={toggleOpen}
        ></i>

        <p className="font-semibold">{pageTitle}</p>
        <div className=" flex items-center gap-4">
          <div
            // onClick={toggleOpenTask}
            className={`bg-[${COLOURS.primary}] cursor-pointer font-medium flex items-center gap-[2px] text-sm px-5 py-2 rounded-lg text-neutral-100`}
          >
            <i className="ri-add-fill"></i>
            <p>Create Task</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <h1 className="text-xs font-semibold">Isola Pelumi</h1>
            </div>
            <h6 className="font-semibold text-xs">Isola Pelumi</h6>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
