/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import React, { useRef, useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function Companydetailes() {
  const { language } = Usevariables();
  const openinputabout = useRef<any>(null);
  const openinputvalue = useRef<any>(null);
  const openinputgoals = useRef<any>(null);
  const openinputvision = useRef<any>(null);
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

  const [aboutimage, setaboutimage] = useState<File | null>(null);
  const [valueimage, setvalueimage] = useState<any>(null);
  const [loading, setloading] = useState(true);
  const [goalsimage, setgoalsimage] = useState<File | null>(null);
  const [visionimage, setvisionimage] = useState<File | null>(null);
  const [done, setdone] = useState<string>("");
  const [generalError, setgeneralError] = useState<string>("");

  // دالة لتحميل البيانات من الخادم
  const fetchData = async () => {
    try {
      const response = await instance.get("/all-details"); // تغيير المسار وفقًا لAPI الخاص بك
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
  }, [language]); // جلب البيانات عند تغيير اللغة

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setform({ ...form, [e.target.name]: e.target.value }); // تصحيح هذا الجزء ليتماشى مع البيانات
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setimage: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const files = e.target.files;
    if (files) {
      setimage(files[0]);
    }
  };

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    setloading(true);

    // إضافة البيانات النصية
    formData.append("about_en", form.about_en);
    formData.append("about_ar", form.about_ar);
    formData.append("goals_en", form.goals_en);
    formData.append("goals_ar", form.goals_ar);
    formData.append("values_en", form.value_en);
    formData.append("values_ar", form.value_ar);
    formData.append("vision_en", form.vision_en);
    formData.append("vision_ar", form.vision_ar);

    // إضافة الصور إذا كانت موجودة
    if (aboutimage) {
      formData.append("about_image", aboutimage);
    }
    if (valueimage) {
      formData.append("values_image", valueimage);
    }
    if (goalsimage) {
      formData.append("goals_image", goalsimage);
    }
    if (visionimage) {
      formData.append("vision_image", visionimage);
    }

    try {
      const response = await instance.post("/update-details", formData);
      setdone("Data successfully submitted!");
      setloading(false);
      throw response;
    } catch (error: any) {
      setloading(false);
      setgeneralError("Error submitting data.");
      throw error;
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <div className="w-full h-fit pt-20 dark:text-secend_text dark:bg-secend_dash">
          <h1 className="text-xl font-semibold w-fit mx-auto pb-4 border-b-2 border-sky-400 ">
            {language === "en" ? "Company Information" : "معلومات عن الشركة"}
          </h1>

          <form
            onSubmit={handlesubmit}
            className="w-[90%] max-md:w-[98%] mx-auto"
          >
            {/* قسم عن الشركة */}
            <div className="w-full pb-4 border-b-2 border-sky-500 h-[48vh] max-lg:h-fit overflow-hidden gap-4 my-2 max-lg:flex-col flex items-end justify-between">
              <div className="w-full">
                <div className="w-full mb-4">
                  <label htmlFor="about_en" className="text-[18px] py-2 ">
                    {language === "ar" ? "عن الشركة" : "About the Company"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="about_en"
                    name="about_en"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.about_en}
                  />
                </div>
                <div className="w-full mb-4">
                  <label htmlFor="about_ar" className="text-[18px] py-2 ">
                    {language === "ar"
                      ? "عن الشركة (Arabic)"
                      : "About the Company (English)"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="about_ar"
                    name="about_ar"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.about_ar}
                  />
                </div>
              </div>
              {/* صورة عن الشركة */}
              <div className="w-full h-full">
                <div
                  onClick={() => openinputabout.current.click()}
                  className="w-full flex items-center justify-center group cursor-pointer h-full"
                >
                  {typeof aboutimage === "string" ? (
                    // عرض الصورة إذا كانت من نوع string (رابط)
                    <Img
                      imgsrc={aboutimage}
                      styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                    />
                  ) : aboutimage instanceof File ? (
                    // عرض الصورة إذا كانت مرفوعة حديثًا (File object)
                    <Img
                      imgsrc={URL.createObjectURL(aboutimage)}
                      styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                    />
                  ) : (
                    // عرض زر الرفع في حالة عدم وجود صورة
                    <div className="w-full mt-4 h-[41vh] border-2 border-dashed border-sky-400 flex items-center justify-center cursor-pointer ">
                      <FaPlusCircle className="size-8 text-sky-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* قسم أهداف الشركة */}
            <div className="w-full pb-4 border-b-2 border-sky-500 h-[48vh] max-lg:h-fit overflow-hidden gap-4 my-2 max-lg:flex-col flex items-end justify-between">
              <div className="w-full">
                <div className="w-full mb-4">
                  <label htmlFor="about_en" className="text-[18px] py-2 ">
                    {language === "ar" ? "أهداف الشركة" : " the Company goals"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="goals_en"
                    name="goals_en"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.goals_en}
                  />
                </div>
                <div className="w-full mb-4">
                  <label htmlFor="goals_ar" className="text-[18px] py-2 ">
                    {language === "ar"
                      ? "أهداف الشركة (Arabic)"
                      : " the Company goals (English)"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="goals_ar"
                    name="goals_ar"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.goals_ar}
                  />
                </div>
              </div>
              {/* صورة عن الشركة */}

              <div
                onClick={() => openinputgoals.current.click()}
                className="w-full flex items-center justify-center group cursor-pointer h-full"
              >
                {typeof goalsimage === "string" ? (
                  // عرض الصورة إذا كانت من نوع string (رابط)
                  <Img
                    imgsrc={goalsimage}
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : goalsimage instanceof File ? (
                  // عرض الصورة إذا كانت مرفوعة حديثًا (File object)
                  <Img
                    imgsrc={URL.createObjectURL(goalsimage)}
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : (
                  // عرض زر الرفع في حالة عدم وجود صورة
                  <div className="w-full mt-4 h-[41vh] border-2 border-dashed border-sky-400 flex items-center justify-center cursor-pointer ">
                    <FaPlusCircle className="size-8 text-sky-400" />
                  </div>
                )}
              </div>
            </div>

            {/* قسم قيم الشركة */}
            <div className="w-full pb-4 border-b-2 border-sky-500 h-[48vh] max-lg:h-fit overflow-hidden gap-4 my-2 max-lg:flex-col flex items-end justify-between">
              <div className="w-full">
                <div className="w-full mb-4">
                  <label htmlFor="value_en" className="text-[18px] py-2 ">
                    {language === "ar" ? "قيم الشركة" : "Company Values"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="value_en"
                    name="value_en"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.value_en}
                  />
                </div>
                <div className="w-full mb-4">
                  <label htmlFor="value_ar" className="text-[18px] py-2 ">
                    {language === "ar"
                      ? "قيم الشركة (Arabic)"
                      : "Company Values (English)"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="value_ar"
                    name="value_ar"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.value_ar}
                  />
                </div>
              </div>
              {/* صورة قيم الشركة */}

              <div
                onClick={() => openinputvalue.current.click()}
                className="w-full flex items-center justify-center group cursor-pointer h-full"
              >
                {typeof valueimage === "string" ? (
                  // عرض الصورة إذا كانت من نوع string (رابط)
                  <Img
                    imgsrc={valueimage}
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : valueimage instanceof File ? (
                  // عرض الصورة إذا كانت مرفوعة حديثًا (File object)
                  <Img
                    imgsrc={URL.createObjectURL(valueimage)}
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : (
                  // عرض زر الرفع في حالة عدم وجود صورة
                  <div className="w-full mt-4 h-[41vh] border-2 border-dashed border-sky-400 flex items-center justify-center cursor-pointer ">
                    <FaPlusCircle className="size-8 text-sky-400" />
                  </div>
                )}
              </div>
            </div>

            {/* قسم رؤية الشركة */}
            <div className="w-full pb-4 border-b-2 border-sky-500 h-[48vh] max-lg:h-fit overflow-hidden gap-4 my-2 max-lg:flex-col flex items-end justify-between">
              <div className="w-full">
                <div className="w-full mb-4">
                  <label htmlFor="vision_en" className="text-[18px] py-2 ">
                    {language === "ar" ? "رؤية الشركة" : "Company Vision"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="vision_en"
                    name="vision_en"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.vision_en}
                  />
                </div>
                <div className="w-full mb-4">
                  <label htmlFor="vision_ar" className="text-[18px] py-2 ">
                    {language === "ar"
                      ? "رؤية الشركة (Arabic)"
                      : "Company Vision (English)"}
                  </label>
                  <textarea
                    onChange={handleChange}
                    id="vision_ar"
                    name="vision_ar"
                    className="text-xl h-[17vh] px-4 py-2 w-full border border-gray-300 dark:text-secend_text dark:bg-main_dash dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                    value={form.vision_ar}
                  />
                </div>
              </div>
              {/* صورة رؤية الشركة */}

              <div
                onClick={() => openinputvision.current.click()}
                className="w-full flex items-center justify-center group cursor-pointer h-full"
              >
                {typeof aboutimage === "string" ? (
                  // عرض الصورة إذا كانت من نوع string (رابط)
                  <Img
                    imgsrc={valueimage}
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : valueimage instanceof File ? (
                  // عرض الصورة إذا كانت مرفوعة حديثًا (File object)
                  <Img
                    imgsrc={URL.createObjectURL(valueimage)}
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : (
                  // عرض زر الرفع في حالة عدم وجود صورة
                  <div className="w-full mt-4 h-[41vh] border-2 border-dashed border-sky-400 flex items-center justify-center cursor-pointer ">
                    <FaPlusCircle className="size-8 text-sky-400" />
                  </div>
                )}
              </div>
            </div>

            <input
              type="file"
              ref={openinputabout}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setaboutimage)}
            />
            <input
              type="file"
              ref={openinputvalue}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setvalueimage)}
            />
            <input
              type="file"
              ref={openinputvision}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setvisionimage)}
            />
            <input
              type="file"
              ref={openinputgoals}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setgoalsimage)}
            />
            {/* يمكن إضافة قسم لصورة الأهداف هنا */}

            <div className="w-1/2 mx-auto my-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 w-full mx-auto rounded  mt-4"
              >
                {language === "ar" ? "حفظ" : "Save"}
              </button>
            </div>

            {done && <p className="text-green-500">{done}</p>}
            {generalError && <p className="text-red-500">{generalError}</p>}
          </form>
        </div>
      )}
    </>
  );
}
