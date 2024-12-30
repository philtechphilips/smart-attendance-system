import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useAppDispatch } from "@/reducer/store";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import { getDepartmentAttendances } from "@/services/Attendance";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
];

const AttendanceList = () => {
  const dispatch = useAppDispatch();
  const [allAttendances, setAllAttendances] = useState<any>({});
  const [attendances, setAttendance] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showStatus, setShowStatus] = useState(false);

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    filterAttendanceByStatus(value);
  };

  const filterAttendanceByStatus = (status: string) => {
    if (status !== "all") {
      setAttendance([]);
      setPaginationValue(1);
    }
  };

  const handleShowStatudFilter = () => {
    setShowStatus(!showStatus);
  };

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
      status: selectedStatus,
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
  }, [dispatch, paginationValue, selectedStatus]);

  return (
    <>
      <div className="relative event__list__container">
        <div className="flex justify-between items-center p-4">
          <div className="font-semibold text-sm leading-10">
            Attendance list ({allAttendances?.pagination?.total || 0})
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  id="status-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={handleShowStatudFilter}
                >
                  Status:{" "}
                  {
                    statusOptions.find((opt) => opt.value === selectedStatus)
                      ?.label
                  }
                  <i className="ri-arrow-drop-down-line" aria-hidden="true"></i>
                </button>
              </div>
              {showStatus && (
                <div
                  className="absolute right-4 w-48 mt-2 top-12 z-[10000] bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="status-menu"
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                        selectedStatus === option.value
                          ? "bg-gray-200 font-semibold"
                          : ""
                      }`}
                      onClick={() => handleStatusChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <main>
          <div
            className="w-full h-[20rem] overflow-scroll text-sm leading-4 pb-[4rem]"
            onScroll={handleScroll}
          >
            {attendances?.length > 0 && (
              <table className="w-full text-xs bg-white border-collapse px-5">
                <thead className="sticky top-0 bg-white z-[2]">
                  <tr className="text-left">
                    <th className="text-center py-3 leading-6 text-[#4D4D4D]">
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
      </div>
    </>
  );
};

export default AttendanceList;
