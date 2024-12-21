import React from "react";
import EmptyTableIcon from "../icons/EmptyTableIcon";

interface EmptyProps {
  title?: string;
}

const EmptyTable = ({ title }: EmptyProps) => {
  return (
    <div className="flex justify-center flex-col w-full items-center h-96">
      <EmptyTableIcon />
      {title ? (
        <span className="text-base leading-6 font_gilroy_semi-bold">
          {title}
        </span>
      ) : (
        <span className="text-base leading-6 font_gilroy_semi-bold">
          No content to show
        </span>
      )}
    </div>
  );
};

export default EmptyTable;
