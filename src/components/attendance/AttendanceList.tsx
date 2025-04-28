"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useAppDispatch } from "@/reducer/store";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import { getDepartmentAttendances } from "@/services/Attendance";
import { levelOptions, statusOptions, periodOptions } from "@/util/constant";
import { useRouter } from "next/navigation";

const AttendanceList = () => {
  const dispatch = useAppDispatch();
  const [allAttendances, setAllAttendances] = useState<any>({});
  const [attendances, setAttendance] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [showStatus, setShowStatus] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);
  const router = useRouter();

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    filterAttendance();
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    filterAttendance();
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    filterAttendance();
  };

  const filterAttendance = () => {
    setAttendance([]);
    setPaginationValue(1);
  };

  const handleShowStatusFilter = () => {
    setShowStatus(!showStatus);
  };

  const handleShowLevelFilter = () => {
    setShowLevel(!showLevel);
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

  const attendanceDetails = (id: string) => {
    router.push(`/dashboard/attendance/${id}`);
  };

  const fetchAttendance = async () => {
    const res = await getDepartmentAttendances({
      currentPage: paginationValue,
      pageSize: 10,
      status: selectedStatus,
      level: selectedLevel !== "all" ? selectedLevel : undefined,
      period: selectedPeriod ? selectedPeriod : undefined,
    });
    setAttendance((prevAttendances: any) => {
      const existingIds = new Set(
        prevAttendances.map((attendance: any) => attendance.id)
      );
      const newAttendances = res.items.filter(
        (item: any) => !existingIds.has(item.id)
      );
      return [...prevAttendances, ...newAttendances];
    });
    setAllAttendances(res);
  };

  useEffect(() => {
    fetchAttendance();
    setIsLoading(false);
  }, [
    dispatch,
    paginationValue,
    selectedStatus,
    selectedLevel,
    selectedPeriod,
  ]);

  return (
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
                onClick={handleShowStatusFilter}
              >
                Status:{" "}
                {
                  statusOptions.find((opt) => opt.value === selectedStatus)
                    ?.label
                }
                <i className="ri-arrow-drop-down-line" aria-hidden="true"></i>
              </button>
              {showStatus && (
                <div className="absolute right-[600px] w-48 mt-2 top-12 z-[10000] bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
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

          <div className="text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                onClick={handleShowLevelFilter}
              >
                Level:{" "}
                {levelOptions.find((opt) => opt.value === selectedLevel)?.label}
                <i className="ri-arrow-drop-down-line" aria-hidden="true"></i>
              </button>
              {showLevel && (
                <div className="absolute right-92 w-48 mt-2 top-12 z-[10000] bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                  {levelOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                        selectedLevel === option.value
                          ? "bg-gray-200 font-semibold"
                          : ""
                      }`}
                      onClick={() => handleLevelChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="text-left">
            <div>
              <button
                type="button"
                className="inline-flex justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                onClick={() => setShowPeriod(!showPeriod)}
              >
                Period:{" "}
                {
                  periodOptions.find((opt) => opt.value === selectedPeriod)
                    ?.label
                }
                <i className="ri-arrow-drop-down-line" aria-hidden="true"></i>
              </button>
              {showPeriod && (
                <div className="absolute right-64 w-48 mt-2 top-12 z-[10000] bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                  {periodOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                        selectedPeriod === option.value
                          ? "bg-gray-200 font-semibold"
                          : ""
                      }`}
                      onClick={() => handlePeriodChange(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search attendance..."
              className="border border-[#E6E6E6] rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={async (e) => {
                const query = e.target.value;
                if (query.trim() === "") {
                  setPaginationValue(1);
                  fetchAttendance();
                  return;
                }
                setIsLoading(true);
                const res = await getDepartmentAttendances({
                  currentPage: paginationValue,
                  pageSize: 10,
                  status: selectedStatus,
                  level: selectedLevel !== "all" ? selectedLevel : undefined,
                  period: selectedPeriod ? selectedPeriod : undefined,
                  search: query,
                });
                setAttendance(res?.items);
                setAllAttendances(res?.items);
                setIsLoading(false);
              }}
            />
            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          </div>
        </div>
      </div>

      <div
        className="w-full h-[20rem] overflow-auto text-sm leading-4 pb-[4rem]"
        onScroll={handleScroll}
      >
        {attendances?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs bg-white border-collapse px-5">
              <thead className="sticky top-0 bg-white z-[2]">
                <tr className="text-left">
                  <th className="text-center py-3 leading-6 text-[#4D4D4D]">
                    S/N
                  </th>
                  <th className="py-3 hidden md:table-cell">Name</th>
                  <th className="py-3 hidden lg:table-cell">Matric N0.</th>
                  <th className="py-3 hidden lg:table-cell">Source</th>
                  <th className="py-3 hidden xl:table-cell">Course Code</th>
                  <th className="py-3 hidden xl:table-cell">Course Name</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Time</th>
                  <th className="py-3 hidden md:table-cell">Level</th>
                  <th className="py-3 hidden lg:table-cell">Lecturer</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendances?.map((item: any, index: number) => (
                  <tr
                    key={index}
                    onClick={() => attendanceDetails(item?.id)}
                    className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                  >
                    <td className="py-3 text-center">{index + 1}</td>
                    <td className="py-3 hidden md:table-cell">
                      {item?.student?.lastname +
                        " " +
                        item?.student?.firstname +
                        " " +
                        item?.student?.middlename}
                    </td>
                    <td className="py-3 hidden lg:table-cell">
                      {item?.student?.matricNo}
                    </td>
                    <td className="py-3 hidden lg:table-cell">
                      Face Recognition
                    </td>
                    <td className="py-3 hidden xl:table-cell">
                      {item?.course?.code}
                    </td>
                    <td className="py-3 hidden xl:table-cell">
                      {item?.course?.name}
                    </td>
                    <td className="py-3">
                      {new Date(item?.timestamp).toISOString().split("T")[0]}
                    </td>
                    <td className="py-3">
                      {new Date(item?.timestamp).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                      })}
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      {item?.student?.level?.name}
                    </td>
                    <td className="py-3 hidden lg:table-cell">
                      {item?.course?.lecturer?.lastname +
                        " " +
                        item?.course?.lecturer?.firstname}
                    </td>
                    <td className="py-3">
                      {item?.status === "present" ? (
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
          </div>
        )}
        {allAttendances?.items?.length <= 0 && (
          <EmptyTable title="No Attendance Record" />
        )}

        {isLoading && (
          <div
            className={classNames(
              "flex flex-col items-center justify-center w-full",
              {
                "h-full": allAttendances?.items?.length <= 0,
              }
            )}
          >
            <LoaderIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;

