/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../Image";
import Link from "next/link";
import { Usevariables } from "@/app/context/VariablesProvider";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../LoadingSpiner";

export default function Value() {
  const { language } = Usevariables();

  // حالات النصوص المختلفة
  const [text1, settext1] = useState({
    ar: "",
    en: "",
  });
  const [currentimage, setcurrentimage] = useState("");
  const [text2, settext2] = useState({
    en: "",
    ar: "",
  });
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/third-texts");
        const data = response.data.data[0];

        // تخزين البيانات في الحالة
        if (data) {
          settext1({ en: data.text1_en, ar: data.text1_ar });
          settext2({ en: data.text2_en, ar: data.text2_ar });
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
        <section>
          <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:h-[80vh] lg:grid-cols-2">
              <div className="relative z-10 lg:py-16">
                <div className="relative h-64 sm:h-80 lg:h-full">
                  <Img
                    imgsrc={currentimage ? currentimage : "/madad-hero-3.png"}
                    styles="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="relative flex items-center ">
                <span className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 "></span>

                <div className="p-8 sm:p-16 lg:p-24">
                  <h2 className="text-2xl font-bold sm:text-3xl text-main_text dark:text-secend_text">
                    {text1[language]}
                  </h2>

                  <p className="mt-4 dark:text-white/80  text-black/70">
                    {text2[language]}
                  </p>

                  <Link
                    href="/aboutus"
                    className=" group mt-4 relative overflow-hidden inline-block  bg-main_blue px-12 py-3 text-sm font-medium  transition  focus:outline-none hover:border-main_blue border border-transparent rounded-md duration-300 "
                  >
                    <p className="group-hover:text-black text-white  relative z-[99]">
                      {language == "en" ? "Know More" : "تعرف أكثر"}
                    </p>
                    <div className="group-hover:w-full left absolute right-0 top-0 bg-white w-0 duration-700 h-[500px] -z-1"></div>
                    <div className="group-hover:w-full right absolute left-0 top-0 bg-white w-0 duration-700 h-[500px] -z-1"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
