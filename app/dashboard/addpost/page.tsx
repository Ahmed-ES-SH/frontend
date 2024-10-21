/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import React, { useRef, useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function Addpost() {
  const { language } = Usevariables();
  const openinput = useRef<any | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    published_date: "",
    category: "",
    status: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setloading] = useState<boolean>(false);
  const [services, setservices] = useState<Record<string, any>[]>([]);
  const [image, setImage] = useState<File | null>(null);

  // تحديث الحقول النصية
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // تحديث الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImage(files[0]);
    }
  };

  useEffect(() => {
    const getservices = async () => {
      const response = await instance
        .get("/services")
        .then((data) => setservices(data.data.data));
      throw response;
    };
    getservices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title_ar", form.title_ar);
    formData.append("title_en", form.title_en);
    formData.append("content_ar", form.description_ar);
    formData.append("content_en", form.description_en);
    formData.append("author", "admin");
    formData.append("published_date", form.published_date);
    formData.append("category", form.category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await instance.post("/blog-post-add", formData);
      console.log(response.data);
      setShowPopup(true);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <div className="w-[95%] mt-16 mx-auto flex flex-col py-2  items-start justify-between bg-white dark:bg-secend_dash dark:text-secend_text shadow-lg rounded-lg overflow-hidden">
          <h1 className="w-fit mx-auto text-xl font-semibold">
            {language === "en" ? "Add New Article" : "أضف مقال جديد"}
          </h1>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="p-8 w-full">
              <div className="w-full mb-4">
                <label htmlFor="title" className="text-[18px] py-2 ">
                  {language === "en" ? "Article Title" : "عنوان المقال"}
                </label>
                <input
                  onChange={handleChange}
                  id="title"
                  name="title_ar"
                  className="text-xl px-4 placeholder-shown:px-4 py-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.title_ar}
                />
              </div>
              <div className="w-full mb-4">
                <label htmlFor="title" className="text-[18px] py-2 ">
                  (English){" "}
                  {language === "en" ? "Article Title" : "عنوان المقال"}
                </label>
                <input
                  onChange={handleChange}
                  id="title"
                  name="title_en"
                  className="text-xl px-4 placeholder-shown:px-4 py-2 w-full border border-gray-300 dark:border-gray-600 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.title_en}
                />
              </div>

              <div className="w-full mb-4">
                <label htmlFor="description" className="text-[18px] py-2 ">
                  {language === "en" ? "Article Content" : "محتوى المقال"}
                </label>
                <textarea
                  onChange={handleChange}
                  id="description"
                  name="description_ar"
                  className="text-xl h-[60px] px-4 py-2 placeholder-shown:px-4 w-full border border-gray-300 dark:border-gray-600 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.description_ar}
                />
              </div>
              <div className="w-full mb-4">
                <label htmlFor="description" className="text-[18px] py-2 ">
                  (English){" "}
                  {language === "en" ? "Article Content" : "محتوى المقال"}
                </label>
                <textarea
                  onChange={handleChange}
                  id="description"
                  name="description_en"
                  className="text-xl h-[60px] px-4 py-2 placeholder-shown:px-4 w-full border border-gray-300 dark:border-gray-600 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.description_en}
                />
              </div>

              <div>
                <label
                  htmlFor="published_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  {language == "en" ? "published_date" : "تاريخ النشر"}
                </label>
                <input
                  type="date"
                  name="published_date"
                  id="published_date"
                  value={form.published_date}
                  onChange={handleChange}
                  className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-main_dash dark:text-secend_text rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="my-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  {language === "en" ? "Article Status" : "حالة المقال"}
                </label>
                <select
                  id="status"
                  className="w-full rounded-md p-2 outline-none border border-gray-300 dark:border-gray-600 dark:bg-main_dash dark:text-secend_text shadow-md"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    {language === "en"
                      ? "Select Post Status"
                      : "إختر حالة المقال"}
                  </option>

                  <option value={"draft"}>
                    {language === "en" ? "Draft" : "مسودة"}
                  </option>
                  <option value={"archived"}>
                    {language === "en" ? "Archived" : "أرشيف"}
                  </option>
                  <option value={"publish"}>
                    {language === "en" ? "Publish" : "نشر"}
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  {language === "en" ? "Service" : "الخدمة"}
                </label>
                <select
                  onChange={handleChange}
                  name="category"
                  className="w-full outline-none p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-main_dash dark:text-secend_text py-2"
                >
                  <option>
                    {language === "en"
                      ? "Choose a service"
                      : "إختر الخدمة الخاصة بالمقال"}
                  </option>
                  {services &&
                    services.map((service, index) => (
                      <option
                        className="text-black dark:text-white"
                        value={service.title_en}
                        key={index}
                      >
                        {language === "en"
                          ? service.title_en
                          : service.title_ar}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <p className="text-red-500">{errors.category[0]}</p>
                )}
              </div>

              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                {language === "en" ? "Article Image" : "صورة المقال"}
              </label>
              <div
                onClick={() => openinput.current.click()}
                className="w-full group cursor-pointer"
              >
                {image ? (
                  <Img
                    imgsrc={URL.createObjectURL(image)}
                    styles="w-[300px] group-hover:border-sky-400 border  border-transparent mx-auto h-80 object-cover"
                  />
                ) : (
                  <div className="w-full mt-4 h-[30vh] border-2 border-dashed border-sky-400 flex items-center justify-center cursor-pointer ">
                    <FaPlusCircle className="size-8 text-sky-400" />
                  </div>
                )}
              </div>

              {/* زر إضافة */}
              <div className="w-fit mt-4 mr-auto">
                <button className="bg-green-600 w-fit mr-auto text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition">
                  {language === "en" ? "Add" : "إضافة"}
                </button>
              </div>
            </div>

            <input
              type="file"
              name="image"
              id="image"
              ref={openinput}
              hidden
              onChange={handleImageChange}
            />
          </form>
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h2 className="text-lg font-semibold">
                  {language === "en" ? "Success" : "نجاح"}
                </h2>
                <p>
                  {language === "en"
                    ? "The article has been successfully added."
                    : "تمت إضافة المقال بنجاح."}
                </p>
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  {language === "en" ? "Close" : "إغلاق"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
