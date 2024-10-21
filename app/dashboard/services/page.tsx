/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../../_componants/Image";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";

export default function ServicesComponent() {
  const { language } = Usevariables();
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setloading] = useState(true);

  // Fetch data with pagination
  useEffect(() => {
    const getData = async (page: number) => {
      setloading(true);
      try {
        const response = await instance.get(`/services?page=${page}`);
        setData(response.data.data); // بيانات الخدمات
        setCurrentPage(response.data.current_page); // الصفحة الحالية
        setTotalPages(response.data.last_page); // عدد الصفحات
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error);
      }
    };
    getData(currentPage);
  }, [currentPage]);

  // Handle page navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <section className="dark:bg-main_dash dark:text-secend_text">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-lg text-center">
              <h2 className="text-xl text-main_orange my-4 font-bold sm:text-2xl">
                {language === "en" ? "Services" : "الخدمات"}
              </h2>
            </div>

            {/* عرض الخدمات */}
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data.map((service, index) => (
                <Link
                  key={index}
                  href={`/dashboard/services/${service?.id ? service?.id : 5}`}
                  className="block group rounded-xl border border-gray-500 dark:border-gray-800 p-8 shadow-xl transition hover:border-main_orange hover:shadow-main_orange relative overflow-hidden"
                >
                  <Img
                    imgsrc={
                      service.icon ? service.icon : "/servicessection/2.png"
                    }
                    styles="w-[50px]"
                  />

                  <h2 className="mt-4 group-hover:text-white text-xl font-bold text-main_blue dark:text-secend_text">
                    {language === "en" ? service.title_en : service.title_ar}
                  </h2>

                  <p className="mt-1 group-hover:text-white text-sm text-black/70 dark:text-secend_text">
                    {language === "en"
                      ? service.description_en
                      : service.description_ar}
                  </p>

                  {/* الخلفية المتغيرة */}
                  <div className="w-0 h-full absolute top-0 left-0 bg-main_orange z-[-1] group-hover:w-full duration-500"></div>
                </Link>
              ))}
            </div>

            {/* عرض أزرار التنقل بين الصفحات */}
            <div className="pagination flex justify-center mt-8">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
