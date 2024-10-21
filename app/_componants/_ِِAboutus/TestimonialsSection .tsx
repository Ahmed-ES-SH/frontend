"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Img from "../Image";
import { instance } from "@/app/Api/axios";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await instance.get("/customer-feedbacks");
        setTestimonials(response.data); // تأكد من المسار الصحيح للبيانات القادمة من الـ API
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-14 lg:py-24 bg-gray-50 dark:bg-secend_dash">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 rounded-full">
          <h2 className="text-4xl font-manrope font-bold text-gray-900 text-center">
            What our happy users say!
          </h2>
        </div>

        {/* Swiper for both text and image content */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="mySwiper2"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col items-center mb-20">
                {/* صورة العميل */}
                <Img
                  imgsrc={testimonial.image}
                  styles="mx-auto mb-6 w-[80px] h-[80px] border rounded-full border-indigo-600 object-cover"
                />

                {/* نص الرأي */}
                <p className="text-lg text-gray-500 leading-8 mb-8 text-center max-w-3xl">
                  {testimonial.content}
                </p>

                {/* اسم العميل */}
                <h3 className="text-xl font-semibold text-gray-900 text-center">
                  {testimonial.client_name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;
