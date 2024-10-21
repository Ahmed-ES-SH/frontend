/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useRef, useEffect } from "react";
import Img from "../../Image";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../../LoadingSpiner";
import { Usevariables } from "@/app/context/VariablesProvider";

export default function About_dash() {
  const { language } = Usevariables();
  const [loading, setloading] = useState(false);
  const openinput = useRef(null);

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
  const [image, setImage] = useState("");
  const [currentImage, setcurrentimage] = useState("/madad-hero-2.png");

  // حالات فتح وإغلاق الـ popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentText, setCurrentText] = useState({ en: "", ar: "" });
  const [activeText, setActiveText] = useState(null);

  // دالة لفتح الـ popup مع النص والنص المحدد
  const openPopup = (text, setText) => {
    setCurrentText({ en: text.en, ar: text.ar }); // تعيين النصوص الحالية
    setActiveText(() => setText); // تخزين دالة setText
    setIsPopupOpen(true);
  };

  // دالة لحفظ التعديلات وإغلاق الـ popup
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
    if (image) formData.append("image", image);
    try {
      setloading(true);
      const response = await instance.post(`/secendsection`, formData);
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
        const response = await instance.get("/secend-texts");
        const data = response.data.data[0];

        // تخزين البيانات في الحالة
        if (data) {
          settext1({ en: data.text1_en, ar: data.text1_ar });
          settext2({ en: data.text2_en, ar: data.text2_ar });
          settext3({ en: data.text3_en, ar: data.text3_ar });
          setcurrentimage(data.image); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة

          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const onchange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      {loading ? (
        <div className="h-[20vh] relative">
          <LoadingSpiner />
        </div>
      ) : (
        <section id="about" className="relative">
          <input
            onChange={onchange}
            type="file"
            name=""
            hidden
            ref={openinput}
          />
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
              <div
                onClick={() => openinput.current.click()}
                className="relative border-2 border-transparent hover:border-sky-400 transition-all duration-300 cursor-pointer h-64 max-lg:h-80 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full"
              >
                {image ? (
                  <Img
                    imgsrc={URL.createObjectURL(image)}
                    styles="w-[1130px] self-center z-[9] relative rounded-md"
                  />
                ) : (
                  <Img
                    imgsrc={currentImage ? currentImage : "/madad-hero-2.png"}
                    styles="w-[1130px] self-center z-[9] relative rounded-md"
                  />
                )}
              </div>

              <div className="lg:py-24">
                <h2
                  onClick={() => openPopup(text1, settext1)}
                  className="text-xl ml-1 underline underline-main_blue my-3 text-main_blue font-bold cursor-pointer border-2 border-transparent hover:border-sky-400 transition-all duration-300"
                >
                  {text1[language]} {/* عرض النص بناءً على اللغة */}
                </h2>
                <h2
                  onClick={() => openPopup(text2, settext2)}
                  className="text-3xl text-main_text dark:text-secend_text font-bold sm:text-4xl cursor-pointer border-2 border-transparent hover:border-sky-400 transition-all duration-300"
                >
                  {text2[language]} {/* عرض النص بناءً على اللغة */}
                </h2>
                <p
                  onClick={() => openPopup(text3, settext3)}
                  className="mt-4 dark:text-white/80 text-black/70 cursor-pointer border-2 border-transparent hover:border-sky-400 transition-all duration-300"
                >
                  {text3[language]} {/* عرض النص بناءً على اللغة */}
                </p>

                <button
                  onClick={updateText}
                  className="px-4 mx-auto mt-4 block w-fit h-fit shadow-md group overflow-hidden relative py-2 rounded-md bg-green-400"
                >
                  {language === "en" ? "save" : "تحديث"}
                </button>
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
          </div>
        </section>
      )}
    </>
  );
}
