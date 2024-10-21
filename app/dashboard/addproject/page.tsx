/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import React, { useEffect, useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";

export default function AddProject() {
  const { language } = Usevariables();
  const openinput = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    completion_date: "",
    project_link: "",
    client_name: "",
    category: "",
    video_link: "",
    awards: "",
    technologies_used: [],
  });
  const [image, setImage] = useState<File | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [services, setservices] = useState<Record<string, any>[]>([]);
  const [skill, setSkill] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImage(files[0]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skill.trim()) {
      e.preventDefault();
      setSkills([...skills, skill]);
      setSkill("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title_ar", form.title_ar);
    formData.append("title_en", form.title_en);
    formData.append("description_ar", form.description_ar);
    formData.append("description_en", form.description_en);
    formData.append("completion_date", form.completion_date);
    formData.append("project_link", form.project_link);
    formData.append("client_name", form.client_name);
    formData.append("category", form.category);
    formData.append("video_link", form.video_link);
    formData.append("awards", form.awards);
    formData.append("technologies_used", JSON.stringify(skills));

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await instance.post("/store-project", formData);
      console.log(response.data);
      alert(
        language === "en"
          ? "Project added successfully!"
          : "تمت إضافة المشروع بنجاح!"
      );
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
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

  return (
    <div className="w-full mt-16 mx-auto p-6 bg-white dark:bg-secend_dash dark:text-secend_text shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        {language === "en"
          ? "Add Project to Portfolio"
          : "إضافة مشروع إلى معرض الأعمال"}
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* حقل العنوان */}
        <div>
          <label
            htmlFor="title_en"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language === "en" ? "Project Title" : "العنوان"}
          </label>
          <input
            type="text"
            name="title_en"
            id="title_en"
            value={form.title_en}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en" ? "Enter project title" : "أدخل عنوان المشروع"
            }
          />
          {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language === "en" ? "Project Title(Arabic)" : "(عربى)العنوان"}
          </label>
          <input
            type="text"
            name="title_ar"
            id="name"
            value={form.title_ar}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en" ? "Enter project title" : "أدخل عنوان المشروع"
            }
          />
          {errors.name && <p className="text-red-500">{errors.name[0]}</p>}
        </div>

        {/* حقل الوصف */}
        <div>
          <label
            htmlFor="description_en"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language === "en" ? "Description" : "الوصف"}
          </label>
          <textarea
            name="description_en"
            id="description_en"
            value={form.description_en}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en"
                ? "Enter project description"
                : "أدخل وصف المشروع"
            }
          />
          {errors.description && (
            <p className="text-red-500">{errors.description[0]}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language === "en" ? "Description(Arabic)" : "(عربى)الوصف"}
          </label>
          <textarea
            name="description_ar"
            id="description"
            value={form.description_ar}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en"
                ? "Enter project description"
                : "أدخل وصف المشروع"
            }
          />
          {errors.description && (
            <p className="text-red-500">{errors.description[0]}</p>
          )}
        </div>

        {/* حقل القسم */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language === "en" ? "Service" : "الخدمة"}
          </label>
          <select
            onChange={handleChange}
            name="category"
            className="w-full outline-none rounded-md border border-gray-300 dark:bg-main_dash dark:text-white py-2"
          >
            <option>
              {language === "en"
                ? "Choose a service"
                : "إختر الخدمة الخاصة بالمشروع"}
            </option>
            {services &&
              services.map((service, index) => (
                <option
                  className="text-black"
                  value={service.title_en}
                  key={index}
                >
                  {language === "en" ? service.title_en : service.title_ar}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-red-500">{errors.category[0]}</p>
          )}
        </div>

        {/* تاريخ الانتهاء */}
        <div>
          <label
            htmlFor="completion_date"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language == "en" ? "End Date" : "تاريخ الانتهاء"}
          </label>
          <input
            type="date"
            name="completion_date"
            id="completion_date"
            value={form.completion_date}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* رابط المشروع */}
        <div>
          <label
            htmlFor="project_link"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language == "en"
              ? "Project Link (Optional)"
              : " (إختيارى) رابط المشروع"}
          </label>
          <input
            type="url"
            name="project_link"
            id="project_link"
            value={form.project_link}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="أدخل رابط المشروع"
          />
        </div>

        <div>
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700 dark:text-secend_text"
          >
            {language == "en" ? "Skills" : "المهارات"}
          </label>
          <input
            type="text"
            id="skills"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="أدخل مهارة واضغط Enter"
          />

          <div className="mt-2">
            {skills.map((sk, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* رفع الصورة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-secend_text">
            {language == "en" ? "Project Image" : "صورة المشروع"}
          </label>
          <div
            onClick={() => openinput.current?.click()}
            className="mt-1 outline-none flex items-center justify-center cursor-pointer border-2 border-dashed border-sky-400 w-full h-[30vh]"
          >
            {image ? (
              <Img
                imgsrc={URL.createObjectURL(image)}
                styles="w-[250px] object-contain"
              />
            ) : (
              <FaPlusCircle className="size-12 text-sky-500 " />
            )}
          </div>
          <input
            hidden
            ref={openinput}
            type="file"
            name="projectimg"
            id="projectimg"
            accept="image/*"
            onChange={handleImageChange}
          />
          {errors.image && <p className="text-red-500">{errors.image[0]}</p>}{" "}
          {/* عرض خطأ */}
        </div>

        {/* زر الإرسال */}
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {language === "en" ? "Add Project" : "إضافة المشروع"}
          </button>
        </div>
      </form>
    </div>
  );
}
