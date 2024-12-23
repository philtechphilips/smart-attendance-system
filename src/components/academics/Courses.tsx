import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import classNames from "classnames";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import { getCoursesByDepartment } from "@/reducer/actions/courses.dispatcher";
import { deleteCourse } from "@/services/courses.service";

const CourseList = () => {
  const dispatch = useAppDispatch();

  const { allCourses } = useAppSelector((state: RootState) => state.courses);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (
      !isLoading &&
      bottom &&
      paginationValue < Math.ceil(allCourses?.pagination?.total / 10)
    ) {
      setPaginationValue((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    dispatch(
      getCoursesByDepartment({
        currentPage: paginationValue,
        pageSize: 10,
      }),
    );
    setIsLoading(false);
  }, [dispatch, paginationValue]);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCourse(id);
          dispatch(
            getCoursesByDepartment({
              currentPage: paginationValue,
              pageSize: 10,
            }),
          );
          Swal.fire("Deleted!", "Course has been deleted!.", "success");
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error!",
            "There was a problem deleting the item.",
            "error",
          );
        }
      }
    });
  };

  return (
    <>
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Courses ({allCourses?.pagination?.total || 0})
        </div>
      </div>
      <main>
        <div
          className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]"
          onScroll={handleScroll}
        >
          {allCourses?.items?.length > 0 && (
            <table className="w-full text-sm leading-6 bg-white border-collapse ">
              <thead className="sticky top-0 bg-white z-[2]">
                <tr className="text-left">
                  <th className="px-4 text-center py-3 leading-6 text-[#4D4D4D]">
                    S/N
                  </th>
                  <th className="py-3 ">Name</th>
                  <th>
                    <div className="flex items-center gap-2">
                      <span className="">Code</span>
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center gap-2">
                      <span className="">Class</span>
                    </div>
                  </th>
                  <th className="py-3 ">Lecturer</th>
                  <th className="py-3 ">Department</th>
                  <th className="py-3 ">Program</th>
                  <th className="py-3 ">Action</th>
                </tr>
              </thead>
              <tbody>
                {allCourses?.items?.map((course: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                  >
                    <td className="py-3 pr-4 text-center relative">
                      <p>{index + 1}</p>
                    </td>
                    <td className="py-3 ">{course?.name}</td>
                    <td className="py-3 ">{course?.code}</td>
                    <td className="py-3 ">{course?.class?.name}</td>
                    <td className="py-3 ">
                      {" "}
                      {course?.lecturer?.lastname +
                        " " +
                        course?.lecturer?.firstname +
                        " " +
                        course?.lecturer?.middlename}
                    </td>
                    <td className="py-3">{course?.department?.name}</td>
                    <td className="py-3 ">{course?.program?.name}</td>
                    <td className="py-3 ">
                      <div
                        className="cursor-pointer"
                        onClick={() => handleDelete(course?.id)}
                      >
                        <i className="ri-delete-bin-7-line text-red-600 text-xl"></i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allCourses?.items?.length <= 0 && <EmptyTable title="No studets" />}

          {isLoading && (
            <div
              className={classNames(
                "flex flex-col items-center justify-center w-full",
                {
                  "h-full": allCourses?.items?.length <= 0,
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

export default CourseList;
