import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useAppDispatch } from "@/reducer/store";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import { getDepartmentAttendances } from "@/services/Attendance";

const AttendanceList = () => {
  const dispatch = useAppDispatch();
  const [allAttendances, setAllAttendances] = useState<any>({});
  const [attendances, setAttendance] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (
      !isLoading &&
      bottom &&
      paginationValue < Math.ceil(allAttendances?.pagination?.total / 10)
    ) {
      setPaginationValue((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  const fetchAttendance = async () => {
    const res = await getDepartmentAttendances({
      currentPage: paginationValue,
      pageSize: 10,
    });
    setAttendance((prevAttendances: any) => {
      const existingIds = new Set(
        prevAttendances.map((attendance: any) => attendance.id),
      );
      const newAttendances = res.items.filter(
        (item: any) => !existingIds.has(item.id),
      );
      return [...prevAttendances, ...newAttendances];
    });
    setAllAttendances(res);
  };

  useEffect(() => {
    fetchAttendance();
    setIsLoading(false);
  }, [dispatch, paginationValue]);
  return (
    <>
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Attendance list ({allAttendances?.pagination?.total || 0})
        </div>
      </div>
      <main>
        <div
          className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]"
          onScroll={handleScroll}
        >
          {attendances?.length > 0 && (
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
                  <th className="py-3 ">Source</th>
                  <th className="py-3 ">Course Code</th>
                  <th className="py-3 ">Course Name</th>
                  <th className="py-3 ">Level</th>
                  <th className="py-3 ">Lecturer</th>
                  <th className="py-3 ">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendances?.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                  >
                    <td className="py-3 text-center relative">
                      <p>{index + 1}</p>
                    </td>
                    <td className="py-3 ">
                      {item?.student?.lastname +
                        " " +
                        item?.student?.firstname +
                        " " +
                        item?.student?.middlename}
                    </td>
                    <td className="py-3 ">{item?.student?.matricNo}</td>
                    <td className="py-3 ">Face Recognition</td>
                    <td className="py-3">{item?.course?.code}</td>
                    <td className="py-3">{item?.course?.name}</td>
                    <td className={`py-3`}>{item?.student?.level?.name}</td>
                    <td className="py-3">
                      {item?.course?.lecturer?.lastname +
                        " " +
                        item?.course?.lecturer?.firstname}
                    </td>
                    <td className="py-3 ">
                      {item?.status == "present" ? (
                        <div className="px-4 text-white capitalize w-fit bg-green-600 rounded-md py-1">
                          <p>{item?.status}</p>
                        </div>
                      ) : (
                        <div className="px-4 text-white capitalize w-fit bg-red-600 rounded-md py-1">
                          <p>{item?.status}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allAttendances?.items?.length <= 0 && (
            <EmptyTable title="No studets" />
          )}

          {isLoading && (
            <div
              className={classNames(
                "flex flex-col items-center justify-center w-full",
                {
                  "h-full": allAttendances?.items?.length <= 0,
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

export default AttendanceList;
