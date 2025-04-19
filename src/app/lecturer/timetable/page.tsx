"use client";
import DashboardLayout from "@/layouts/dasboard";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RootState, useAppDispatch, useAppSelector } from "@/reducer/store";
import { LoaderIcon } from "lucide-react";
import makeNetworkCall from "@/helpers/axios-request";
import { toast } from "react-toastify";
import BaseButton from "@/components/buttons/base-button/BaseButton";
import { getLecturerCourses } from "@/services/courses.service";
import EmptyTable from "@/components/emptytable";

export default function AttendanceModule() {
  return (
    <DashboardLayout pageTitle="Attendances">
      <Timetable />
    </DashboardLayout>
  );
}

// Image compression utility
const compressImage = async (file: File, maxSizeKB: number = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;
        const maxWidth = 800;
        const maxHeight = 600;

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

        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        const base64Size = compressedBase64.length * 0.75;
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

const LiveFeedModal = ({ course, onClose, onCapture }: { 
  course: any, 
  onClose: () => void, 
  onCapture: (imageData: string) => Promise<void> 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        setError("Could not access camera. Please check permissions.");
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the image data as base64
    const imageData = canvas.toDataURL('image/jpeg');

    try {
      setIsLoading(true);
      await onCapture(imageData);
    } catch (err) {
      setError("Failed to save image. Please try again.");
      console.error("Capture error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 w-screen h-full z-[1000] flex items-center justify-center">
      <div className="bg-white px-5 py-5 rounded-xl w-[90%] max-w-[800px] relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
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

        <h2 className="text-xl font-bold mb-4">Live Class: {course?.name}</h2>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        <div className="relative w-full h-[60vh] bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="mt-4 flex justify-center">
          <BaseButton
            onClick={captureImage}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-full"
          >
            {isLoading ? 'Processing...' : 'Capture Attendance'}
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

const Timetable = ({ }: any) => {
  const currTab = localStorage.getItem("currEventTab");
  const [activeEvent, setActiveEvent] = useState(currTab ? +currTab : 0);
  const handleActiveEvent = (index: number) => {
    localStorage.setItem("currEventTab", String(index));
    setActiveEvent(index);
  };
  const dispatch = useAppDispatch();
  const [allAttendances, setAllAttendances] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state: RootState) => state.auth.user);

  // State for profile image upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for live class
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      try {
        const compressedBase64 = await compressImage(file);
        setBase64Image(compressedBase64);
        setSelectedFile(file);
        setError(null);
      } catch (compressError: any) {
        setError(compressError.message);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!base64Image || !user) {
      setError(base64Image ? 'User not authenticated' : 'Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const payload = {
        profileImage: base64Image,
        studentId: user.id
      };

      const response = await makeNetworkCall({
        url: `/students/${user.id}/upload-profile`,
        method: 'POST',
        body: payload,
      });

      if (response.data.success) {
        toast.success('Profile image uploaded successfully!');
        closeProfileModal();
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedFile(null);
    setBase64Image(null);
    setError(null);
  };

  const startClass = (course: any) => {
    setSelectedCourse(course);
    setIsLiveModalOpen(true);
  };

  const closeLiveModal = () => {
    setIsLiveModalOpen(false);
    setSelectedCourse(null);
  };

  const handleCapture = async (imageData: string) => {
    if (!selectedCourse || !user) return;

    try {
      const payload = {
        courseId: selectedCourse.id,
        classId: selectedCourse.class.id,
        lecturerId: user.id,
        image: imageData,
        timestamp: new Date().toISOString()
      };

      const response = await makeNetworkCall({
        url: '/attendances/capture',
        method: 'POST',
        body: payload,
      });

      if (response.data.success) {
        toast.success('Attendance captured successfully!');
        closeLiveModal();
      } else {
        throw new Error(response.message || 'Capture failed');
      }
    } catch (err: any) {
      console.error('Capture failed:', err);
      throw err;
    }
  };

  const fetchAttendance = async () => {
    setIsLoading(true);
    if (user) {
      const res = await getLecturerCourses(user?.id);
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
              className={`${activeEvent === 0 &&
                "border-b-4 px-4 border-[#4253F0] rounded-b-sm font_gilroy_semi-bold text-base leading-6"
                } py-4 cursor-pointer`}
              onClick={() => handleActiveEvent(0)}
            >
              Attendance
            </span>
          </div>
        </div>

        <div className="event__list__container">
          <div className="relative event__list__container">
            <div className="flex justify-between items-center p-4">
              <div className="font-semibold text-sm leading-10">
                Attendance list ({allAttendances?.course?.length || 0})
              </div>
            
            </div>

            <div className="w-full h-[20rem] overflow-auto text-sm leading-4 pb-[4rem]">
              {allAttendances && allAttendances?.course?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs bg-white border-collapse px-5">
                    <thead className="sticky top-0 bg-white z-[2]">
                      <tr className="text-left">
                        <th className="text-center py-3 leading-6 text-[#4D4D4D]">
                          S/N
                        </th>
                        <th className="py-3 hidden md:table-cell">Course</th>
                        <th className="py-3 hidden lg:table-cell">Course Code</th>
                        <th className="py-3 hidden lg:table-cell">Class</th>
                        <th className="py-3 hidden lg:table-cell">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAttendances?.course?.map((item: any, index: number) => (
                        <tr
                          key={index}
                          className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                        >
                          <td className="py-3 text-center">{index + 1}</td>
                          <td className="py-3 hidden md:table-cell">
                            {item?.name}
                          </td>
                          <td className="py-3 hidden lg:table-cell">
                            {item?.code}
                          </td>
                          <td className="py-3 hidden lg:table-cell">
                            {item?.class?.name}
                          </td>
                          <td className="py-3 hidden xl:table-cell">
                            <button 
                              onClick={() => startClass(item)}
                              className="bg-green-600 rounded-lg px-5 py-2 text-white w-24"
                            >
                              Start Class
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {allAttendances?.course?.length <= 0 && (
                <EmptyTable title="No Courses Found" />
              )}

              {isLoading && (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <LoaderIcon className="animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </>

      {/* Profile Image Upload Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 w-screen h-full z-[1000] flex items-center justify-center">
          <div className="bg-white px-5 py-5 rounded-xl w-[500px] relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeProfileModal}
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

            <p className="text-center font-semibold">Upload Profile Image</p>
            <form onSubmit={handleProfileSubmit}>
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
                  Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
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
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </BaseButton>
            </form>
          </div>
        </div>
      )}

      {/* Live Class Modal */}
      {isLiveModalOpen && selectedCourse && (
        <LiveFeedModal 
          course={selectedCourse} 
          onClose={closeLiveModal} 
          onCapture={handleCapture} 
        />
      )}
    </div>
  );
};