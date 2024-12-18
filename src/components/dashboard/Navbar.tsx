import { toggleOpen } from "@/reducer/slice/nav.slice";
import { RootState, useAppSelector } from "@/reducer/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const Navbar = ({ pageTitle }: any) => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleOpen());
  };

  return (
    <>
      <nav className="w-full flex items-center md:pl-[260px] justify-between  md:px-10 border-b px-5 py-3 bg-neutral-100">
        <i
          className="ri-menu-2-line text-2xl md:hidden flex"
          onClick={handleToggle}
        ></i>

        <p className="font-semibold">{pageTitle}</p>
        <div className=" flex items-center gap-4">
          {/* <div
            // onClick={toggleOpenTask}
            className={`bg-[${COLOURS.primary}] cursor-pointer font-medium flex items-center gap-[2px] text-sm px-5 py-2 rounded-lg text-neutral-100`}
          >
            <i className="ri-add-fill"></i>
            <p>Create Task</p>
          </div> */}

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 22H18V20C18 18.3431 16.6569 17 15 17H9C7.34315 17 6 18.3431 6 20V22H4V20C4 17.2386 6.23858 15 9 15H15C17.7614 15 20 17.2386 20 20V22ZM12 13C8.68629 13 6 10.3137 6 7C6 3.68629 8.68629 1 12 1C15.3137 1 18 3.68629 18 7C18 10.3137 15.3137 13 12 13ZM12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"></path>
              </svg>
            </div>
            <h6 className="font-semibold text-xs">
              {user?.firstname + " " + user?.lastname}
            </h6>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
