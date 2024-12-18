import { TableData } from "@/constants/data";
import React from "react";

const Table = () => {
  return (
    <>
      <div className="w-full">
        <div className="h-[20rem] overflow-scroll">
          <>
            <>
              <table className="w-full  text-xs bg-white border-collapse border-t-2 border-[#e6e6e6]">
                <thead>
                  <tr className="text-left">
                    <th className="pr-4 text-center py-1 leading-6 text-[#4D4D4D]">
                      S/N
                    </th>
                    <th className="py-3">Task name</th>
                    <th>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="">Assignee</span>
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="">Due Date</span>
                          {/* <SortToggle
                                updateSortParam={updateSortParam}
                                sort={SafetyPointSortFields.sortDate}
                                currentSort={currentSort}
                                idSelected={"safety-point-date-selected"}
                                idUnSelected={"safety-point-date-unselected"}
                              /> */}
                        </div>
                      </div>
                    </th>
                    <th className="py-3 ">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {TableData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                    >
                      <td className="py-3 text-center font_gilroy-medium">
                        {index + 1}
                      </td>
                      <td className="py-3 font_gilroy-medium">{item.task}</td>
                      <td className="py-3 font_gilroy-medium">
                        {item.assignee}
                      </td>
                      <td className="py-3 font_gilroy-medium">
                        {item.dueDate}
                      </td>
                      <td className="py-3 font_gilroy-medium">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>

            {/* {!isLoading &&
                allViolationHistory?.items?.length <= 0 &&
                isLoading === false && <EmptyEvent />} */}
            {/* 
              {isLoading && (
                <div
                  className={classNames(
                    "flex flex-col items-center justify-center w-full",
                    {
                      "h-full": allViolationHistory?.items?.length <= 0,
                    }
                  )}
                > */}
            {/* <LoaderIcon /> */}
            {/* </div>
              )} */}
          </>
        </div>
      </div>
    </>
  );
};

export default Table;
