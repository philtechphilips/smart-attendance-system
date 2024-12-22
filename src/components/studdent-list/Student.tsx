import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { getStudentsByDepartment } from "@/reducer/actions/students.dispatcher";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";

const Students = () => {
  const dispatch = useAppDispatch();

  const { allStudents } = useAppSelector((state: RootState) => state.students);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (
      !isLoading &&
      bottom &&
      paginationValue < Math.ceil(allStudents?.pagination?.total / 10)
    ) {
      setPaginationValue((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    dispatch(
      getStudentsByDepartment({
        currentPage: paginationValue,
        pageSize: 10,
      }),
    );
    setIsLoading(false);
  }, [dispatch, paginationValue]);
  return (
    <>
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Students list ({allStudents?.pagination?.total || 0})
        </div>
      </div>
      <main>
        <div
          className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]"
          onScroll={handleScroll}
        >
          {allStudents?.items?.length > 0 && (
            <table className="w-full text-sm leading-6 bg-white border-collapse table-fixed">
              <thead className="sticky top-0 bg-white z-[2]">
                <tr className="text-left">
                  <th className="pr-4 text-center py-3 leading-6 text-[#4D4D4D]">
                    S/N
                  </th>
                  <th className="py-3 ">Name</th>
                  <th>
                    <div className="flex items-center gap-2">
                      <span className="">Matric N0.</span>
                    </div>
                  </th>
                  <th className="py-3 ">School</th>
                  <th className="py-3 ">Department</th>
                  <th className="py-3 ">Level</th>
                  <th className="py-3 ">Program</th>
                </tr>
              </thead>
              <tbody>
                {allStudents?.items?.map((student: any, index: number) => (
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
                    <td className="py-3 ">{student?.matricNo}</td>
                    <td className="py-3 ">{student?.school?.name}</td>
                    <td className="py-3 p-4">{student?.department?.name}</td>
                    <td className={`py-3`}>{student?.level?.name}</td>
                    <td className="py-3 ">{student?.program?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allStudents?.items?.length <= 0 && <EmptyTable title="No studets" />}

          {isLoading && (
            <div
              className={classNames(
                "flex flex-col items-center justify-center w-full",
                {
                  "h-full": allStudents?.items?.length <= 0,
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

export default Students;
