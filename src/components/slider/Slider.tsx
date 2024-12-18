// import React, { useState } from "react";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Image from "@/node_modules/next/image";

// interface Slide {
//   text: string;
//   image: string;
//   name: string;
//   organization: string;
// }

// interface TestimonialSliderProps {
//   slides: Slide[];
// }

// const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ slides }) => {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 10000,
//     customPaging: (i: number) => (
//       <div
//         style={{
//           width: "11px",
//           height: "11px",
//           borderRadius: "50%",
//           backgroundColor: i === currentSlide ? "white" : "#4F4F4F",
//         }}
//       />
//     ),
//     beforeChange: (current: number, next: number) => setCurrentSlide(next),
//   };

//   return (
//     <Slider {...settings}>
//       {slides.map((slide, index) => (
//         <div key={index}>
//           <div>
//             <div>
//               <p className="text-[#E0E0E0] text-xs font-normal">
//                 "{slide.text}"
//               </p>
//             </div>
//             <div className="content flex items-center mt-5">
//               <Image src={slide.image} alt={`${slide.name}'s avatar`} />
//               <div>
//                 <h3 className="text-white font-bold text-base mb-2">
//                   {slide.name}
//                 </h3>
//                 <p className="text-[#239FAC] font-medium text-xs italic">
//                   {slide.organization}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </Slider>
//   );
// };

// export default TestimonialSlider;
