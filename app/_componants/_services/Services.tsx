/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../Image";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import LoadingSpiner from "../LoadingSpiner";

export default function Services() {
  const { language } = Usevariables();
  const [data, setData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch data with pagination
  useEffect(() => {
    const getData = async (page: number) => {
      setLoading(true);
      try {
        const response = await instance.get(`/services?page=${page}`);
        setData(response.data.data); // بيانات الخدمات
        setCurrentPage(response.data.current_page); // الصفحة الحالية
        setTotalPages(response.data.last_page); // عدد الصفحات
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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
            <div className="mx-auto w-3/4 max-md:w-[92%] text-center">
              <h2 className="text-xl text-main_orange my-4 font-bold sm:text-2xl">
                {language === "en" ? "Our Services" : "خدماتنا"}
              </h2>
              <h2 className="text-3xl font-bold sm:text-4xl">
                {language === "en" ? "What We’re Offering?" : "ماذا نقدم؟"}
              </h2>
              <p className="mt-4 text-black/70 dark:text-secend_text">
                {language === "en"
                  ? "Advertising services encompass a range of strategies and solutions designed to promote products or brands through various channels, including digital, print, and broadcast media. These services aim to enhance brand visibility, engage target audiences, and drive sales by crafting compelling messages and creative campaigns tailored to specific markets."
                  : "تشمل خدمات الإعلان مجموعة من الاستراتيجيات والحلول المصممة للترويج للمنتجات أو العلامات التجارية من خلال قنوات مختلفة، بما في ذلك الوسائط الرقمية والمطبوعة والبث. تهدف هذه الخدمات إلى تعزيز رؤية العلامة التجارية، وزيادة تفاعل الجمهور المستهدف، وزيادة المبيعات من خلال صياغة رسائل جذابة وحملات إبداعية مصممة لتناسب الأسواق المحددة."}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {data.map((service: any, index: number) => (
                <Link
                  key={index}
                  href={`/services/${service.id}`}
                  className="block group rounded-xl border border-gray-500 dark:border-gray-800 p-8 shadow-xl transition hover:border-main_orange hover:shadow-main_orange relative overflow-hidden"
                >
                  <Img
                    imgsrc={
                      service.image ? service.image : "/servicessection/3.png"
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

            <div className="flex justify-center mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {language === "en" ? "Previous" : "السابق"}
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {language === "en" ? "Next" : "التالي"}
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
