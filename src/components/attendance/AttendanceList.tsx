"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useAppDispatch } from "@/reducer/store";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import { getDepartmentAttendances, markAttendanceManually } from "@/services/Attendance";
import { levelOptions, statusOptions, periodOptions } from "@/util/constant";
import { useRouter } from "next/navigation";
import { getLecturerStudents } from "@/services/Students.service";
import { getLecturerCourses } from "@/services/courses.service";

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
  const [showManualModal, setShowManualModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [manualStatus, setManualStatus] = useState("present");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Fetch students and courses for the modal
  useEffect(() => {
    if (showManualModal) {
      const fetchData = async () => {
        try {
          const [studentsRes, coursesRes] = await Promise.all([
            getLecturerStudents(),
            getLecturerCourses({
              search: "",
            }),
          ]);
          setStudents(studentsRes.students);
          setCourses(coursesRes.course);
        } catch (error) {
          console.error("Failed to fetch data for manual attendance", error);
        }
      };
      fetchData();
    }
  }, [showManualModal]);

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

  // Function to handle manual attendance submission
  const handleManualAttendance = async () => {
    if (!selectedStudent || !selectedCourse) {
      alert("Please select both student and course");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call your API to mark attendance manually
      await markAttendanceManually({studentId: selectedStudent, courseId: selectedCourse, status: manualStatus});

      // Refresh the attendance list
      await fetchAttendance();
      setShowManualModal(false);
      // Reset form
      setSelectedStudent("");
      setSelectedCourse("");
      setManualStatus("present");
    } catch (error) {
      console.error("Failed to mark attendance manually", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Mark Attendance
          </button>
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

      {showManualModal && (
        <>
          <div className="w-full flex items-center justify-center">
            <div className="space-y-4 w-[600px] bg-white px-5 rounded-lg z-[10000] py-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student?.id} value={student?.id}>
                      {student?.lastname} {student?.firstname} (
                      {student?.matricNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course?.id} value={course?.id}>
                      {course?.code} - {course?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={manualStatus}
                  onChange={(e) => setManualStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualAttendance}
                  disabled={isSubmitting || !selectedStudent || !selectedCourse}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Marking..." : "Mark Attendance"}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-black opacity-50 w-screen h-screen fixed top-0 left-0 z-[1000]"></div>
        </>
      )}
    </div>
  );
};

export default AttendanceList;

