/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import React from "react";
import Img from "../../_componants/Image";
import Link from "next/link";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";

export default function Portfolio() {
  const { language } = Usevariables(); // جلب اللغة المختارة
  const [projects, setProjects] = useState<any>([]);
  const [loading, setloading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // الصفحة الحالية
  const [totalPages, setTotalPages] = useState<number>(1); // إجمالي الصفحات

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // تغيير الصفحة عند النقر على زر الصفحة
  };

  return (
    <>
      {loading ? (
        <div className="h-screen">
          <LoadingSpiner />
        </div>
      ) : (
        <section className="bg-white pt-12 dark:bg-gray-900 antialiased w-full">
          <div className="max-w-screen-xl px-4 py-6 mx-auto lg:px-6 sm:py-16 lg:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-main_text sm:text-4xl dark:text-secend_text">
                معرض الأعمال
              </h2>
            </div>

            <div className="mt-16">
              <div className="w-full">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <Link
                      href={`portfolio/${project?.id}`}
                      key={index}
                      className="border cursor-pointer border-gray-300 w-full max-h-[60vh] overflow-hidden  group relative  rounded-lg shadow-lg"
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
                        <p className="text-lg font-normal text-gray-500 dark:text-gray-400    ">
                          {language === "ar"
                            ? project.description_ar.length > 150
                              ? project.description_ar.slice(0, 150) + "..."
                              : project.description_ar
                            : project.description_en.length > 150
                            ? project.description_en.slice(0, 150) + "..."
                            : project.description_en}
                        </p>
                      </div>
                      <div className="skills  duration-300 group-hover:opacity-100  opacity-0 left-0 w-full flex items-center gap-1 flex-wrap px-2">
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
              </div>
            </div>

            {/* إضافة نظام الصفحات */}
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
        </section>
      )}
    </>
  );
}
