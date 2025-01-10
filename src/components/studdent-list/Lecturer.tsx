import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import SolidDivider from "../icons/SolidDivider";
import { getStaffsByDepartment } from "@/reducer/actions/lecturer.dispatcher";
import { useRouter } from "next/navigation";

const LecturerList = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const router = useRouter();

  const { allStaffs } = useAppSelector((state: RootState) => state.staffs);

  useEffect(() => {
    dispatch(
      getStaffsByDepartment({
        currentPage: paginationValue,
        pageSize: 10,
      }),
    );
  }, [dispatch, paginationValue]);

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (
      !isLoading &&
      bottom &&
      paginationValue < Math.ceil(allStaffs?.pagination?.total / 10)
    ) {
      setPaginationValue((prev) => prev + 1);
      setIsLoading(true);
    }
  };

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
          onScroll={handleScroll}
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
                {allStaffs?.items?.map((staff: any, index: number) => (
                  <tr
                    key={index}
                    onClick={() =>
                      router.push(`/dashboard/accounts/staff/${staff?.id}`)
                    }
                    className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                  >
                    <td className="py-3 text-center relative">
                      <p>{index + 1}</p>
                    </td>
                    <td className="py-3 ">
                      {staff?.lastname +
                        " " +
                        staff?.firstname +
                        " " +
                        staff?.middlename}
                    </td>
                    <td className="py-3">{staff?.email}</td>
                    <td className="py-3">{staff?.phone}</td>
                    <td className="py-3">{staff?.level}</td>
                    <td className="py-3">{staff?.department?.name}</td>
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
