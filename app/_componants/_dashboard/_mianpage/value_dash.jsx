/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useRef, useEffect } from "react";
import Img from "../../Image";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../../LoadingSpiner";
import { Usevariables } from "@/app/context/VariablesProvider";

export default function Value_dash() {
  const { language } = Usevariables();
  const openinput = useRef(null);

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
  const [image, setimage] = useState("");

  // حالات فتح وإغلاق الـ popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [loading, setloading] = useState(false);
  const [activeText, setActiveText] = useState(null);

  // دالة لفتح الـ popup مع النص والنص المحدد
  const openPopup = (text, setText) => {
    setCurrentText(text);
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
    if (image) formData.append("image", image);
    try {
      setloading(true);
      const response = await instance.post(`/thirdsection`, formData);
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
        const response = await instance.get("/third-texts");
        const data = response.data.data[0];

        // تخزين البيانات في الحالة
        if (data) {
          settext1({ en: data.text1_en, ar: data.text1_ar });
          settext2({ en: data.text2_en, ar: data.text2_ar });
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
    setimage(e.target.files[0]);
  };

  return (
    <>
      {loading ? (
        <div className="h-[40vh] relative">
          <LoadingSpiner />
        </div>
      ) : (
        <section>
          {/* دالة اختيار الملف */}
          <input
            onChange={onchange}
            type="file"
            name=""
            hidden
            ref={openinput}
          />
          <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 max-lg:h-fit lg:h-[80vh] lg:grid-cols-2">
              {/* الصورة القابلة للنقر */}
              <div
                onClick={() => openinput.current.click()}
                className="relative border-2 border-transparent hover:border-sky-400 transition-all duration-300 cursor-pointer h-64 max-lg:h-fit  lg:h-full"
              >
                {image ? (
                  <Img
                    imgsrc={URL.createObjectURL(image)}
                    styles="w-[1130px] self-center  relative rounded-md"
                  />
                ) : (
                  <Img
                    imgsrc={currentimage ? currentimage : "/madad-hero-3.png"}
                    styles="w-[1130px] self-center  relative rounded-md"
                  />
                )}
              </div>

              <div className="relative flex items-center">
                <span className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16"></span>

                <div className="p-8 sm:p-16 lg:p-24">
                  <h2
                    onClick={() => openPopup(text1, settext1)}
                    className="text-2xl border-2 border-transparent hover:border-sky-400 transition-all duration-300 font-bold sm:text-3xl text-main_text dark:text-secend_text cursor-pointer"
                  >
                    {text1[language]}
                  </h2>

                  <p
                    onClick={() => openPopup(text2, settext2)}
                    className="mt-4 border-2 border-transparent hover:border-sky-400 transition-all duration-300 dark:text-white/80 text-black/70 cursor-pointer"
                  >
                    {text2[language]}
                  </p>

                  <button
                    onClick={updateText}
                    className="px-4 mx-auto mt-4 block w-fit h-fit shadow-md group overflow-hidden relative py-2 rounded-md bg-green-400"
                  >
                    {language === "en" ? "save" : "تحديث"}
                  </button>
                </div>
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
