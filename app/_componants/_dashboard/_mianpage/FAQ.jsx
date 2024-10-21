"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import Img from "../../Image";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../../LoadingSpiner";
import { Usevariables } from "@/app/context/VariablesProvider";

export default function FAQ_dash() {
  const { language } = Usevariables();
  const openinput = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [image, setimage] = useState("");
  const [currentimage, setcurrentimage] = useState("");
  const [loading, setloading] = useState(false);

  const onchange = (e) => {
    setimage(e.target.files[0]);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/FAQImage");
        const data = response.data.FAQ_image;

        // تخزين البيانات في الحالة
        if (data) {
          setcurrentimage(data); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const updateimage = async () => {
    const formData = new FormData();
    if (image) formData.append("image", image);
    try {
      setloading(true);
      const response = await instance.post(`/updateFAQImage`, formData);
      console.log(response.data.message);
      setloading(false);
    } catch (error) {
      console.error("Error updating text:", error);
      setloading(false);
    }
  };

  const faqs = [
    {
      question: "How to create an account?",
      answer:
        "To create an account, find the 'Sign up' or 'Create account' button, fill out the registration form with your personal information, and click 'Create account' or 'Sign up.' Verify your email address if needed, and then log in to start using the platform.",
    },
    {
      question: "Have any trust issue?",
      answer:
        "Our focus on providing robust and user-friendly content management capabilities ensures that you can manage your content with confidence, and achieve your content marketing goals with ease.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "Our focus on providing robust and user-friendly content management capabilities ensures that you can manage your content with confidence, and achieve your content marketing goals with ease.",
    },
    {
      question: "What is the payment process?",
      answer:
        "Our focus on providing robust and user-friendly content management capabilities ensures that you can manage your content with confidence, and achieve your content marketing goals with ease.",
    },
  ];

  console.log(currentimage);

  return (
    <>
      {loading ? (
        <div className="h-[40vh] relative">
          <LoadingSpiner />
        </div>
      ) : (
        <section className="py-24">
          <input
            onChange={onchange}
            type="file"
            name=""
            hidden
            ref={openinput}
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
              <div
                onClick={() => openinput.current.click()}
                className="w-full cursor-pointer lg:w-1/2 border-2 border-transparent hover:border-sky-400 transition-all duration-300"
              >
                {image ? (
                  <Img
                    imgsrc={URL.createObjectURL(image)}
                    styles="w-[1130px] self-center  relative rounded-md"
                  />
                ) : (
                  <Img
                    imgsrc={
                      currentimage ? currentimage : "/Mudd-Hero-3-repng.png"
                    }
                    styles="w-full rounded-xl object-cover"
                  />
                )}
              </div>
              <div className="w-full lg:w-1/2">
                <div className="lg:max-w-xl">
                  <div className="mb-6 lg:mb-16">
                    <h6 className="text-lg text-center font-medium text-indigo-600 mb-2 lg:text-left">
                      FAQs
                    </h6>
                    <h2 className="text-4xl text-center font-bold text-gray-900 leading-[3.25rem] mb-5 lg:text-left">
                      Looking for answers?
                    </h2>
                  </div>

                  <div>
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="py-4 border-b border-gray-200"
                      >
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
          <button
            onClick={updateimage}
            className="px-4 mx-auto mt-4 block w-fit h-fit shadow-md group overflow-hidden relative py-2 rounded-md bg-green-400"
          >
            {language == "en" ? "save" : "تحديث"}
          </button>
        </section>
      )}
    </>
  );
}
