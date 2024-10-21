/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import React from "react";
import Img from "../Image";
import { IoMdClose } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { motion } from "framer-motion"; // استيراد Framer Motion
import TeamMembers from "./TeamMembers";
import { Usevariables } from "@/app/context/VariablesProvider";
import { instance } from "@/app/Api/axios";
import Link from "next/link";
import LoadingSpiner from "../LoadingSpiner";

export default function PortfolioSection() {
  const { language } = Usevariables(); // جلب اللغة المختارة
  const [projects, setProjects] = useState<any>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [allServices, setAllServices] = useState<any>([]); // تغيير الاسم إلى allServices
  const [selectedService, setSelectedService] = useState("All"); // تعديل المتغير
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // جلب المشاريع من الـ API مع دعم التصفية حسب الصفحة
  useEffect(() => {
    const getData = async (page = 1) => {
      setloading(true);
      const response = await instance
        .get(`/projects?page=${page}`)
        .then((data) => {
          setProjects(data.data.data);
          setTotalPages(data.data.last_page); // إجمالي الصفحات
        });
      setloading(false);
      throw response;
    };
    getData(currentPage); // جلب البيانات للصفحة الحالية
  }, [currentPage]);

  // جلب جميع الخدمات من الـ API
  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await instance.get("/services");
        setAllServices(response.data.data); // حفظ جميع الخدمات
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    getServices();
  }, []);

  // فلترة المشاريع بناءً على الخدمة المختارة
  const filteredProjects =
    selectedService === "All"
      ? projects
      : projects.filter((project: any) => project.category === selectedService); // تعديل الفلترة حسب الخدمة (category)

  // تبديل الصفحة عند الضغط على أزرار التنقل بين الصفحات
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // إغلاق قائمة الفلاتر
  const handleClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <section className="bg-white  pt-12 dark:bg-gray-900 antialiased w-full">
          <div className="max-w-screen-xl px-4 py-6 mx-auto lg:px-6 sm:py-16 lg:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-main_text sm:text-4xl dark:text-secend_text">
                {language === "en" ? "Our Portfolio" : "معرض أعمال الشركة"}
              </h2>
              <p className="mt-4 text-base font-normal text-gray-500 sm:text-xl dark:text-gray-400">
                {language === "en"
                  ? "Crafted with skill and care to help our clients grow their business!"
                  : "تم تصميمه بمهارة وعناية لمساعدة عملائنا على تنمية أعمالهم!"}
              </p>
            </div>

            <div className="mt-16">
              {/* Sidebar filter with motion */}
              {isSidebarOpen && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className=" fixed top-14 left-0 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-300 shadow-lg p-4 z-50"
                >
                  <h3 className="text-xl font-bold mt-8 mb-6 text-gray-900 dark:text-white">
                    {language === "en" ? "Filter by:" : "تصفية حسب:"}
                  </h3>
                  <div className="flex flex-col space-y-4">
                    <button
                      className={`px-4 py-2 text-left w-full rounded-md ${
                        selectedService === "All"
                          ? "bg-main_blue text-white"
                          : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-sky-400 duration-300"
                      }`}
                      onClick={() => setSelectedService("All")}
                    >
                      {language === "en" ? "All" : "الكل"}
                    </button>
                    {allServices.map((service: any, index: number) => (
                      <button
                        key={index}
                        className={`px-4 py-2 text-left w-full rounded-md ${
                          selectedService === service.title_en
                            ? "bg-main_blue text-white"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-sky-400 duration-300"
                        }`}
                        onClick={() => setSelectedService(service.title_en)}
                      >
                        {language === "en"
                          ? service.title_en
                          : service.title_ar}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                  >
                    <IoMdClose />
                  </button>
                </motion.div>
              )}

              <div className="w-full">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project, index) => (
                      <Link
                        href={`portfolio/${project?.id}`}
                        key={index}
                        className="border cursor-pointer border-gray-300 w-full max-h-[60vh] overflow-hidden group relative rounded-lg shadow-lg"
                      >
                        <Img
                          imgsrc={
                            project.image
                              ? project.image
                              : "/portfoliosection/2.jpg"
                          }
                          styles="w-full h-[250px] rounded-t-lg group-hover:scale-110 group-hover:rotate-1 duration-300"
                        />
                        <div className="content h-[20vh] px-3 flex flex-col items-start gap-3">
                          <h3 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white mt-4">
                            {language === "ar"
                              ? project.title_ar
                              : project.title_en}
                          </h3>
                          <p className="text-lg font-normal text-gray-500 dark:text-gray-400">
                            {language === "ar"
                              ? project.description_ar.length > 150
                                ? project.description_ar.slice(0, 150) + "..."
                                : project.description_ar
                              : project.description_en.length > 150
                              ? project.description_en.slice(0, 150) + "..."
                              : project.description_en}
                          </p>
                        </div>
                        <div className="skills duration-300 group-hover:opacity-100 opacity-0 left-0 w-full flex items-center gap-1 flex-wrap px-2">
                          {project.technologies_used &&
                            project.technologies_used.map((skill, index) => (
                              <div
                                key={index}
                                className="px-2 py-1 text-center text-[14px] rounded-md shadow-md dark:text-white"
                              >
                                #{skill}
                              </div>
                            ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-xl h-[60vh] flex items-center justify-center font-semibold text-gray-600 dark:text-white">
                    <p>
                      {language === "en"
                        ? "No projects found for this service."
                        : "لا توجد مشاريع ضمن هذه الخدمة حتى الآن."}
                    </p>
                  </div>
                )}

                {/* أزرار التنقل بين الصفحات */}
                <div className="pagination flex justify-center mt-8">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 mx-1 ${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <TeamMembers />
      <div
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className="absolute flex items-center justify-center top-20 left-6 bg-main_blue rounded-md shadow-md cursor-pointer w-[40px] h-[40px]"
      >
        <FiFilter size={30} className="text-white" />
      </div>
    </>
  );
}
