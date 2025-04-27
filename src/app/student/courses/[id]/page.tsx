"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import classNames from "classnames";
import DashboardLayout from "@/layouts/dasboard";
import { useAppDispatch } from "@/reducer/store";
import EmptyTable from "@/components/emptytable";
import {
  downloadCourseAttendance,
  getCourseAttendance,
  getLecturerCourses,
  getStudentCourseAttendance,
} from "@/services/courses.service";
import Link from "next/link";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS file

export default function CourseList() {
  return (
    <DashboardLayout pageTitle="Courses">
      <CoursesAttendance />
    </DashboardLayout>
  );
}

const CoursesAttendance = () => {
  const dispatch = useAppDispatch();
  const [allcourses, setAllcourses] = useState<any>({});
  const [courses, setCourses] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (
      !isLoading &&
      bottom &&
      paginationValue < Math.ceil(allcourses?.pagination?.total / 10)
    ) {
      setPaginationValue((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  const fetchCourses = async () => {
    const res = await getStudentCourseAttendance(courseId, "", "", "", false);
    console.log("res", res);
    setCourses((prevcourses: any) => {
      const existingIds = new Set(prevcourses.map((course: any) => course.id));
      const newcourses = res.attendance.filter(
        (item: any) => !existingIds.has(item.id)
      );
      return [...prevcourses, ...newcourses];
    });
    setAllcourses(res.attendance);
  };

  useEffect(() => {
    fetchCourses();
    setIsLoading(false);
  }, [dispatch, paginationValue]);

  const applyDateFilter = async () => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) return;
    console.log("startDate", startDate, endDate);
    setIsLoading(true);
    const res = await getCourseAttendance(
      courseId,
      startDate.toISOString(),
      endDate.toISOString(),
      "",
      false
    );
    setCourses(res?.attendance);
    setAllcourses(res);
    setIsLoading(false);
    setIsCalendarOpen(false); // Close the calendar after applying the filter
  };

  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <div className="flex justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Course attendance ({courses?.length || 0})
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search attendance..."
              className="border border-[#E6E6E6] rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={async (e) => {
                const query = e.target.value;
                if (query.trim() === "") {
                  setPaginationValue(1);
                  fetchCourses();
                  return;
                }
                setIsLoading(true);
                const res = await getCourseAttendance(
                  courseId,
                  "",
                  "",
                  query,
                  false
                );
                setCourses(res?.attendance);
                setAllcourses(res);
                setIsLoading(false);
              }}
            />
            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          </div>
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Date Filter
          </button>

          <button
            onClick={async () => {
              setIsLoading(true);
              const res = await downloadCourseAttendance(courseId);

              // Create a Blob from the response
              const blob = new Blob([res], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });

              // Create a URL for the Blob
              const url = window.URL.createObjectURL(blob);

              // Create an <a> element and click it to download
              const a = document.createElement("a");
              a.href = url;
              a.download = "attendance.xlsx"; // you can customize the filename
              document.body.appendChild(a);
              a.click();

              // Clean up
              a.remove();
              window.URL.revokeObjectURL(url);

              setIsLoading(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Download
          </button>
        </div>
      </div>
      <main>
        <div
          className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]"
          onScroll={handleScroll}
        >
          {courses?.length > 0 && (
            <table className="w-full text-sm leading-6 bg-white border-collapse table-fixed">
              <thead className="sticky top-0 bg-white z-[2]">
                <tr className="text-left">
                  <th className="pr-4 text-center py-3 leading-6 text-[#4D4D4D]">
                    S/N
                  </th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Matric No</th>
                  <th className="py-3">Department</th>
                  <th className="py-3">Class</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Semester</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((course: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                  >
                    <td className="py-3 text-center relative">
                      <p>{index + 1}</p>
                    </td>
                    <td className="py-3 ">
                      {course?.student?.firstname +
                        " " +
                        course?.student?.lastname}
                    </td>
                    <td className="py-3 ">{course?.student?.matricNo}</td>
                    <td className="py-3">
                      {course?.student?.department?.name}
                    </td>
                    <td className="py-3">{course?.student?.level?.name}</td>
                    <td className="py-3">
                      {new Date(course?.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3 ">{course?.semester?.name}</td>
                    <td className={`py-3 text-center rounded}`}>
                      <div
                        className={`${
                          course?.status === "present"
                            ? "bg-green-200 text-green-800 !w-fit px-6 py-1 rounded-xl"
                            : "bg-red-200 text-red-800 !w-fit px-6 py-1 rounded-xl"
                        }`}
                      >
                        {course?.status?.charAt(0)?.toUpperCase() +
                          course?.status.slice(1)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allcourses?.items?.length <= 0 && <EmptyTable title="No students" />}

          {isLoading && (
            <div
              className={classNames(
                "flex flex-col items-center justify-center w-full",
                {
                  "h-full": allcourses?.items?.length <= 0,
                }
              )}
            >
              <LoaderIcon />
            </div>
          )}
        </div>
      </main>

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 relative">
            <button
              onClick={() => setIsCalendarOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <DateRange
              ranges={[dateRange]}
              onChange={(ranges: any) => {
                setDateRange(ranges.selection);
              }}
              moveRangeOnFirstSelection={false}
              rangeColors={["#3b82f6"]}
              className="rounded-md"
            />
            <button
              onClick={applyDateFilter}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

