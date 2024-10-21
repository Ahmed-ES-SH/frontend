/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import React, { useEffect, useRef, useState } from "react";
import { FaX } from "react-icons/fa6";
import { Usevariables } from "@/app/context/VariablesProvider"; // استيراد Usevariables
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";

export default function ProjectDetail({ params }: any) {
  const { language } = Usevariables(); // استخدام متغير اللغة
  const id = params.projectid;
  const openinput = useRef<any>(null);
  const [form, setForm] = useState<any>({
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
    skills: [],
  });
  const [image, setImage] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState<string>("");
  const [loading, setloading] = useState<boolean>(true);
  const [done, setdone] = useState<string>("");
  const [services, setservices] = useState<Record<string, any>[]>([]);
  const [errors, seterrors] = useState<any>({});
  const [generalError, setGeneralError] = useState<string>("");

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

  // إضافة مهارة جديدة
  const handleAddSkill = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (newSkill.trim() !== "") {
      setForm({ ...form, skills: [...form.skills, newSkill] });
      setNewSkill(""); // إعادة تعيين حقل الإدخال
    }
  };

  // حذف مهارة
  const handleRemoveSkill = (index: number) => {
    const updatedSkills = form.skills.filter((_, i) => i !== index);
    setForm({ ...form, skills: updatedSkills });
  };

  useEffect(() => {
    const getservices = async () => {
      try {
        const response = await instance.get("/services");
        setservices(response.data.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    getservices();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await instance.get(`/project/${id}`);
        const projectData = response.data.data; // تأكد من أن البنية صحيحة
        setImage(projectData.image);
        // إعداد البيانات بناءً على اللغة
        setForm({
          title_en: projectData.title_en,
          title_ar: projectData.title_ar,
          description_en: projectData.description_en,
          description_ar: projectData.description_ar,
          skills: projectData.technologies_used,
          completion_date: projectData.completion_date,
          project_link: projectData.project_link || "",
          client_name: projectData.client_name || "",
          category: projectData.category || "",
          video_link: projectData.video_link || "",
          awards: projectData.awards || "",
        });
        setloading(false);
      } catch (error) {
        setloading(false);
        setGeneralError(
          language === "ar"
            ? "حدث خطأ في جلب بيانات المشروع"
            : "Error fetching project data"
        );
        throw error;
      }
    };

    fetchProject();
  }, [id, language]);

  const handlesubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    setGeneralError(""); // إعادة تعيين الأخطاء العامة
    seterrors({}); // إعادة تعيين أخطاء الحقول

    const formdata = new FormData();
    formdata.append("title_en", form.title_en);
    formdata.append("title_ar", form.title_ar);
    formdata.append("description_en", form.description_en);
    formdata.append("description_ar", form.description_ar);
    if (form.project_link !== "") {
      formdata.append("project_link", form.project_link);
    }
    if (form.category !== "") {
      formdata.append("category", form.category);
    }
    if (form.completion_date !== "") {
      formdata.append("completion_date", form.completion_date);
    }
    if (image) {
      formdata.append("image", image);
    }

    formdata.append("technologies_used", JSON.stringify(form.skills));

    try {
      await instance.post(`/project/${id}`, formdata);
      setloading(false);
      setdone(
        language == "en"
          ? "The Project Updated Successfully"
          : "تم تحديث المشروع بنجاح "
      );
    } catch (error: any) {
      setloading(false);
      if (error.response && error.response.status === 422) {
        seterrors(error.response.data.errors); // أخطاء التحقق من الحقول
      } else {
        setGeneralError(
          language === "ar"
            ? "حدث خطأ أثناء تحديث المشروع"
            : "Error updating the project"
        );
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
        <div className="w-[95%] mt-20 mx-auto flex flex-col py-2 items-start justify-between bg-white dark:bg-secend_dash dark:text-secend_text shadow-lg rounded-lg overflow-hidden">
          <h1 className="text-2xl  border-b-2 pb-2 border-sky-400  text-center w-fit mx-auto my-4 ">
            {language == "en" ? "Edit Project Page" : "تعديل بيانات المشروع"}
          </h1>

          {/* الصورة */}
          <div
            onClick={() => openinput.current.click()}
            className="w-full group cursor-pointer"
          >
            {typeof image === "object" && image !== null ? ( // تحقق مما إذا كانت الصورة كائنًا
              <Img
                imgsrc={URL.createObjectURL(image)}
                styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
              />
            ) : (
              <Img
                imgsrc={image ? image : "/portfoliosection/2.jpg"} // استخدم الصورة القادمة من API
                styles="w-[300px] group-hover:border-sky-400 border border-transparent mx-auto h-80 object-cover"
              />
            )}
            {errors.image && <p className="text-red-500">{errors.image[0]}</p>}
          </div>
          {/* تفاصيل المشروع */}
          <form onSubmit={handlesubmit} className="w-full">
            <div className="p-8 w-full">
              <div className="w-full mb-4">
                <label htmlFor="title" className="text-[18px] py-2 ">
                  {language === "ar" ? "العنوان" : "Title"}
                </label>
                <input
                  onChange={handleChange}
                  id="title"
                  name="title_en"
                  className="text-xl px-4 placeholder-shown:px-4 h-[60px] w-full border border-gray-300 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.title_en}
                />
                {errors.title_en && (
                  <p className="text-red-500">{errors.title_en[0]}</p>
                )}
              </div>
              <div className="w-full mb-4">
                <label htmlFor="title" className="text-[18px] py-2 ">
                  {language === "ar" ? "(عربى)العنوان" : "Title(Arabic)"}
                </label>
                <input
                  onChange={handleChange}
                  id="title"
                  name="title_ar"
                  className="text-xl px-4 placeholder-shown:px-4 h-[60px] w-full border border-gray-300 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.title_ar}
                />
                {errors.title_ar && (
                  <p className="text-red-500">{errors.title_ar[0]}</p>
                )}
              </div>

              <div className="w-full mb-4">
                <label htmlFor="description" className="text-[18px] py-2 ">
                  {language === "ar" ? "الوصف" : "Description"}
                </label>
                <textarea
                  onChange={handleChange}
                  id="description"
                  name="description_en"
                  className="text-xl px-4 placeholder-shown:px-4 h-[60px] w-full border border-gray-300 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.description_en}
                />
                {errors.description_en && (
                  <p className="text-red-500">{errors.description_en[0]}</p>
                )}
              </div>

              <div className="w-full mb-4">
                <label htmlFor="description_ar" className="text-[18px] py-2 ">
                  {language === "ar" ? "(عربى)الوصف" : "Description(Arabic)"}
                </label>
                <textarea
                  onChange={handleChange}
                  id="description_ar"
                  name="description_ar"
                  className="text-xl h-[60px] px-4 py-2 placeholder-shown:px-4 w-full border border-gray-300 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.description_ar}
                />
                {errors.description_ar && (
                  <p className="text-red-500">{errors.description_ar[0]}</p>
                )}
              </div>

              <div className="w-full mb-4">
                <label htmlFor="project_link" className="text-[18px] py-2 ">
                  {language === "ar"
                    ? "(إختيارى)رابط المشروع "
                    : "project link(Optional)"}
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  id="project_link"
                  name="project_link"
                  className="text-xl h-[60px] px-4 py-2 placeholder-shown:px-4 w-full border border-gray-300 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                  value={form.project_link}
                />
                {errors.project_link && (
                  <p className="text-red-500">{errors.project_link[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="completion_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  {language == "en" ? "End Date" : "تاريخ الانتهاء"}
                </label>
                <input
                  type="date"
                  name="completion_date"
                  id="completion_date"
                  value={form.completion_date}
                  onChange={handleChange}
                  className="mt-1 outline-none block w-full px-4 py-2 border border-gray-300 dark:bg-main_dash dark:text-secend_text rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.completion_date && (
                  <p className="text-red-500">{errors.completion_date[0]}</p>
                )}
              </div>

              {/* حقل القسم */}
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
                  className="w-full outline-none rounded-md border border-gray-300 dark:bg-main_dash dark:text-secend_text py-2"
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

              {/* المهارات */}
              <div className="flex flex-wrap gap-3 mb-6 mt-7">
                {form.skills.map((skill, index) => (
                  <div key={index} className="group relative">
                    <span className="bg-sky-400 text-white text-sm px-4 py-2 rounded-md">
                      {skill}
                    </span>
                    <FaX
                      className="size-4 invisible group-hover:visible duration-200 cursor-pointer absolute left-1/2 -translate-x-1/2 -bottom-6 text-red-400"
                      onClick={() => handleRemoveSkill(index)}
                    />
                  </div>
                ))}
                {errors.technologies_used && (
                  <p className="text-red-500">{errors.technologies_used[0]}</p>
                )}
              </div>

              {/* إضافة مهارة جديدة */}
              <div className="flex items-center mt-4 gap-3 mb-6">
                <input
                  type="text"
                  placeholder={
                    language === "ar" ? "أضف مهارة جديدة" : "Add a new skill"
                  }
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="text-xl px-4 h-[45px] w-full border border-gray-300 dark:bg-main_dash dark:text-secend_text shadow-md rounded-md outline-none font-semibold text-gray-800"
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-indigo-600 whitespace-nowrap text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 transition"
                >
                  {language === "ar" ? "أضف مهارة" : "Add Skill"}
                </button>
              </div>

              {/* زر تعديل */}
              <div className="w-fit mr-auto">
                <input
                  type="submit"
                  value={language === "ar" ? "تعديل" : "Edit"}
                  className="bg-green-600 cursor-pointer  text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition"
                />
              </div>

              {done && (
                <h1 className="w-fit mx-auto text-green-400 text-xl">{done}</h1>
              )}

              {generalError && (
                <p className="text-red-500 text-center my-4">{generalError}</p>
              )}
            </div>

            <input
              type="file"
              name="projectimage"
              id="projectimage"
              ref={openinput}
              hidden
              onChange={handleImageChange}
            />
          </form>
        </div>
      )}
    </>
  );
}
