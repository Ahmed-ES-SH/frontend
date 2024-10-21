"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Img from "../Image";
import { FaChevronLeft, FaChevronRight, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { CiFacebook } from "react-icons/ci";
import { FaSquareXTwitter } from "react-icons/fa6";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";

// بيانات الفريق في مصفوفة

interface TeamMember {
  id: number;
  name: string;
  position: string;
  facebook: string;
  X_Account: string;
  instagram: string;
  image: string;
}

const socialIcons = [
  {
    icon: <CiFacebook />,
    key: "facebook",
  },
  {
    icon: <FaInstagram />,
    key: "instagram",
  },
  {
    icon: <FaSquareXTwitter />,
    key: "X_Account",
  },
];

export default function TeamMembers() {
  const { language } = Usevariables();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  console.log(loading);
  const fetchTeamMembers = async () => {
    try {
      const response = await instance.get("/team-members");
      setTeamMembers(response.data.data);
    } catch (error) {
      console.error("Error fetching team members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // تغيير عنوان القسم بناءً على اللغة
  const title = language === "ar" ? "فريقنا" : "Our team";

  return (
    <>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="font-manrope text-5xl text-center font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: "#swiper-button-next",
              prevEl: "#swiper-button-prev",
            }}
            modules={[Navigation]}
            breakpoints={{
              500: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            loop={true}
            className="max-w-xl mx-auto md:max-w-3xl lg:max-w-full"
          >
            {teamMembers.map((member) => (
              <SwiperSlide key={member.id}>
                <Link href="#" className="group relative block bg-black">
                  <Img
                    imgsrc={member.image ? member.image : "/avatar-3.jpg"}
                    styles="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
                  />

                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <p className="text-sm font-medium uppercase tracking-widest text-pink-500">
                      {member.position}
                    </p>

                    <p className="text-xl font-bold text-white sm:text-2xl">
                      {member.name}
                    </p>

                    <div className="mt-32 sm:mt-48 lg:mt-64 w-full">
                      <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="flex items-center gap-5 w-fit mx-auto">
                          {socialIcons.map((item, index) => {
                            const link = member[item.key]; // احصل على الرابط من بيانات العضو
                            return link ? (
                              <a
                                key={index}
                                href={link}
                                target="_blank" // افتح الرابط في نافذة جديدة
                                rel="noopener noreferrer" // لتحسين الأمان
                                className="icon text-white text-[22px]"
                              >
                                {item.icon}
                              </a>
                            ) : null; // إذا لم يكن هناك رابط، لا تظهر الأيقونة
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* أزرار التنقل */}
          <div className="flex justify-center gap-4 mt-8">
            <div
              id="swiper-button-prev"
              className="hover:bg-main_red hover:text-white dark:text-white dark:hover:text-black duration-200 border border-main_red flex items-center justify-center bg-transparent px-4 py-2 rounded-full w-[40px] h-[40px] cursor-pointer"
            >
              <FaChevronLeft />
            </div>
            <div
              id="swiper-button-next"
              className="hover:bg-main_red hover:text-white dark:text-white dark:hover:text-black duration-200 border border-main_red flex items-center justify-center bg-transparent px-4 py-2 rounded-full w-[40px] h-[40px] cursor-pointer"
            >
              <FaChevronRight />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
