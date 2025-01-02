import { useRouter } from "next/router";
import React from "react";

const AttendanceDetails = () => {
  const router = useRouter();
  const attendanceId = router?.query?.id;
  console.log(attendanceId);
  return <div> AttendanceDetails</div>;
};

export default AttendanceDetails;
