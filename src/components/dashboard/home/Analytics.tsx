import React from "react";

const Analytics = () => {
  return (
    <div className="flex md:flex-nowrap flex-wrap gap-2 md:gap-8 pb-10">
      <div className="bg-white md:w-64 w-[47%] rounded-lg border p-5">
        <h6 className="text-sm">Total Number of tasks</h6>
        <h4 className="pt-2 font-semibold text-lg">43</h4>
      </div>

      <div className="bg-white md:w-64 w-[47%] rounded-lg border p-5">
        <h6 className="text-sm">Completed tasks</h6>
        <h4 className="pt-2 font-semibold text-lg">43</h4>
      </div>

      <div className="bg-white md:w-64 w-[47%] rounded-lg border p-5">
        <h6 className="text-sm">Number of active tasks</h6>
        <h4 className="pt-2 font-semibold text-lg">43</h4>
      </div>

      <div className="bg-white md:w-64 w-[47%] rounded-lg border p-5">
        <h6 className="text-sm">Number of pending tasks</h6>
        <h4 className="pt-2 font-semibold text-lg">43</h4>
      </div>
    </div>
  );
};

export default Analytics;
