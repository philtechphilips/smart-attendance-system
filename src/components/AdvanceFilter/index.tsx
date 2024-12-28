import Image from "next/image";
import React, { useState } from "react";
import Button from "../Button";
import DropdownMenu from "../Dropdown";
import { defaultIncidentAdvanceFilter } from "@/src/utils/constant";
import { RootState, useAppDispatch, useAppSelector } from "@/src/reducer/store";
import { updateIncidentAdvanceFilters } from "@/src/reducer/actions/incident.dispatcher";

interface AdvanceFilterProps {
  close: () => void;
  submitHandler?: (data: { [key: string]: any }) => void;
}

interface IFormState {
  department: string;
  category: string;
  workflow: string;
  nature: string;
}

const defaultOption = {
  name: "All",
  checked: true,
};

const AdvanceFilter = ({ close, submitHandler }: AdvanceFilterProps) => {
  const dispatch = useAppDispatch();
  const { filterValues, incidentAdvanceFilters } = useAppSelector(
    (state: RootState) => state.incident,
  );
  const [selectedOptions, setSelectedOptions] = useState(
    incidentAdvanceFilters,
  );

  const updateAdvanceFilter = (key: string, value: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [key]: value,
    });
  };

  const handleResetFilter = () => {
    setSelectedOptions(defaultIncidentAdvanceFilter);
    dispatch(updateIncidentAdvanceFilters(defaultIncidentAdvanceFilter));
  };

  const applyBtnHandler = () => {
    submitHandler?.(selectedOptions);
    close?.();
  };

  const dropdownList = () => {
    const departmentList = filterValues.department.reduce(
      (acc, curr) => {
        acc.push({
          name: curr,
          checked: false,
        });
        return acc;
      },
      [defaultOption],
    );

    const categoryList = filterValues.category.reduce(
      (acc, curr) => {
        acc.push({
          name: curr,
          checked: false,
        });
        return acc;
      },
      [defaultOption],
    );

    const workflowList = filterValues.workflow.reduce(
      (acc, curr) => {
        acc.push({
          name: curr,
          checked: false,
        });
        return acc;
      },
      [defaultOption],
    );

    const natureList = filterValues.nature.reduce(
      (acc, curr) => {
        acc.push({
          name: curr,
          checked: false,
        });
        return acc;
      },
      [defaultOption],
    );
    return { departmentList, categoryList, workflowList, natureList };
  };

  return (
    <div className="relative h-screen overflow-x-hidden overflow-y-scroll">
      <div className="border-b-2 border-[#E6E6E6] py-4 px-6 flex items-center gap-4 justify-between bg-[#F5F5F5]">
        <p className="text-[18px] leading-8 font_gilroy-bold">More Filters</p>
        <Image
          src="/images/cancelIcon.svg"
          alt=""
          width={20}
          height={20}
          className="cursor-pointer"
          onClick={close}
        />
      </div>

      <div className="flex flex-col gap-10 px-6 mt-2">
        <div className="flex items-center h-10 rounded">
          <DropdownMenu
            data={dropdownList().departmentList}
            name="Department"
            selectedDate={selectedOptions.department}
            className
            dropdownAction={(value) => {
              updateAdvanceFilter("department", value);
            }}
            optionsPlacement="left"
            valuePosition="below"
            changeDropdownWidth
            key={selectedOptions.department}
            width="w-full"
          />
        </div>

        <div className="flex items-center h-10 rounded">
          <DropdownMenu
            data={dropdownList().categoryList}
            name="Incident category"
            selectedDate={selectedOptions.category}
            className
            dropdownAction={(value) => {
              updateAdvanceFilter("category", value);
            }}
            optionsPlacement="left"
            valuePosition="below"
            changeDropdownWidth
            width="w-full"
            key={selectedOptions.category}
          />
        </div>

        <div className="flex items-center h-10 rounded">
          <DropdownMenu
            data={dropdownList().workflowList}
            name="Workflow state"
            selectedDate={selectedOptions.workflow}
            className
            dropdownAction={(value) => {
              updateAdvanceFilter("workflow", value);
            }}
            optionsPlacement="left"
            valuePosition="below"
            changeDropdownWidth
            width="w-full"
            key={selectedOptions.workflow}
          />
        </div>
        <div className="flex items-center h-10 rounded">
          <DropdownMenu
            data={dropdownList().natureList}
            name="Nature of injury"
            selectedDate={selectedOptions.nature}
            className
            dropdownAction={(value) => {
              updateAdvanceFilter("nature", value);
            }}
            optionsPlacement="left"
            valuePosition="below"
            changeDropdownWidth
            width="w-full"
            key={selectedOptions.nature}
          />
        </div>
      </div>

      <div className="border-t-2 border-[#E6E6E6] py-4 px-6 flex items-center gap-4 justify-between bg-[#F5F5F5] absolute bottom-0 w-full">
        <Button
          text="Reset filters"
          type="button"
          position=""
          styles="max-w-[9rem] font_gilroy_semi-bold !bg-[#D8D8D8] w-[9rem]"
          handleClick={handleResetFilter}
        />
        <Button
          text="Apply"
          type="button"
          position=""
          styles="max-w-[9rem] font_gilroy_semi-bold w-[9rem]"
          handleClick={applyBtnHandler}
        />
      </div>
    </div>
  );
};

export default AdvanceFilter;
