/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import React, { useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";

export default function AddSubService({ params }) {
  const serviceId = params.serviceid;
  const { language } = Usevariables();
  const openinput = useRef<HTMLInputElement>(null);
  const openinput_2 = useRef<HTMLInputElement>(null);
  const [Errors, setErrors] = useState<Record<string, string>>({});
  const [done, setdone] = useState<string>("");
  const [icon, seticon] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        seticon(selectedFile);
      } else {
        alert("Please select a valid image file.");
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title_en", form.title_en);
    formData.append("title_ar", form.title_ar);
    formData.append("description_en", form.description_en);
    formData.append("description_ar", form.description_ar);
    if (icon) {
      formData.append("image", icon);
    }
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const response = await instance.post(
        `/sub-service-add/${serviceId}`,
        formData
      );
      setdone(
        language === "en"
          ? "Sub-service added successfully!"
          : "تمت إضافة الخدمة الفرعية بنجاح!"
      );

      setForm({
        title_en: "",
        title_ar: "",
        description_en: "",
        description_ar: "",
      });
      setImages([]);
      seticon(null);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full mt-16 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {language === "en" ? "Add New Sub-Service" : "إضافة خدمة فرعية جديدة"}
      </h1>
      {done && <p className="text-green-400 text-center text-[18px]">{done}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* حقل العنوان */}
        <div>
          <label
            htmlFor="title_en"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Title" : "العنوان"}
          </label>
          <input
            type="text"
            name="title_en"
            id="title_en"
            value={form.title_en}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en"
                ? "Enter sub-service title"
                : "أدخل عنوان الخدمة الفرعية"
            }
          />
          {Errors.title && (
            <p className="text-red-600 text-sm">{Errors.title}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="title_ar"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Title (Arabic)" : "العنوان (عربى)"}
          </label>
          <input
            type="text"
            name="title_ar"
            id="title_ar"
            value={form.title_ar}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en"
                ? "Enter sub-service title"
                : "أدخل عنوان الخدمة الفرعية"
            }
          />
          {Errors.title && (
            <p className="text-red-600 text-sm">{Errors.title}</p>
          )}
        </div>

        {/* حقل الوصف */}
        <div>
          <label
            htmlFor="description_en"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Description" : "الوصف"}
          </label>
          <textarea
            name="description_en"
            id="description_en"
            value={form.description_en}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en"
                ? "Enter sub-service description"
                : "أدخل وصف الخدمة الفرعية"
            }
          />
          {Errors.description && (
            <p className="text-red-600 text-sm">{Errors.description}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description_ar"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Description (Arabic)" : "الوصف (عربى)"}
          </label>
          <textarea
            name="description_ar"
            id="description_ar"
            value={form.description_ar}
            onChange={handleChange}
            className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={
              language === "en"
                ? "Enter sub-service description"
                : "أدخل وصف الخدمة الفرعية"
            }
          />
          {Errors.description && (
            <p className="text-red-600 text-sm">{Errors.description}</p>
          )}
        </div>

        {/* رفع الايقونة */}
        <div>
          <label
            id="iconeimg"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Sub-service icon" : "أيقونة الخدمة الفرعية"}
          </label>
          <div
            onClick={() => openinput_2.current?.click()}
            className={`mt-1 flex items-center overflow-hidden justify-center cursor-pointer border-2 border-dashed ${
              Errors.icon ? "border-red-400" : "border-sky-400"
            } w-full h-[30vh]`}
          >
            {icon ? (
              <Img imgsrc={URL.createObjectURL(icon)} styles="w-[90px]" />
            ) : (
              <FaPlusCircle
                className={`size-12 ${
                  Errors.icon ? "text-red-400" : "text-sky-500"
                }`}
              />
            )}
          </div>
          <input
            hidden
            ref={openinput_2}
            type="file"
            name="icon"
            id="iconeimg"
            onChange={handleImage}
          />
          {Errors.icon && <p className="text-red-600 text-sm">{Errors.icon}</p>}
        </div>

        {/* رفع الصور المتعددة */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {language === "en" ? "Sub-service Images" : "صور الخدمة الفرعية"}
          </label>
          <div
            onClick={() => openinput.current?.click()}
            className={`mt-1 flex items-center overflow-hidden justify-center cursor-pointer border-2 border-dashed ${
              Errors.images ? "border-red-400" : "border-sky-400"
            } w-full h-[30vh]`}
          >
            {images.length > 0 ? (
              <div className="flex items-center gap-3">
                {images.map((img, index) => (
                  <Img
                    key={index}
                    imgsrc={URL.createObjectURL(img)}
                    styles="w-[150px]"
                  />
                ))}
              </div>
            ) : (
              <FaPlusCircle
                className={`size-12 ${
                  Errors.images ? "text-red-400" : "text-sky-500"
                }`}
              />
            )}
          </div>
          <input
            hidden
            ref={openinput}
            type="file"
            name="images"
            multiple
            id="images"
            onChange={handleImageChange}
          />
          {Errors.images && (
            <p className="text-red-600 text-sm">{Errors.images}</p>
          )}
        </div>

        {/* زر الحفظ */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          {language === "en" ? "Add Sub-Service" : "إضافة خدمة فرعية"}
        </button>
      </form>
    </div>
  );
}
