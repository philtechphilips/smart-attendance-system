"use client";
import DashboardLayout from "@/layouts/dasboard";
import Attendances from "@/components/attendance";
import { useEffect, useRef, useState } from "react";
import {
  getDepartmentAttendances,
  getStudentAttendances,
} from "@/services/Attendance";
import { useRouter } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { levelOptions, periodOptions, statusOptions } from "@/util/constant";
import EmptyTable from "@/components/emptytable";
import classNames from "classnames";
import { LoaderIcon } from "lucide-react";
import makeNetworkCall from "@/helpers/axios-request";
import { toast } from "react-toastify";
import BaseButton from "@/components/buttons/base-button/BaseButton";

export default function AttendanceModule() {
  return (
    <DashboardLayout pageTitle="Attendances">
      <DashboardContent />
    </DashboardLayout>
  );
}

// Image compression utility
const compressImage = async (
  file: File,
  maxSizeKB: number = 200,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate the scale down ratio
        let width = img.width;
        let height = img.height;
        const maxWidth = 800; // Max width
        const maxHeight = 600; // Max height

        // Scale down if needed
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw the image with new dimensions
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress the image
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        // Check size
        const base64Size = compressedBase64.length * 0.75; // Approximate size in bytes
        if (base64Size > maxSizeKB * 1024) {
          reject(new Error(`Image too large. Max size is ${maxSizeKB}KB`));
        } else {
          resolve(compressedBase64);
        }
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

const DashboardContent = ({}: any) => {
  const currTab = localStorage.getItem("currEventTab");
  const [activeEvent, setActiveEvent] = useState(currTab ? +currTab : 0);
  const handleActiveEvent = (index: number) => {
    localStorage.setItem("currEventTab", String(index));
    setActiveEvent(index);
  };
  const dispatch = useAppDispatch();
  const [allAttendances, setAllAttendances] = useState<any>({});
  const [attendances, setAttendance] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationValue, setPaginationValue] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [showStatus, setShowStatus] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF)");
        return;
      }

      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      try {
        // Compress and convert to base64
        const compressedBase64 = await compressImage(file);

        setBase64Image(compressedBase64);
        setSelectedFile(file);
        setError(null);
      } catch (compressError: any) {
        setError(compressError.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!base64Image || !user) {
      setError(
        base64Image ? "User not authenticated" : "Please select a file first",
      );
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const payload = {
        profileImage: base64Image,
        studentId: user.id,
      };

      const response = await makeNetworkCall({
        url: `/students/${user.id}/upload-profile`,
        method: "POST",
        body: payload,
      });

      if (response.data.success) {
        toast.success("Profile image uploaded successfully!");
        closeModal();
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset file selection states
    setSelectedFile(null);
    setBase64Image(null);
    setError(null);
  };
  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (
      !isLoading &&
      bottom &&
      paginationValue < Math.ceil(allAttendances?.pagination?.total / 10)
    ) {
      setPaginationValue((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  const fetchAttendance = async () => {
    setIsLoading(true);
    if (user) {
      const res = await getStudentAttendances(user?.id);
      setAllAttendances(res);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="w-full md:pl-[260px] pt-4 px-5 bg-neutral-100 min-h-screen overflow-x-scroll pr-5">
      <>
        <div className="flex border-b-2 border-[#E6E6E6] bg-[#FFFFFF] px-10">
          <div className="flex gap-12">
            <span
              className={`${
                activeEvent === 0 &&
                "border-b-4 px-4 border-[#4253F0] rounded-b-sm font_gilroy_semi-bold text-base leading-6"
              } py-4 cursor-pointer`}
              onClick={() => handleActiveEvent(0)}
            >
              Attendance
            </span>
            {/* <span
              className={`${activeEvent === 1 &&
                "border-b-4 px-4 border-[#4253F0] rounded-b-sm font_gilroy_semi-bold text-base leading-6"
                } py-4 cursor-pointer `}
              onClick={() => handleActiveEvent(1)}
            >
              Dumped Attendance
            </span> */}
          </div>
        </div>

        <div className="event__list__container">
          <div className="relative event__list__container">
            <div className="flex justify-between items-center p-4">
              <div className="font-semibold text-sm leading-10">
                Attendance list ({allAttendances?.courseAttendanceTable?.length}
                )
              </div>
              <button
                onClick={openModal}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Upload Profile Image
              </button>
            </div>

            <div
              className="w-full h-[20rem] overflow-auto text-sm leading-4 pb-[4rem]"
              onScroll={handleScroll}
            >
              {allAttendances &&
                allAttendances?.courseAttendanceTable?.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs bg-white border-collapse px-5">
                      <thead className="sticky top-0 bg-white z-[2]">
                        <tr className="text-left">
                          <th className="text-center py-3 leading-6 text-[#4D4D4D]">
                            S/N
                          </th>
                          <th className="py-3 hidden md:table-cell">Course</th>
                          <th className="py-3 hidden lg:table-cell">
                            Course Code
                          </th>
                          <th className="py-3 hidden lg:table-cell">Mode</th>
                          <th className="py-3 hidden lg:table-cell">
                            Lecturer
                          </th>
                          <th className="py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allAttendances &&
                          allAttendances?.courseAttendanceTable?.length > 0 &&
                          allAttendances?.courseAttendanceTable?.map(
                            (item: any, index: number) => (
                              <tr
                                key={index}
                                className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                              >
                                <td className="py-3 text-center">
                                  {index + 1}
                                </td>
                                <td className="py-3 hidden md:table-cell">
                                  {item?.course?.name}
                                </td>
                                <td className="py-3 hidden lg:table-cell">
                                  {item?.course?.code}
                                </td>
                                <td className="py-3 hidden lg:table-cell">
                                  Face Recognition
                                </td>
                                <td className="py-3 hidden xl:table-cell">
                                  {item?.course?.lecturer?.firstname +
                                    " " +
                                    item?.course?.lecturer?.lastname}
                                </td>
                                <td className="py-3 hidden xl:table-cell bg-green-600 rounded-lg px-5 text-white w-24">
                                  {item?.present === 1 ? "Present" : "Absent"}
                                </td>
                              </tr>
                            ),
                          )}
                      </tbody>
                    </table>
                  </div>
                )}
              {allAttendances?.courseAttendanceTable?.length <= 0 && (
                <EmptyTable title="No Attendance Record" />
              )}

              {isLoading && (
                <div
                  className={classNames(
                    "flex flex-col items-center justify-center w-full",
                    {
                      "h-full":
                        allAttendances?.courseAttendanceTable?.length <= 0,
                    },
                  )}
                >
                  <LoaderIcon />
                </div>
              )}
            </div>
          </div>
        </div>
      </>

      {/* Modal for Image Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 w-screen h-full z-[1000] flex items-center justify-center">
          <div className="bg-white px-5 py-5 rounded-xl w-[500px] relative">
            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <p className="text-center font-semibold">Upload Images</p>
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                className="mt-5"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/gif"
                disabled={isUploading}
              />
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name} (
                  {Math.round(selectedFile.size / 1024)} KB)
                </div>
              )}
              {base64Image && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={base64Image}
                    alt="Preview"
                    className="max-w-[200px] max-h-[200px] object-contain"
                  />
                </div>
              )}
              <BaseButton
                type="submit"
                className="mt-4"
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </BaseButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
