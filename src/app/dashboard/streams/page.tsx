"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import classNames from "classnames";
import DashboardLayout from "@/layouts/dasboard";
import { useAppDispatch } from "@/reducer/store";
import {
  getStreams,
} from "@/services/Students.service";
import EmptyTable from "@/components/emptytable";
import Link from "next/link";

export default function Accounts() {
  return (
    <DashboardLayout pageTitle="Live Classes">
      <Streams />
    </DashboardLayout>
  );
}

const Streams = () => {
  const dispatch = useAppDispatch();
  const [allStreams, setAllStreams] = useState<any>({});
  const [Streams, setStreams] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const router = useRouter();

  const fetchStreams = async () => {
    const res = await getStreams();
    console.log(res, '..........streams')
    setStreams(res);
  };

  useEffect(() => {
    fetchStreams();
    setIsLoading(false);
  }, [dispatch, paginationValue]);
  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Active Classes
        </div>
      </div>
      <main>
        <div
          className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]"
        >
          {Streams?.length > 0 && (
            <table className="w-full text-sm leading-6 bg-white border-collapse table-fixed">
              <thead className="sticky top-0 bg-white z-[2]">
                <tr className="text-left">
                  <th className="pr-4 text-center py-3 leading-6 text-[#4D4D4D]">
                    S/N
                  </th>
                  <th className="py-3 ">Course</th>
                  <th>
                    <div className="flex items-center gap-2">
                      <span className="">Course Code</span>
                    </div>
                  </th>
                  <th className="py-3 ">Action</th>
                </tr>
              </thead>
              <tbody>
                {Streams?.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                  >
                    <td className="py-3 text-center relative">
                      <p>{index + 1}</p>
                    </td>
                    <td className="py-3 ">
                      {item?.course?.name}
                    </td>
                    <td className="py-3">{item?.course.code}</td>
                    <td className="py-3">
                      <Link href={`/stream/${item?.roomId}`} className="px-5 py-2 rounded-lg bg-blue-500 text-white">View Live Class</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {allStreams?.items?.length <= 0 && <EmptyTable title="No streams" />}

          {isLoading && (
            <div
              className={classNames(
                "flex flex-col items-center justify-center w-full",
                {
                  "h-full": allStreams?.items?.length <= 0,
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
