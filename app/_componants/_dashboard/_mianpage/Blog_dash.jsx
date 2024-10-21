"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Img from "../../Image";
import Link from "next/link";
import { Usevariables } from "@/app/context/VariablesProvider";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../../LoadingSpiner";

export default function Blog_dash() {
  const { language } = Usevariables();
  const [text1, settext1] = useState({ ar: "", en: "" });
  const [text2, settext2] = useState({ ar: "", en: "" });
  const [text3, settext3] = useState({ ar: "", en: "" });
  const [loading, setloading] = useState(false);

  // حالات فتح وإغلاق الـ popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [activeText, setActiveText] = useState(null);

  // دالة لفتح الـ popup مع النص والنص المحدد
  const openPopup = (text, setText) => {
    setCurrentText(text);
    setActiveText(() => setText); // تخزين دالة setText
    setIsPopupOpen(true);
  };

  const handleSave = () => {
    if (currentText.en.trim() !== "" || currentText.ar.trim() !== "") {
      activeText((prev) => ({
        en: currentText.en.trim() !== "" ? currentText.en.trim() : prev.en,
        ar: currentText.ar.trim() !== "" ? currentText.ar.trim() : prev.ar,
      }));
    }
    setIsPopupOpen(false); // إغلاق الـ popup
  };

  const updateText = async () => {
    const formData = new FormData();

    // إضافة النصوص إلى FormData
    if (text1.ar) formData.append("text1_ar", text1.ar);
    if (text1.en) formData.append("text1_en", text1.en);
    if (text2.ar) formData.append("text2_ar", text2.ar);
    if (text2.en) formData.append("text2_en", text2.en);
    if (text3.ar) formData.append("text3_ar", text3.ar);
    if (text3.en) formData.append("text3_en", text3.en);
    try {
      setloading(true);
      const response = await instance.post(`/forthsection`, formData);
      console.log(response.data.message);
      setloading(false);
    } catch (error) {
      console.error("Error updating text:", error);
      setloading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/forth-texts");
        const data = response.data.data;

        // تخزين البيانات في الحالة
        if (data) {
          settext1({ en: data.text1_en, ar: data.text1_ar });
          settext2({ en: data.text2_en, ar: data.text2_ar });
          settext3({ en: data.text3_en, ar: data.text3_ar });
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpiner />
      ) : (
        <div className="max-w-[85rem] max-lg:flex-col flex items-start justify-between px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="w-full flex justify-between flex-col lg:w-2/5">
            <div className="block lg:text-left text-center">
              <div
                style={{ overflowWrap: "anywhere" }}
                className="flex items-baseline text-4xl"
              >
                <h2
                  onClick={() => openPopup(text1, settext1)}
                  className=" font-bold cursor-pointer text-gray-900 dark:text-secend_text leading-[3.25rem] mb-5 transition-all duration-300 border-2 border-transparent hover:border-sky-500"
                >
                  {text1[language]}
                </h2>
                <span
                  onClick={() => openPopup(text2, settext2)}
                  className="text-main_red  cursor-pointer transition-all duration-300 border-2 border-transparent hover:border-sky-500"
                >
                  {text2[language]}
                </span>
              </div>
              <p
                onClick={() => openPopup(text3, settext3)}
                className="text-gray-500 cursor-pointer mb-10 max-lg:max-w-xl max-lg:mx-auto transition-all duration-300 border-2 border-transparent hover:border-sky-500"
              >
                {text3[language]}
              </p>
              <Link
                href="/blog"
                className="cursor-pointer border border-gray-300 shadow-sm rounded-full py-3.5 px-7 w-52 lg:mx-0 mx-auto flex justify-center text-gray-900 dark:text-white dark:hover:text-main_text font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                View All
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

          {/* الـ popup للتعديل على النصوص */}
          {isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-[9999999] bg-black bg-opacity-50">
              <div className="bg-white p-6 w-[80%] mx-auto h-[220px] rounded-md">
                {/* حقل لإدخال النص العربي */}
                <input
                  type="text"
                  value={currentText.ar}
                  onChange={(e) =>
                    setCurrentText((prev) => ({
                      ...prev,
                      ar: e.target.value,
                    }))
                  }
                  placeholder="Arabic text"
                  className="border border-gray-300 p-2 w-full h-[50px] mb-2"
                />
                {/* حقل لإدخال النص الإنجليزي */}
                <input
                  type="text"
                  value={currentText.en}
                  onChange={(e) =>
                    setCurrentText((prev) => ({
                      ...prev,
                      en: e.target.value,
                    }))
                  }
                  placeholder="English text"
                  className="border border-gray-300 p-2 w-full h-[50px] mb-4"
                />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="lg:w-3/5 max-lg:w-full">
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                prevEl: "#slider-button-left",
                nextEl: "#slider-button-right",
              }}
              modules={[Navigation]}
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <a
                  className="group relative block rounded-xl focus:outline-none"
                  href="#"
                >
                  <div className="shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70">
                    <Img
                      styles="size-full absolute top-0 start-0 object-cover"
                      imgsrc="/portfoliosection/2.jpg"
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
                          <h4 className="font-semibold text-white">Admin</h4>
                          <p className="text-xs text-white/80">Jan 09, 2021</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 z-10">
                    <div className="flex flex-col h-full p-4 sm:p-6">
                      <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80 group-focus:text-white/80">
                        Facebook is creating a news section in Watch to feature
                        breaking news
                      </h3>
                      <p className="mt-2 text-white/80">
                        Facebook launched the Watch platform in August
                      </p>
                    </div>
                  </div>
                </a>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <a
                  className="group relative block rounded-xl focus:outline-none"
                  href="#"
                >
                  <div className="shrink-0 relative rounded-xl overflow-hidden w-full h-[350px] before:absolute before:inset-x-0 before:z-[1] before:size-full before:bg-gradient-to-t before:from-gray-900/70">
                    <Img
                      styles="size-full absolute top-0 start-0 object-cover"
                      imgsrc="/portfoliosection/3.jpg"
                    />
                  </div>
                  <div className="absolute top-0 inset-x-0 z-10">
                    <div className="p-4 flex flex-col h-full sm:p-6">
                      <div className="flex items-center">
                        <div className="shrink-0">
                          <Img
                            styles="size-[46px] border-2 border-white rounded-full"
                            imgsrc="/logo.png"
                          />
                        </div>
                        <div className="ms-2.5 sm:ms-4">
                          <h4 className="font-semibold text-white">Admin</h4>
                          <p className="text-xs text-white/80">May 30, 2021</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 z-10">
                    <div className="flex flex-col h-full p-4 sm:p-6">
                      <h3 className="text-lg sm:text-3xl font-semibold text-white group-hover:text-white/80 group-focus:text-white/80">
                        What CFR (Conversations, Feedback, Recognition) really
                        is about
                      </h3>
                      <p className="mt-2 text-white/80">
                        For a lot of people these days, Measure What Matters.
                      </p>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      )}
      <button
        onClick={updateText}
        className="px-4 mx-auto mt-4 block w-fit h-fit shadow-md group overflow-hidden relative py-2 rounded-md bg-green-400"
      >
        {language == "en" ? "save" : "تحديث"}
      </button>
    </>
  );
}
