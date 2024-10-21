/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Img from "@/app/_componants/Image";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
// import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";

export default function EditSubService({ params }) {
  const { language } = Usevariables();
  const id = params.subserviceid; // ID الخدمة الفرعية
  const openInput = useRef(null);
  const openInputIcon = useRef(null);

  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
  });

  const [icon, setIcon] = useState(null);
  const [images, setImages] = useState([]);
  const [done, setDone] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSubServiceData = async () => {
      try {
        const response = await instance.get(`/sub-service/${id}`);
        const subService = response.data.data;

        setForm({
          title_en: subService.title_en,
          title_ar: subService.title_ar,
          description_en: subService.description_en,
          description_ar: subService.description_ar,
        });

        setImages(subService.images || []);
        setIcon(subService.image || null);
      } catch (error) {
        console.error("Error fetching sub-service data", error);
      }
    };

    fetchSubServiceData();
  }, [id]);

  const handleDeleteImage = (index) => {
    // تصفية الصور لحذف الصورة المحددة
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages); // تحديث الحالة للمصفوفة الجديدة
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        setIcon(selectedFile);
      } else {
        alert("Please select a valid image file.");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title_en", form.title_en);
    formData.append("title_ar", form.title_ar);
    formData.append("description_en", form.description_en);
    formData.append("description_ar", form.description_ar);

    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    if (typeof icon != "string") {
      formData.append("image", icon);
    }

    try {
      const response = await instance.post(`/sub-service/${id}`, formData);
      console.log(response.data);
      setDone(
        language === "en"
          ? "Sub-Service updated successfully!"
          : "تم تعديل الخدمة الفرعية بنجاح!"
      );
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };

  console.log(images);

  return (
    <div className="w-full mt-16 mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {language === "en" ? "Edit Sub-Service" : "تعديل الخدمة الفرعية"}
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
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="title_ar"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Title" : "العنوان"}(عربى)
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
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
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
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description_ar"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Description" : "الوصف"}(عربى)
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
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        {/* رفع الأيقونة */}
        <div>
          <label
            id="iconImg"
            className="block text-sm font-medium text-gray-700"
          >
            {language === "en" ? "Sub-Service Icon" : "أيقونة الخدمة الفرعية"}
          </label>
          <div
            onClick={() => openInputIcon.current?.click()}
            className={`mt-1 flex items-center overflow-hidden justify-center cursor-pointer border-2 border-dashed ${
              errors.images ? "border-red-400" : "border-sky-400"
            } w-full h-[30vh]`}
          >
            {typeof icon === "string" ? (
              <Img styles="w-[90px]" imgsrc={icon} />
            ) : icon instanceof File ? (
              <Img imgsrc={URL.createObjectURL(icon)} styles="w-[90px]" />
            ) : (
              <FaPlusCircle
                className={`size-12 ${
                  errors.images ? "text-red-400" : "text-sky-500"
                }`}
              />
            )}
          </div>
          <input
            hidden
            ref={openInputIcon}
            type="file"
            name="icon"
            id="iconImg"
            onChange={handleIconChange}
          />
          {errors.icon && <p className="text-red-600 text-sm">{errors.icon}</p>}
        </div>

        {/* رفع الصور */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {language === "en" ? "Images" : "الصور"}
          </label>
          <div>
            <div className="image-list w-full z-[99]">
              {images.length > 0 && (
                <>
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="image-item flex shadow-md rounded-md justify-between pr-4 border border-gray-300 items-center mb-2"
                    >
                      {typeof img === "string" ? (
                        <Img imgsrc={img} styles="w-[90px]" />
                      ) : (
                        <Img
                          imgsrc={URL.createObjectURL(img)}
                          styles="w-[90px]"
                        />
                      )}
                      <button
                        className="ml-2 text-red-500"
                        onClick={() => handleDeleteImage(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => openInput.current?.click()} // استدعاء لفتح مربع اختيار الصور
                    className="mt-2 bg-sky-500 text-white px-4 py-2 rounded"
                  >
                    {language == "en" ? "Add Images" : "إضافة صور"}
                  </button>
                </>
              )}
            </div>

            {images.length === 0 && (
              <div
                onClick={() => openInput.current?.click()}
                className={`mt-1 flex items-center overflow-hidden justify-center cursor-pointer border-2 border-dashed ${
                  errors.images ? "border-red-400" : "border-sky-400"
                } w-full h-[40vh] px-4`}
              >
                <FaPlusCircle
                  className={`size-12 ${
                    errors.images ? "text-red-400" : "text-sky-500"
                  }`}
                />
              </div>
            )}

            <input
              type="file"
              ref={openInput}
              style={{ display: "none" }}
              onChange={(e) => {
                const newImages = Array.from(e.target.files);
                setImages((prevImages) => [...prevImages, ...newImages]);
              }}
            />
          </div>
          <input
            hidden
            ref={openInput}
            type="file"
            multiple
            onChange={handleImageChange}
          />
          {errors.images && (
            <p className="text-red-600 text-sm">{errors.images}</p>
          )}
        </div>

        {/* زر إرسال */}
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          {language === "en" ? "Update Sub-Service" : "تحديث الخدمة الفرعية"}
        </button>
      </form>
    </div>
  );
}
