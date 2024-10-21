/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../Image";
import Link from "next/link";
import { Usevariables } from "@/app/context/VariablesProvider";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../LoadingSpiner";

export default function ServicesSection() {
  const { language } = Usevariables();
  const [data, setData] = useState<any>([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      setloading(true);
      try {
        const response = await instance.get(`/services?page=1`);
        setData(response.data.data); // بيانات الخدمات
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error);
      }
    };
    getData();
  }, []);
  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <section className="dark:bg-main_dash dark:text-secend_text">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="mx-auto w-3/4 text-center">
              <h2 className="text-xl text-main_orange my-4 font-bold sm:text-2xl">
                {language === "en" ? "Our Services" : "خدماتنا"}
              </h2>
              <h2 className="text-3xl font-bold sm:text-4xl">
                {language === "en" ? "What We’re Offering?" : "ماذا نقدم؟"}
              </h2>

              <p className="mt-4 text-black/70 dark:text-secend_text">
                {language === "en"
                  ? "Our technical services are designed to help businesses and individuals stay ahead in a fast-evolving digital world. We offer a range of solutions, from web development and mobile app creation to IT consulting and cloud computing. Our team of experts is dedicated to providing innovative and efficient solutions tailored to your unique needs."
                  : "خدماتنا التقنية مصممة لمساعدة الشركات والأفراد على مواكبة العالم الرقمي سريع التطور. نقدم مجموعة واسعة من الحلول، بدءًا من تطوير المواقع الإلكترونية وتطبيقات الهواتف المحمولة إلى الاستشارات التقنية والحوسبة السحابية. فريقنا من الخبراء ملتزم بتقديم حلول مبتكرة وفعالة تلبي احتياجاتك الفريدة."}
              </p>
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

            <div className="mt-12 text-center">
              <Link
                href="/services"
                className=" group relative overflow-hidden inline-block  bg-main_orange px-12 py-3 text-sm font-medium  transition  focus:outline-none hover:border-main_orange border border-transparent rounded-md duration-300 "
              >
                <p className="group-hover:text-black text-white  relative z-[99]">
                  {language == "en" ? "Get Started Today" : "لنبدأ الأن"}
                </p>
                <div className="group-hover:w-full left absolute right-0 top-0 bg-white w-0 duration-700 h-[500px] -z-1"></div>
                <div className="group-hover:w-full right absolute left-0 top-0 bg-white w-0 duration-700 h-[500px] -z-1"></div>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
