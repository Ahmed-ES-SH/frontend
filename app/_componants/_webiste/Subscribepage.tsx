"use client";

import { useState, useEffect } from "react";
import Img from "../Image";
import { IoMdClose } from "react-icons/io";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false); // بدءً، اجعل المكون غير مرئي

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true); // اجعل المكون مرئيًا بعد 5 ثوانٍ
    }, 5000); // 5000 مللي ثانية = 5 ثوانٍ

    return () => clearTimeout(timer); // نظف التايمر عند إلغاء تحميل المكون
  }, []);

  const handleSubscribe = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // هنا يمكنك إضافة منطق لإرسال البريد الإلكتروني إلى الخادم
    // على سبيل المثال، يمكنك استخدام fetch لإرسال الطلب إلى API

    // إذا نجح الاشتراك، قم بتحديث الرسالة
    setSuccessMessage("Thank you for subscribing!");
    setEmail(""); // امسح حقل البريد الإلكتروني
  };

  const handleClose = () => {
    setIsVisible(false); // عند النقر على زر الإغلاق، اجعل المكون غير مرئي
  };

  if (!isVisible) return null; // إذا كانت الحالة غير مرئية، ارجع null

  return (
    <div className="bg-gradient-to-r w-[95%] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999999] from-main_blue to-gray-100 font-[sans-serif] py-20">
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 p-4">
        <div className="w-full text-center lg:text-left">
          <h2 className="text-gray-800 text-5xl font-extrabold mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600">
            Subscribe to our newsletter for the latest updates, tips, and
            exclusive offers.
          </p>
        </div>

        <div className="w-full max-lg:max-w-lg">
          <form className="flex items-center" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // قم بتحديث حالة البريد الإلكتروني عند التغيير
              placeholder="Enter your email"
              className="w-full lg:w-[300px] text-gray-800 bg-white py-3.5 px-4 text-base border border-[#ddd] border-r-0 rounded-l-lg outline-none focus:border-blue-600"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold tracking-wide py-3.5 px-6 border border-blue-600 rounded-r-lg outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
        >
          <IoMdClose />
        </button>
      </div>

      <Img
        imgsrc="/logo.png"
        styles="w-[120px] object-contain absolute top-2 left-3"
      />

      {successMessage && (
        <p className="text-main_orange text-center mt-4">{successMessage}</p>
      )}
    </div>
  );
};

export default NewsletterSubscription;
