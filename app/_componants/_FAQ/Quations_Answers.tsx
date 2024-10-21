"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Img from "../Image";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";

export default function Quations_Answers() {
  const { language } = Usevariables();
  const [activeIndex, setActiveIndex] = useState<unknown>(null);
  const [questions, setQuestions] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [currentimage, setcurrentimage] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/FAQImage");
        const data = response.data.FAQ_image;

        // تخزين البيانات في الحالة
        if (data) {
          setcurrentimage(data); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  // جلب الأسئلة من الـ API مع دعم التصفح
  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/questions?page=1`);
      const allQuestions = response.data.data; // بيانات الأسئلة

      // التأكد من وجود بيانات قبل استخدام slice
      if (Array.isArray(allQuestions)) {
        setQuestions(allQuestions.slice(0, 5)); // احتفظ بـ 5 أسئلة فقط
      } else {
        console.error("Expected an array of questions");
        setQuestions([]); // إذا لم تكن البيانات متوفرة، قم بتعيين الأسئلة إلى مصفوفة فارغة
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
          <div className="w-full lg:w-1/2">
            <Img
              imgsrc={currentimage ? currentimage : "/Mudd-Hero-3-repng.png"}
              styles="w-full rounded-xl object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-xl">
              <div className="mb-6 lg:mb-16">
                <h6
                  className={`text-lg text-center font-medium text-indigo-600 mb-2 ${
                    language === "en" ? "lg:text-left" : "lg:text-right"
                  }`}
                >
                  {language === "en" ? "FAQs" : "الأسئلة الشائعة"}
                </h6>
                <h2
                  className={`text-4xl text-center font-bold text-gray-900 dark:text-white leading-[3.25rem] mb-5 ${
                    language === "en" ? "lg:text-left" : "lg:text-right"
                  }`}
                >
                  {language === "en"
                    ? "Looking for answers?"
                    : "تبحث عن إجابات؟"}
                </h2>
              </div>

              <div style={{ direction: "rtl" }}>
                {questions.map((faq, index) => (
                  <div key={index} className="py-4 border-b border-gray-200">
                    <button
                      className="w-full flex justify-between items-center text-xl font-medium text-gray-600 hover:text-indigo-600 transition"
                      onClick={() => toggleAccordion(index)}
                    >
                      <h5>{faq.question}</h5>
                      <FiChevronDown
                        className={`transition-transform duration-300 ${
                          activeIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Motion for answer */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: activeIndex === index ? "auto" : 0,
                        opacity: activeIndex === index ? 1 : 0,
                      }}
                      transition={{
                        height: { duration: 0.5, ease: "easeInOut" },
                        opacity: { duration: 0.3, ease: "easeInOut" },
                      }}
                      className="overflow-hidden"
                    >
                      <motion.p className="text-base font-normal text-gray-600 mt-4">
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
