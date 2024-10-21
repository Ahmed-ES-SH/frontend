/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import React, { useRef, useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function EditPost({ params }) {
  const { language } = Usevariables();
  const openinput = useRef<any | null>(null);
  const [loading, setloading] = useState<boolean>(true);
  const postId = params.blogid;
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
  const [services, setServices] = useState<Record<string, any>[]>([]);
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

  // جلب بيانات المقال عند التحميل
  useEffect(() => {
    const fetchPost = async () => {
      const response = await instance.get(`/blog-posts/${postId}`);
      const post = response.data.data;

      setForm({
        title_ar: post.title_ar,
        title_en: post.title_en,
        description_ar: post.content_ar,
        description_en: post.content_en,
        published_date: post.published_date.split("T")[0], // الحصول على التاريخ فقط
        category: post.category,
        status: post.status,
      });
      setImage(post.image); // يمكن تعيين الصورة من جديد إذا لزم الأمر
      setloading(false);
    };

    const getServices = async () => {
      const response = await instance.get("/services");
      setServices(response.data.data);
    };

    fetchPost();
    getServices();
  }, [postId, loading]);

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
      setloading(true);
      const response = await instance.post(`/blog-posts/${postId}`, formData);
      console.log(response.data);
      alert(
        language === "en"
          ? "Post updated successfully!"
          : "تم تحديث المقال بنجاح!"
      );
      setloading(false);
    } catch (error: any) {
      setloading(false);
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
        <div className="w-[95%] mt-16 mx-auto flex flex-col py-2 items-start justify-between bg-white dark:bg-secend_dash dark:text-secend_text shadow-lg rounded-lg overflow-hidden">
          <h1 className="w-fit mx-auto text-xl font-semibold">
            {language === "en" ? "Edit Article" : "تعديل المقال"}
          </h1>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="p-8 w-full">
              <div className="w-full mb-4">
                <label htmlFor="title_ar" className="text-[18px] py-2 ">
                  {language === "en"
                    ? "Article Title (Arabic)"
                    : "عنوان المقال (بالعربية)"}
                </label>
                <input
                  onChange={handleChange}
                  id="title_ar"
                  name="title_ar"
                  className="text-xl px-4 py-2 w-full border border-gray-300 dark:bg-main_dash dark:text-white dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.title_ar}
                />
              </div>
              <div className="w-full mb-4">
                <label htmlFor="title_en" className="text-[18px] py-2 ">
                  {language === "en"
                    ? "Article Title (English)"
                    : "عنوان المقال (بالإنجليزية)"}
                </label>
                <input
                  onChange={handleChange}
                  id="title_en"
                  name="title_en"
                  className="text-xl px-4 py-2 w-full border border-gray-300 dark:bg-main_dash dark:text-white dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.title_en}
                />
              </div>

              <div className="w-full mb-4">
                <label htmlFor="description_ar" className="text-[18px] py-2 ">
                  {language === "en"
                    ? "Article Content (Arabic)"
                    : "محتوى المقال (بالعربية)"}
                </label>
                <textarea
                  onChange={handleChange}
                  id="description_ar"
                  name="description_ar"
                  className="text-xl h-[60px] px-4 py-2 w-full border border-gray-300 dark:bg-main_dash dark:text-white dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.description_ar}
                />
              </div>
              <div className="w-full mb-4">
                <label htmlFor="description_en" className="text-[18px] py-2 ">
                  {language === "en"
                    ? "Article Content (English)"
                    : "محتوى المقال (بالإنجليزية)"}
                </label>
                <textarea
                  onChange={handleChange}
                  id="description_en"
                  name="description_en"
                  className="text-xl h-[60px] px-4 py-2 w-full border border-gray-300 dark:bg-main_dash dark:text-white dark:border-gray-600 shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.description_en}
                />
              </div>

              <div>
                <label
                  htmlFor="published_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  {language == "en" ? "Published Date" : "تاريخ النشر"}
                </label>
                <input
                  type="date"
                  name="published_date"
                  id="published_date"
                  value={form.published_date}
                  onChange={handleChange}
                  className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                  className="w-full rounded-md p-2 border border-gray-300 dark:bg-main_dash dark:text-white dark:border-gray-600 shadow-md"
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
                  className="w-full border border-gray-300 dark:bg-main_dash dark:text-white dark:border-gray-600 rounded-md py-2"
                  value={form.category}
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
                {typeof image == "string" ? ( // إذا كانت هناك صورة في الاستجابة
                  <Img
                    imgsrc={image} // استخدام الرابط من الاستجابة
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : image instanceof File ? ( // إذا لم تكن هناك صورة من الاستجابة، ولكن هناك صورة مختارة
                  <Img
                    imgsrc={URL.createObjectURL(image)} // استخدام URL.createObjectURL للصورة المختارة
                    styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
                  />
                ) : (
                  // إذا لم يكن هناك صورة من الاستجابة أو صورة مختارة
                  <div className="w-full mt-4 h-[30vh] border-2 border-dashed border-sky-400 flex items-center justify-center cursor-pointer">
                    <FaPlusCircle className="size-8 text-sky-400" />
                  </div>
                )}
              </div>

              <input
                ref={openinput}
                type="file"
                hidden
                onChange={handleImageChange}
              />

              <div className="flex items-center justify-center my-4">
                <button
                  type="submit"
                  className="flex items-center justify-center text-white bg-green-500 hover:bg-green-700 rounded-md px-4 py-2"
                >
                  {language === "en" ? "Update Article" : "تحديث المقال"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
