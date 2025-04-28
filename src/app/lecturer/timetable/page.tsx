"use client";
import * as faceapi from "face-api.js";
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
import { STUDENTS } from "@/constants/students";
import { getDepartmentStudents } from "@/services/Students.service";
import io from "socket.io-client"; // Import Socket.IO client

const socket = io(process.env.NEXT_PUBLIC_BE_URL); // Replace with your backend URL

export default function TimetableModule() {
  return (
    <DashboardLayout pageTitle="Timetables">
      <Timetable />
    </DashboardLayout>
  );
}

interface LiveFeedModalProps {
  course: any;
  onClose: () => void;
  onCapture: (imageData: string, studentId?: string) => Promise<void>;
}

const LiveFeedModal = ({ course, onClose, onCapture }: LiveFeedModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);
  const [storedImageDescriptors, setStoredImageDescriptors] =
    useState<any>(null);
  const [studentDescriptors, setStudentDescriptors] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any>([]);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const fetchDepartmentStudents = async () => {
    setIsLoading(true);
    try {
      const res = await getDepartmentStudents();
      setStudentsList(res?.items);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentStudents();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadModelsAndImages = async () => {
      try {
        // Load face detection models
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);

        // Process all student images
        const processedStudents = await Promise.all(
          STUDENTS.map(async (student) => {
            if (!student.image) return null;

            try {
              const img = await faceapi.fetchImage(student.image);
              const detections = await faceapi
                .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

              if (detections.length > 0) {
                return {
                  studentId: student.id,
                  matricNo: student.matricNo,
                  descriptor: detections[0].descriptor,
                };
              }
              return null;
            } catch (err) {
              console.error(
                `Error processing image for student ${student.id}:`,
                err,
              );
              return null;
            }
          }),
        );

        if (isMounted) {
          setModelsLoaded(true);
          setLoadingModels(false);
          setStudentDescriptors(processedStudents.filter(Boolean));
        }
      } catch (err) {
        console.error("Failed to load models or process images:", err);
        if (isMounted) {
          setError(
            "Failed to load face detection models or student images. Please refresh the page.",
          );
          setLoadingModels(false);
        }
      }
    };

    loadModelsAndImages();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const startCameraAndWebRTC = async () => {
      if (!modelsLoaded) return;

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);

          // Initialize WebRTC PeerConnection with proper configuration
          const pc = new RTCPeerConnection({
            iceServers: [
              { urls: "stun:stun.l.google.com:19302" },
            ],
          });

          // Add connection state handlers
          pc.oniceconnectionstatechange = () => {
            console.log("ICE connection state:", pc.iceConnectionState);
          };

          pc.onsignalingstatechange = () => {
            console.log("Signaling state:", pc.signalingState);
          };

          pc.onconnectionstatechange = () => {
            console.log("Connection state:", pc.connectionState);
          };

          // Add local stream to PeerConnection
          mediaStream.getTracks().forEach((track) => pc.addTrack(track, mediaStream));

          // Handle ICE candidates
          pc.onicecandidate = (event) => {
            if (event.candidate) {
              socket.emit("ice-candidate", {
                candidate: event.candidate,
                room: course.id,
              });
            }
          };

          setPeerConnection(pc);

          // Join the signaling room
          socket.emit("join-room", course.id);

          // Handle incoming offer with proper state checks
          socket.on("offer", async ({ offer, sender }) => {
            try {
              if (!pc || pc.signalingState !== "stable") {
                console.warn(`Cannot process offer in state: ${pc?.signalingState}`);
                return;
              }

              await pc.setRemoteDescription(new RTCSessionDescription(offer));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              socket.emit("answer", { answer, sender });
            } catch (err) {
              console.error("Error handling offer:", err);
            }
          });

          // Handle incoming answer with proper state checks
          socket.on("answer", async ({ answer }) => {
            try {
              if (!pc) return;

              if (pc.signalingState !== "have-local-offer") {
                console.warn(`Cannot set remote answer in state: ${pc.signalingState}`);
                return;
              }

              await pc.setRemoteDescription(new RTCSessionDescription(answer));
            } catch (err) {
              console.error("Error setting remote answer:", err);
            }
          });

          // Handle incoming ICE candidates
          socket.on("ice-candidate", async ({ candidate }) => {
            try {
              if (pc && candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
              }
            } catch (err) {
              console.error("Error adding ICE candidate:", err);
            }
          });

          // Create and send an offer with slight delay
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          setTimeout(() => {
            socket.emit("offer", { offer, room: course.id });
          }, 300);
        }
      } catch (err) {
        console.error("Camera/WebRTC error:", err);
        if (isMounted) {
          setError("Could not access camera or initialize WebRTC.");
        }
      }
    };

    if (modelsLoaded) {
      startCameraAndWebRTC();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection) {
        // Clean up all event listeners
        peerConnection.onicecandidate = null;
        peerConnection.ontrack = null;
        peerConnection.oniceconnectionstatechange = null;
        peerConnection.onsignalingstatechange = null;
        peerConnection.onconnectionstatechange = null;
        peerConnection.close();
      }
      // Remove socket listeners
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      isMounted = false;
    };
  }, [modelsLoaded]);


  useEffect(() => {
    if (!modelsLoaded || !videoRef.current || !canvasRef.current) return;

    let debounceTimeout: NodeJS.Timeout | null = null;

    const detectFace = async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) return;

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize,
        );

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;

        faceapi.draw.drawDetections(canvas, resizedDetections);

        if (resizedDetections.length > 0) {
          const capturedDescriptor = resizedDetections[0].descriptor;

          // Compare captured face with all student descriptors
          const faceMatcher = new faceapi.FaceMatcher(
            studentDescriptors.map(
              (desc) =>
                new faceapi.LabeledFaceDescriptors(desc.matricNo, [
                  desc.descriptor,
                ]),
            ),
            0.4, // Adjust the threshold here
          );

          const bestMatch = faceMatcher.findBestMatch(capturedDescriptor);

          if (bestMatch.label !== "unknown") {
            setFaceCaptured(true);

            // Find the matched student details
            const matchedStudent = studentDescriptors.find(
              (desc) => desc.matricNo === bestMatch.label,
            );

            if (matchedStudent) {
              // Clear any existing debounce timeout
              if (debounceTimeout) clearTimeout(debounceTimeout);

              // Set a new debounce timeout
              debounceTimeout = setTimeout(async () => {
                const payload = {
                  studentId: matchedStudent.studentId,
                  matricNo: matchedStudent.matricNo,
                  image: canvas.toDataURL("image/jpeg"),
                  courseId: course.id, // Include the course ID
                  timestamp: new Date().toISOString(),
                };

                const response = await makeNetworkCall({
                  url: "/attendances/capture",
                  method: "POST",
                  body: payload,
                });

                if (response.data.success) {
                  toast.success(
                    `Timetable captured for student ${matchedStudent.matricNo}`,
                  );
                } else {
                  toast.warning(
                    response.data.message ||
                      "Capture failed. Please try again.",
                  );
                }
              }, 2000); // 8 seconds debounce
            }
          } else {
            console.warn("No matching student found");
          }
        }
      } catch (err) {
        console.error("Face detection error:", err);
      }
    };

    const interval = setInterval(detectFace, 500); // Call detectFace every 500ms
    return () => {
      clearInterval(interval);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [modelsLoaded, studentDescriptors]);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded || !course)
      return;

    try {
      setIsLoading(true);
      setError(null);

      // Capture current frame
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const capturedImageData = canvas.toDataURL("image/jpeg");

      // Detect faces in captured image
      const capturedDetections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (capturedDetections.length > 0) {
        const capturedDescriptor = capturedDetections[0].descriptor;

        if (studentDescriptors.length === 0) {
          throw new Error("No student images available for comparison");
        }

        // Compare captured face with all student descriptors
        const faceMatcher = new faceapi.FaceMatcher(
          studentDescriptors.map(
            (desc) =>
              new faceapi.LabeledFaceDescriptors(desc.matricNo, [
                desc.descriptor,
              ]),
          ),
          0.4, // Adjust the threshold here
        );

        const bestMatch = faceMatcher.findBestMatch(capturedDescriptor);

        if (bestMatch.label !== "unknown") {
          console.log("Matched student:", bestMatch.label);

          // Find the matched student details
          const matchedStudent = studentDescriptors.find(
            (desc) => desc.matricNo === bestMatch.label,
          );

          if (matchedStudent) {
            // Send data to the backend
            const payload = {
              studentId: matchedStudent.studentId,
              matricNo: matchedStudent.matricNo,
              image: capturedImageData,
              courseId: course.id, // Include the course ID
              timestamp: new Date().toISOString(),
            };

            const response = await makeNetworkCall({
              url: "/Timetables/capture",
              method: "POST",
              body: payload,
            });

            if (response.data.success) {
              toast.success(
                `Timetable captured for student ${matchedStudent.matricNo}`,
              );
            } else {
              throw new Error(response.message || "Capture failed");
            }
          }
        } else {
          throw new Error("No matching student found");
        }
      } else {
        throw new Error("No face detected in captured image");
      }
    } catch (err: any) {
      console.error("Capture error:", err);
      setError(err.message || "Failed to process image");
      setFaceCaptured(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingModels) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 w-screen h-full z-[1000] flex items-center justify-center">
        <div className="bg-white px-5 py-5 rounded-xl w-[90%] max-w-[800px] relative">
          <p className="text-center">Loading face detection models...</p>
          <div className="flex justify-center mt-4">
            <LoaderIcon className="animate-spin" />
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-red-500 mb-4 p-2 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <div className="relative w-full h-[60vh] bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>

        <div className="mt-4 flex justify-center">
          <BaseButton
            onClick={captureImage}
            disabled={isLoading || !faceCaptured}
            className={`px-6 py-2 rounded-full ${
              isLoading
                ? "bg-gray-400"
                : faceCaptured
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400"
            } text-white`}
          >
            {isLoading
              ? "Processing..."
              : faceCaptured
                ? "Captured Timetable"
                : "No Face Detected"}
          </BaseButton>
        </div>
      </div>
    </div>
  );
};

const Timetable = ({}: any) => {
  const currTab = localStorage.getItem("currEventTab");
  const [activeEvent, setActiveEvent] = useState(currTab ? +currTab : 0);
  const handleActiveEvent = (index: number) => {
    localStorage.setItem("currEventTab", String(index));
    setActiveEvent(index);
  };
  const dispatch = useAppDispatch();
  const [allTimetables, setAllTimetables] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const user = useAppSelector((state: RootState) => state.auth.user);

  // State for live class
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);

  const startClass = (course: any) => {
    setSelectedCourse(course);
    setIsLiveModalOpen(true);
  };

  const closeLiveModal = () => {
    setIsLiveModalOpen(false);
    setSelectedCourse(null);
  };

  const handleCapture = async (imageData: string, studentId?: string) => {
    if (!selectedCourse || !user) return;

    try {
      const payload = {
        courseId: selectedCourse.id,
        classId: selectedCourse.class.id,
        lecturerId: user.id,
        image: imageData,
        timestamp: new Date().toISOString(),
        studentId: studentId,
      };

      const response = await makeNetworkCall({
        url: "/Timetables/capture",
        method: "POST",
        body: payload,
      });

      if (response.data.success) {
        toast.success(
          studentId
            ? `Timetable captured for student ${studentId}`
            : "Timetable captured successfully!",
        );
        closeLiveModal();
      } else {
        throw new Error(response.message || "Capture failed");
      }
    } catch (err: any) {
      console.error("Capture failed:", err);
      toast.error(err.message || "Failed to capture Timetable");
      throw err;
    }
  };

  const fetchTimetable = async () => {
    setIsLoading(true);
    if (user) {
      try {
        const res = await getLecturerCourses(user?.id);
        setAllTimetables(res);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        toast.error("Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchTimetable();
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
              Timetable
            </span>
          </div>
        </div>

        <div className="event__list__container">
          <div className="relative event__list__container">
            <div className="flex justify-between items-center p-4">
              <div className="font-semibold text-sm leading-10">
                Timetable list ({allTimetables?.course?.length || 0})
              </div>
            </div>

            <div className="w-full h-[20rem] overflow-auto text-sm leading-4 pb-[4rem]">
              {allTimetables && allTimetables?.course?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs bg-white border-collapse px-5 min-w-[600px]">
                    <thead className="sticky top-0 bg-white z-[2]">
                      <tr className="text-left">
                        <th className="text-center py-3 leading-6 text-[#4D4D4D]">
                          S/N
                        </th>
                        <th className="py-3">Course</th>
                        <th className="py-3">
                          Course Code
                        </th>
                        <th className="py-3l">Class</th>
                        <th className="py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTimetables?.course?.map(
                        (item: any, index: number) => (
                          <tr
                            key={index}
                            className="border-t-2 border-[#e6e6e6] text-[#4D4D4D] w-full hover:bg-[#737373] hover:bg-opacity-10 cursor-pointer"
                          >
                            <td className="py-3 text-center">{index + 1}</td>
                            <td className="py-3">
                              {item?.name}
                            </td>
                            <td className="py-3">
                              {item?.code}
                            </td>
                            <td className="py-3">
                              {item?.class?.name}
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() => startClass(item)}
                                className="bg-green-600 rounded-lg px-5 py-2 text-white w-24 hover:bg-green-700"
                              >
                                Start Class
                              </button>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {allTimetables?.course?.length <= 0 && !isLoading && (
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
