import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { getStudentsByDepartment } from "@/reducer/actions/students.dispatcher";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import SolidDivider from "../icons/SolidDivider";
import { getStaffsByDepartment } from "@/reducer/actions/lecturer.dispatcher";

const LecturerList = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { allStaffs } = useAppSelector((state: RootState) => state.staffs);
  console.log(allStaffs, "staffs");

  useEffect(() => {
    dispatch(getStaffsByDepartment());
  }, []);
  return (
    <>
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Staff list ({allStaffs?.pagination?.total || 0})
        </div>
      </div>
      <main>
        <div
          className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]"
          // onScroll={handleScroll}
        >
          {allStaffs?.items?.length > 0 && (
            <table className="w-full text-sm leading-6 bg-white border-collapse table-fixed">
              <thead className="sticky top-0 bg-white z-[2]">
                <tr className="text-left">
                  <th className="pr-4 text-center py-3 leading-6 text-[#4D4D4D]">
                    S/N
                  </th>
                  <th className="py-3 ">Name</th>
                  <th>
                    <div className="flex items-center gap-2">
                      <span className="">Email Drress.</span>
                    </div>
                  </th>
                  <th className="py-3 ">Phone</th>
                  <th className="py-3 ">Level</th>
                  <th className="py-3 ">Department</th>
                </tr>
              </thead>
              <tbody>
                {allStaffs?.items?.map((student: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                  >
                    <td className="py-3 text-center relative">
                      <p>{index + 1}</p>
                    </td>
                    <td className="py-3 ">
                      {student?.lastname +
                        " " +
                        student?.firstname +
                        " " +
                        student?.middlename}
                    </td>
                    <td className="py-3">{student?.email}</td>
                    <td className="py-3">{student?.phone}</td>
                    <td className="py-3">{student?.level}</td>
                    <td className="py-3">{student?.department?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allStaffs?.items?.length <= 0 && <EmptyTable title="No studets" />}

          {isLoading && (
            <div
              className={classNames(
                "flex flex-col items-center justify-center w-full",
                {
                  "h-full": allStaffs?.items?.length <= 0,
                },
              )}
            >
              <LoaderIcon />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default LecturerList;