import React from "react";

const Organization = () => {
  return (
    <div className="bg-white relative w-60 py-8 px-5 rounded-lg flex flex-col items-center justify-center">
      <i className="ri-question-mark text-5xl text-red-600"></i>
      <p className="text-sm text-neutral-800 text-center mt-1">
        You dont have organization yet! Kindly contact your organization.
      </p>
      {/* <div className="absolute cursor-pointer top-2 right-5 bg-neutral-200 rounded-full w-7 h-7 flex items-center justify-center">
      <i className="ri-close-line text-lg text-neutral-800"></i>
      </div> */}
    </div>
  );
};

export default Organization;
