import React from "react";

interface ArrowProp {
  filled?: boolean;
}

const ArrowDown = ({ filled }: ArrowProp) => {
  if (filled) {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.9401 13.7124L17.0501 18.6024C16.4726 19.1799 15.5276 19.1799 14.9501 18.6024L10.0601 13.7124"
          stroke="#737373"
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_2260_11340"
        // style="mask-type:alpha"
        maskUnits="userSpaceOnUse"
        x="7"
        y="9"
        width="10"
        height="7"
      >
        <path d="M7 9H17V15.6667H7V9Z" fill="white" />
      </mask>
      <g mask="url(#mask0_2260_11340)">
        <path
          d="M17.0003 9.52988C17.0003 9.62879 16.9664 9.72629 16.9003 9.81248L12.5522 15.4193C12.4323 15.5733 12.2245 15.6673 12.0002 15.6673C11.7758 15.6673 11.568 15.5733 11.4481 15.4193L7.10003 9.81248C6.97396 9.64928 6.96614 9.44298 7.08177 9.27412C7.19654 9.10456 7.41477 9 7.65212 9H16.3482C16.5855 9 16.8038 9.10456 16.9185 9.27412C16.9733 9.35396 17.0003 9.44227 17.0003 9.52988Z"
          fill="#BFBFBF"
        />
      </g>
    </svg>
  );
};

export default ArrowDown;
