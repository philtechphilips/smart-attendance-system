import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { getStudentsByDepartment } from "@/reducer/actions/students.dispatcher";
import EmptyTable from "../emptytable";
import LoaderIcon from "../icons/LoaderIcon";
import SolidDivider from "../icons/SolidDivider";

const Students = () => {
  const dispatch = useAppDispatch();

  const { allStudents, isLoading } = useAppSelector(
    (state: RootState) => state.students,
  );
  console.log(allStudents, "students");

  useEffect(() => {
    dispatch(getStudentsByDepartment());
    if (allStudents) {
    }
  }, []);
  return (
    <>
      <div className="flex  justify-between items-center p-4 border-b-2 border-[#e6e6e6]">
        <div className="font-semibold leading-10">
          Students list ({allStudents?.pagination?.total || 0})
        </div>
        <div className="flex items-center gap-3">
          {/* {activeEvent == 1 && (
                    <>
                        <div className="bg-[#e6e6e6] h-10 flex items-center rounded">
                            <DropdownMenu
                                data={EventListDropdown}
                                name="Events:"
                                selectedDate={selectedDevice}
                                className
                                dropdownAction={value => {
                                    switchDeviceCovered(value)
                                }}
                                changeDropdownWidth
                            />
                        </div>

                        <SolidDivider />
                    </>
                )} */}
          <div className="bg-[#e6e6e6] h-10 flex items-center rounded">
            {/* <DropdownMenu
                        data={severityData}
                        name="Severity:"
                        selectedDate={selectedSeverity}
                        className
                        dropdownAction={value => {
                            switchEventsSeverity(value.toLowerCase())
                        }}
                        changeDropdownWidth
                    /> */}
          </div>

          <SolidDivider />
          <div className="bg-[#e6e6e6] h-10 flex items-center rounded">
            {/* <DropdownMenu
                        data={eventStatusData}
                        selectedDate={selectedStatus}
                        name="Status:"
                        className
                        dropdownAction={value => {
                            switchEventsStatus(value.toLowerCase())
                        }}
                        changeDropdownWidth
                    /> */}

            {/* <CheckboxDropdown
                        eventStatusData={eventStatusData}
                        selectedItems={selectedStatus}
                        setSelectedItems={setSelectedStatus}
                    /> */}
          </div>
          <SolidDivider />
          {/* <DropdownMenu
                    Icon={CalendarIcon}
                    data={modifiedFilterSiteData}
                    selectedDate={selectedPeriod}
                    name={''}
                    handleClick={value => {
                        customClick(value)
                    }}
                    selectedCustomDate={selectedCustomDate}
                    dropdownAction={value => {
                        switchPeriod(value.toLowerCase())
                    }}
                /> */}
        </div>
      </div>
      <main>
        <div
          className="w-full table__container table__container_full text-sm leading-4 pb-[4rem]"
          // onScroll={handleScroll}
        >
          {allStudents?.items?.length > 0 && (
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
                      {/* <SortToggle
                                            updateSortParam={
                                                updateSortParam
                                            }
                                            sort={
                                                SafetyPointSortFields.sortDate
                                            }
                                            currentSort={currentSort}
                                            idSelected={
                                                'eventlist-date-selected'
                                            }
                                            idUnSelected={
                                                'eventlist-date-unselected'
                                            }
                                        /> */}
                    </div>
                  </th>
                  <th className="py-3 ">School</th>
                  <th className="py-3 ">Department</th>
                  <th className="py-3 ">Level</th>
                  <th className="py-3 ">Program</th>
                </tr>
              </thead>
              <tbody>
                {allStudents?.items?.map((student: any, index: number) => (
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
                    <td className="py-3 ">{student?.matricNo}</td>
                    <td className="py-3 ">{student?.school?.name}</td>
                    <td className="py-3 p-4">{student?.department?.name}</td>
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
    </>
  );
};

export default Students;
