"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { instance } from "@/app/Api/axios";
import Img from "@/app/_componants/Image";
import Navbar from "@/app/_componants/_webiste/Navbar";
import Footer from "@/app/_componants/_webiste/Footer";
import Link from "next/link";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";
import { Usevariables } from "@/app/context/VariablesProvider";

const ProjectDetail = ({ params }) => {
  const { language } = Usevariables();
  const projectId = params.projectid;
  const [project, setProject] = useState<any>(null);
  const [relatedProjects, setRelatedProjects] = useState<any>([]);

  // جلب بيانات المشروع
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await instance.get(`/project/${projectId}`);
        const projectData = response.data.data;

        // إعداد البيانات بناءً على اللغة
        setProject({
          title:
            language === "ar" ? projectData.title_ar : projectData.title_en,
          description:
            language === "ar"
              ? projectData.description_ar
              : projectData.description_en,
          image: projectData.image,
          technologies_used: projectData.technologies_used, // إضافة تقنيات المشروع
        });
      } catch (error) {
        console.error(
          language === "ar"
            ? "حدث خطأ في جلب بيانات المشروع"
            : "Error fetching project data",
          error
        );
      }
    };

    fetchProject();
  }, [projectId, language]);

  // جلب المشاريع ذات الصلة
  const fetchRelatedProjects = async () => {
    try {
      const response = await instance.get("/projects?page=1");
      const randomProjects = response.data.data;
      setRelatedProjects(randomProjects);
    } catch (error) {
      console.error("Error fetching related projects", error);
    }
  };

  useEffect(() => {
    fetchRelatedProjects();
  }, []);

  if (!project)
    return (
      <div className="h-screen relative">
        <LoadingSpiner />
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            {project.title}
          </h2>
          <Img
            imgsrc={project.image ? project.image : "/portfoliosection/2.jpg"}
            styles="w-full h-96 object-cover mb-6"
          />
          <p className="text-lg text-gray-700">{project.description}</p>

          {/* عرض التقنيات المستخدمة */}
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">
              {language === "en" ? "Technologies Used" : "التقنيات المستخدمة"}
            </h3>
            <ul className="flex items-center gap-4">
              {project.technologies_used.map((skill, index) => (
                <li
                  key={index}
                  className="text-lg dark:text-gray-600 px-2 py-1 text-white rounded-sm shadow-sm bg-main_blue text-center "
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <h3 className="text-2xl font-bold text-center mb-8">
          {language == "en" ? "Related Projects" : "المشاريع ذات الصلة"}
        </h3>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="max-w-xl mx-auto md:max-w-3xl lg:max-w-full"
        >
          {relatedProjects.map((relatedProject) => (
            <SwiperSlide key={relatedProject.id}>
              <Link
                href={`/portfolio/${relatedProject.id}`}
                className="relative"
              >
                <Img
                  imgsrc={
                    relatedProject.image
                      ? relatedProject.image
                      : "/portfoliosection/3.jpg"
                  }
                  styles="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 hover:bg-opacity-30">
                  <h4 className="text-white text-lg">
                    {language === "ar"
                      ? relatedProject.title_ar
                      : relatedProject.title_en}
                  </h4>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Footer />
    </>
  );
};

export default ProjectDetail;
