/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../Image";
import Link from "next/link";
import { Usevariables } from "@/app/context/VariablesProvider";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../LoadingSpiner";

export default function About() {
  const { language } = Usevariables();
  const [loading, setloading] = useState(true);

  // حالات النصوص المختلفة
  const [text1, settext1] = useState({ en: "", ar: "" });
  const [text2, settext2] = useState({
    en: "",
    ar: "",
  });
  const [text3, settext3] = useState({
    en: "",
    ar: "",
  });

  // حالات الصور
  const [currentImage, setcurrentimage] = useState("/madad-hero-2.png");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/secend-texts");
        const data = response.data.data[0];

        // تخزين البيانات في الحالة
        if (data) {
          settext1({ en: data.text1_en, ar: data.text1_ar });
          settext2({ en: data.text2_en, ar: data.text2_ar });
          settext3({ en: data.text3_en, ar: data.text3_ar });
          setcurrentimage(data.image); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
        }
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
        <div className="h-[50vh] relative">
          <LoadingSpiner />
        </div>
      ) : (
        <section id="about" className=" relative">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="relative h-64 max-lg:h-80 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
                <Img
                  imgsrc={currentImage ? currentImage : "/madad-hero-2.png"}
                  styles="w-[1130px] self-center z-[9] relative rounded-md"
                />
              </div>

              <div className="lg:py-24">
                <h2 className="text-xl ml-1 underline underline-main_blue my-3 text-main_blue font-bold ">
                  {text1[language]}
                </h2>
                <h2 className="text-3xl text-main_text dark:text-secend_text font-bold sm:text-4xl">
                  {text2[language]}
                </h2>
                <p className="mt-4 dark:text-white/80  text-black/70">
                  {text3[language]}
                </p>

                <Link
                  href="/aboutus"
                  className=" group mt-4 relative overflow-hidden inline-block  bg-main_blue px-12 py-3 text-sm font-medium  transition  focus:outline-none hover:border-main_blue border border-transparent rounded-md duration-300 "
                >
                  <p className="group-hover:text-black text-white  relative z-[99]">
                    {language == "en" ? "Know More" : "تعرف علينا"}
                  </p>
                  <div className="group-hover:w-full left absolute right-0 top-0 bg-white w-0 duration-700 h-[500px] -z-1"></div>
                  <div className="group-hover:w-full right absolute left-0 top-0 bg-white w-0 duration-700 h-[500px] -z-1"></div>
                </Link>
              </div>
            </div>
            {/* <Img
            imgsrc="/wave-right.png"
            styles=" absolute rihgt-0 z-[-1] top-0 h-full w-full"
          /> */}
          </div>
        </section>
      )}
    </>
  );
}
