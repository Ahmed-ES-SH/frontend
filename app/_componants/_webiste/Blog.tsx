/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Img from "../Image";
import Link from "next/link";
import { Usevariables } from "@/app/context/VariablesProvider";
import { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";

const BlogSlider = () => {
  const { language } = Usevariables();
  const [text1, settext1] = useState({ ar: "", en: "" });
  const [text2, settext2] = useState({ ar: "", en: "" });
  const [text3, settext3] = useState({ ar: "", en: "" });
  const [data, setData] = useState<any>([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/forth-texts");
        const data = response.data.data;

        if (data) {
          settext1({ en: data.text1_en, ar: data.text1_ar });
          settext2({ en: data.text2_en, ar: data.text2_ar });
          settext3({ en: data.text3_en, ar: data.text3_ar });
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        console.log(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`/blog-posts?page=1`);
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div className="max-w-[85rem] max-lg:flex-col flex items-start justify-between px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="w-full flex justify-between flex-col lg:w-2/5">
        <div
          className={`block ${language == "en" ? "text-left" : "text-right"} `}
        >
          <div
            style={{ overflowWrap: "anywhere" }}
            className="flex items-baseline text-4xl"
          >
            <h2 className="font-bold cursor-pointer text-gray-900 dark:text-secend_text leading-[3.25rem] mb-5 ">
              {text1[language]}
            </h2>
            <span className="text-main_red cursor-pointer ">
              {text2[language]}
            </span>
          </div>
          <p className="text-gray-500 cursor-pointer mb-10 w-fit ml-auto ">
            {text3[language]}
          </p>
          <Link
            href="/blog"
            className="cursor-pointer border border-gray-300 shadow-sm rounded-full py-3.5 px-7 w-52 lg:mx-0 mx-auto flex justify-center text-gray-900 dark:text-white dark:hover:text-main_text font-semibold transition-all duration-300 hover:bg-gray-100"
          >
            {language == "en" ? "View All" : "شاهد الكل"}
          </Link>
        </div>
        <div className="flex relative h-[20vh] max-md:h-[8vh] items-center lg:justify-start justify-center lg:mt-0 mt-16 gap-4 mb-4">
          <button
            id="slider-button-left"
            className="swiper-button-prev group text-main_red flex justify-center items-center w-11 h-11 transition-all duration-500 rounded-full"
          ></button>
          <button
            id="slider-button-right"
            className="swiper-button-next group flex justify-center items-center w-11 h-11 transition-all duration-500 rounded-full"
          ></button>
        </div>
      </div>

      <div style={{ direction: "ltr" }} className="lg:w-3/5 max-lg:w-full">
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: "#slider-button-left",
            nextEl: "#slider-button-right",
          }}
          modules={[Navigation]}
        >
          {!loading &&
            data.map((post: any) => (
              <SwiperSlide key={post.id}>
                <Link
                  className="group relative block rounded-xl focus:outline-none"
                  href={`/blog/${post.id}`}
                >
                  <div className="shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70">
                    <Img
                      styles="size-full absolute top-0 start-0 object-cover"
                      imgsrc={post.image || "/portfoliosection/1.jpg"}
                    />
                  </div>
                  <div className="absolute top-0 inset-x-0 z-10">
                    <div className="p-4 flex flex-col h-full sm:p-6">
                      <div className="flex items-center">
                        <div className="shrink-0 bg-white/50 rounded-full">
                          <Img
                            styles="size-[46px] border-2 border-white rounded-full"
                            imgsrc="/logo.png"
                          />
                        </div>
                        <div className="ms-2.5 sm:ms-4">
                          <h4 className="font-semibold text-white">
                            {post.author}
                          </h4>
                          <p className="text-xs text-white/80">
                            {new Date(post.published_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 z-10">
                    <div className="flex flex-col h-full p-4 sm:p-6">
                      <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80 group-focus:text-white/80">
                        {language == "en" ? post.title_en : post.title_ar}
                      </h3>
                      <p className="mt-2 text-white/80">
                        {language == "en"
                          ? post.content_en.substring(0, 100)
                          : post.content_ar.substring(0, 100)}
                        ...
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BlogSlider;
