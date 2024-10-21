/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../Image";
import Navbar from "../_webiste/Navbar";
import Footer from "../_webiste/Footer";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import TestimonialsSection from "./TestimonialsSection ";
import LoadingSpiner from "../LoadingSpiner";

export default function Aboutus() {
  const { language } = Usevariables();
  const [form, setform] = useState({
    about_en: "",
    about_ar: "",
    goals_en: "",
    goals_ar: "",
    value_en: "",
    value_ar: "",
    vision_ar: "",
    vision_en: "",
  });
  const [aboutimage, setaboutimage] = useState<string>("");
  const [valueimage, setvalueimage] = useState<any>(null);
  const [loading, setloading] = useState(true);
  const [goalsimage, setgoalsimage] = useState<string>("");
  const [visionimage, setvisionimage] = useState<string>("");

  const fetchData = async () => {
    try {
      const response = await instance.get("/all-details");
      const data = response.data.data[0];

      setform({
        about_en: data.aboutcontent_en,
        about_ar: data.aboutcontent_ar,
        value_ar: data.values_ar,
        value_en: data.values_en,
        vision_ar: data.vision_ar,
        vision_en: data.vision_en,
        goals_ar: data.goals_ar,
        goals_en: data.goals_en,
      });
      setaboutimage(data.about_image);
      setvalueimage(data.values_image);
      setvisionimage(data.vision_image);
      setgoalsimage(data.goals_image);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [language]);

  if (loading) {
    return (
      <div className="h-screen relative">
        <LoadingSpiner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <section className="py-14 lg:py-24 relative z-0 bg-gray-50 dark:bg-secend_dash">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center">
          <h1 className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 mb-5 md:text-5xl md:leading-normal">
            {language === "en"
              ? "Control your Finances with our"
              : "تحكم في أموالك مع"}
            <span className="text-indigo-600">
              {" "}
              {language === "en" ? "Smart Tool" : "أداتنا الذكية"}{" "}
            </span>
          </h1>
          <p className="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">
            {language === "en"
              ? "Invest intelligently and discover a better way to manage your entire wealth easily."
              : "استثمر بذكاء واكتشف طريقة أفضل لإدارة ثروتك بسهولة."}
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
            <div className="img-box">
              <Img imgsrc={aboutimage} styles="max-lg:mx-auto object-cover" />
            </div>
            <div className="lg:pl-[100px] flex items-center">
              <div className="data w-full">
                <h2 className="font-manrope font-bold text-4xl lg:text-5xl text-black dark:text-secend_text mb-9 max-lg:text-center relative">
                  {language === "en" ? "About Us" : "من نحن ؟"}
                </h2>
                <p className="font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto">
                  {language === "en" ? form.about_en : form.about_ar}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9">
            <div className="lg:pr-24 flex items-center">
              <div className="data w-full">
                <h2 className="font-manrope font-bold text-4xl lg:text-5xl dark:text-secend_text text-black mb-9 max-lg:text-center">
                  {language === "en" ? "Company Values" : "قيم الشركة"}
                </h2>
                <p className="font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto">
                  {language === "en" ? form.value_en : form.value_ar}
                </p>
              </div>
            </div>
            <div className="img-box">
              <Img imgsrc={valueimage} styles="hidden lg:block object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-9">
            <div className="img-box">
              <Img imgsrc={goalsimage} styles="max-lg:mx-auto object-cover" />
            </div>
            <div className="lg:pl-[100px] flex items-center">
              <div className="data w-full">
                <h2 className="font-manrope font-bold text-4xl lg:text-5xl text-black dark:text-secend_text mb-9 max-lg:text-center relative">
                  {language === "en" ? "Company Goals" : "أهداف الشركة"}
                </h2>
                <p className="font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto">
                  {language === "en" ? form.goals_en : form.goals_ar}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-9">
            <div className="lg:pr-24 flex items-center">
              <div className="data w-full">
                <h2 className="font-manrope font-bold text-4xl lg:text-5xl dark:text-secend_text text-black mb-9 max-lg:text-center">
                  {language === "en" ? "Company Vision" : "رؤية الشركة"}
                </h2>
                <p className="font-normal text-xl leading-8 text-gray-500 max-lg:text-center max-w-2xl mx-auto">
                  {language === "en" ? form.vision_en : form.vision_ar}
                </p>
              </div>
            </div>
            <div className="img-box">
              <Img imgsrc={visionimage} styles="hidden lg:block object-cover" />
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection />
      <Footer />
    </>
  );
}
