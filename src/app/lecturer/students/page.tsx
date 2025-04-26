"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import classNames from "classnames";
import DashboardLayout from "@/layouts/dasboard";
import { useAppDispatch } from "@/reducer/store";
import {
  getDepartmentStudents,
  getLecturerStudents,
} from "@/services/Students.service";
import EmptyTable from "@/components/emptytable";

export default function Accounts() {
  return (
    <DashboardLayout pageTitle="Students">
      <Students />
    </DashboardLayout>
  );
}

const Students = () => {
  const dispatch = useAppDispatch();
  const [allStudents, setAllStudents] = useState<any>({});
  const [students, setStudents] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const router = useRouter();

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

  const fetchStudents = async () => {
    const res = await getLecturerStudents({
      currentPage: paginationValue,
      pageSize: 10,
    });
    setStudents((prevStudents: any) => {
      const existingIds = new Set(
        prevStudents.map((student: any) => student.id),
      );
      const newStudents = res.students.filter(
        (item: any) => !existingIds.has(item.id),
      );
      return [...prevStudents, ...newStudents];
    });
    setAllStudents(res);
  };

  useEffect(() => {
    fetchStudents();
    setIsLoading(false);
  }, [dispatch, paginationValue]);
  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Students list ({allStudents?.total || 0})
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              className="border border-[#E6E6E6] rounded-md px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={async (e) => {
                const query = e.target.value;
                if (query.trim() === "") {
                  setPaginationValue(1);
                  fetchStudents();
                  return;
                }
                setIsLoading(true);
                const res = await getLecturerStudents({
                  currentPage: 1,
                  pageSize: 10,
                  search: query,
                });
                setStudents(res.students);
                setAllStudents(res);
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
          {students?.length > 0 && (
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
                {students?.map((student: any, index: number) => (
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
                    <td className="py-3">{student?.matricNo}</td>
                    <td className="py-3">{student?.school?.name}</td>
                    <td className="py-3">{student?.department?.name}</td>
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
    </div>
  );
};
