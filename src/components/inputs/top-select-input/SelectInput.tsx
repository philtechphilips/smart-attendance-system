"use client";
import React, { ChangeEvent, useState } from "react";
import styles from "../../../app/styles/auth.module.scss";

const DynamicSelect = () => {
  const [selectedOption, setSelectedOption] = useState("English (UK)");

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className={styles.right}>
      <select
        id="language"
        value={selectedOption}
        onChange={handleChange}
        className="pl-2 pr-8 appearance-none w-[153px] h-11 bg-[#F8FAFC] text-[#ACACAC] text-center text-xs rounded-lg outline-none"
      >
        <option value="English (UK)">English (UK)</option>
      </select>
      <div className="absolute inset-y-0 right-[145px] top-[44px] flex items-center pr-2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 12l-6-6h12l-6 6z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default DynamicSelect;
