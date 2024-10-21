/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import Img from "../../../../_componants/Image";
export default function SubServicesComponent({ params }) {
  const id = params.mainserviceid;
  const { language } = Usevariables();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/subservices/${id}`); // تأكد من المسار الصحيح لجلب الخدمات الفرعية
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [id]);

  return (
    <>
      <section className="dark:bg-main_dash dark:text-secend_text">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-xl text-main_orange my-4 font-bold sm:text-2xl">
              {language === "en" ? "Sub Services" : "الخدمات الفرعية"}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.map((subService, index) => (
              <Link
                key={index}
                href={`/dashboard/subservices/${subService.id}`} // تأكد من المسار الصحيح للخدمة الفرعية
                className="block group rounded-xl border border-gray-500 dark:border-gray-800 p-8 shadow-xl transition hover:border-main_orange hover:shadow-main_orange relative overflow-hidden"
              >
                <Img
                  imgsrc={
                    subService.image
                      ? subService.image
                      : "/servicessection/2.png"
                  }
                  styles="w-[50px]"
                />

                <h2 className="mt-4 group-hover:text-white text-xl font-bold text-main_blue dark:text-secend_text">
                  {language === "en"
                    ? subService.title_en
                    : subService.title_ar}
                </h2>

                <p className="mt-1 group-hover:text-white text-sm text-black/70 dark:text-secend_text">
                  {language === "en"
                    ? subService.description_en
                    : subService.description_ar}
                </p>

                {/* الخلفية المتغيرة */}
                <div className="w-0 h-full absolute top-0 left-0 bg-main_orange z-[-1] group-hover:w-full duration-500"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
