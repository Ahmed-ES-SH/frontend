/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../Image";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";

export default function ContanctUS() {
  const { language } = Usevariables();
  const [currentimage, setcurrentimage] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/contactimage");
        const data = response.data.contact_img;

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

  // كائن النصوص لدعم اللغتين
  const textContent: any = {
    en: {
      title: "Contact us",
      name: "Name",
      email: "Email address",
      phone: "Phone Number",
      message: "Message",
      send: "Send Message",
    },
    ar: {
      title: "تواصل معنا",
      name: "الاسم",
      email: "عنوان البريد الإلكتروني",
      phone: "رقم الهاتف",
      message: "رسالة",
      send: "إرسال الرسالة",
    },
  };

  return (
    <section id="contactus" className="bg-gray-100 dark:bg-secend_dash pt-3">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="title relative w-fit group">
          <h1 className="text-4xl text-main_blue duration-200">
            {textContent[language].title}
          </h1>
          <div className="line group-hover:w-full duration-300 w-0 bg-sky-400 h-[2px] absolute"></div>
          <div className="circle group-hover:visible duration-300 w-[3px] invisible left-2 h-[3px] rounded-full bg-white z-[999] absolute"></div>
        </div>
        <div className="grid grid-cols-1 mt-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Img
              imgsrc={currentimage ? currentimage : "/contact-bg.jpg"}
              styles="w-full h-full object-cover"
            />
          </div>

          <div className="rounded-lg dark:rounded-none bg-white dark:bg-main_dash p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form action="#" className="space-y-4">
              <div>
                <label className="sr-only" htmlFor="name">
                  {textContent[language].name}
                </label>
                <input
                  className="w-full rounded-lg border-gray-300 outline-none shadow-md p-3 text-sm"
                  placeholder={textContent[language].name}
                  type="text"
                  id="name"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="email">
                    {textContent[language].email}
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-300 outline-none shadow-md p-3 text-sm"
                    placeholder={textContent[language].email}
                    type="email"
                    id="email"
                  />
                </div>

                <div>
                  <label className="sr-only" htmlFor="phone">
                    {textContent[language].phone}
                  </label>
                  <input
                    className="w-full rounded-lg border-gray-300 outline-none shadow-md p-3 text-sm"
                    placeholder={textContent[language].phone}
                    type="tel"
                    id="phone"
                  />
                </div>
              </div>
              <div>
                <label className="sr-only" htmlFor="message">
                  {textContent[language].message}
                </label>

                <textarea
                  className="w-full h-[20vh] border border-gray-300 outline-none shadow-md rounded-lg p-3 text-sm"
                  placeholder={textContent[language].message}
                  id="message"
                ></textarea>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="inline-block w-full rounded-lg bg-black dark:bg-main_orange px-5 py-3 font-medium text-white sm:w-auto"
                >
                  {textContent[language].send}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
