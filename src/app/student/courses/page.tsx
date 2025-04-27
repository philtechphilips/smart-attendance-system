"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import classNames from "classnames";
import DashboardLayout from "@/layouts/dasboard";
import { useAppDispatch } from "@/reducer/store";
import EmptyTable from "@/components/emptytable";
import { getLecturerCourses, getStudentCourses } from "@/services/courses.service";
import Link from "next/link";

export default function CourseList() {
  return (
    <DashboardLayout pageTitle="Courses">
      <Courses />
    </DashboardLayout>
  );
}

const Courses = () => {
  const dispatch = useAppDispatch();
  const [allcourses, setAllcourses] = useState<any>({});
  const [courses, setCourses] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const router = useRouter();

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
    const res = await getStudentCourses({
      search: "",
    });
    console.log("res", res);
    setCourses((prevcourses: any) => {
      const existingIds = new Set(prevcourses.map((course: any) => course.id));
      const newcourses = res.items.filter(
        (item: any) => !existingIds.has(item.id),
      );
      return [...prevcourses, ...newcourses];
    });
    setAllcourses(res);
  };

  useEffect(() => {
    fetchCourses();
    setIsLoading(false);
  }, [dispatch, paginationValue]);
  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Course list ({courses?.length || 0})
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search course..."
              className="border border-[#E6E6E6] rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={async (e) => {
                const query = e.target.value;
                if (query.trim() === "") {
                  setPaginationValue(1);
                  fetchCourses();
                  return;
                }
                setIsLoading(true);
                const res = await getLecturerCourses({
                  search: query,
                });
                setCourses(res?.course);
                setAllcourses(res);
                setIsLoading(false);
              }}
            />
            <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          </div>
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
                  <th className="py-3">Code</th>
                  <th className="py-3">Department</th>
                  <th className="py-3">Level</th>
                  <th className="py-3">Program</th>
                  <th className="py-3">Action</th>
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
                    <td className="py-3 ">{course?.name}</td>
                    <td className="py-3 ">{course?.code}</td>
                    <td className="py-3">{course?.department?.name}</td>
                    <td className={`py-3`}>{course?.class?.name}</td>
                    <td className="py-3 ">{course?.program?.name}</td>
                    <td className="py-3 ">
                      <Link
                        className="text-blue-700"
                        href={`/student/courses/${course?.id}`}
                      >
                        View Attendance
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allcourses?.items?.length <= 0 && <EmptyTable title="No studets" />}

          {isLoading && (
            <div
              className={classNames(
                "flex flex-col items-center justify-center w-full",
                {
                  "h-full": allcourses?.items?.length <= 0,
                },
              )}
            >
              <LoaderIcon />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
