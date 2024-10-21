"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

export default function FAQComponent() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
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

  return (
    <section className="h-[70vh] bg-gray-100 flex items-center justify-center">
      <div className="w-[95%]  mx-auto p-4">
        <div className="mb-6 text-center">
          <h6 className="text-lg font-medium text-indigo-600 mb-2">FAQs</h6>
          <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
            Looking for answers?
          </h2>
        </div>

        <div className="w-full">
          {faqs.map((faq, index) => (
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
    </section>
  );
}
