/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Img from "../Image";
import { instance } from "@/app/Api/axios";

export default function Footer() {
  const [menus, setMenus] = useState([]); // إضافة حالة لتخزين القوائم

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await instance.get("/footer-lists");
        const data = response.data;

        // إعداد هيكل القوائم بشكل صحيح
        const combinedLists: any = [
          { title: "قائمة 1", links: data.list1 },
          { title: "قائمة 2", links: data.list2 },
          { title: "قائمة 3", links: data.list3 },
          { title: "قائمة 4", links: data.list4 },
          { title: "قائمة 5", links: data.list5 },
        ];

        setMenus(combinedLists);
      } catch (error) {
        console.error("Error fetching footer lists:", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <footer className="bg-gray-200 dark:bg-main_dash">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-start lg:gap-8">
          <div className="text-teal-600">
            <Img imgsrc="/logo.png" styles="w-[120px] object-contain" />
          </div>

          <div className="mt-8  gap-8 lg:mt-0 lg:grid-cols-5 lg:gap-y-16 w-full">
            {/* قائمة الأخبار */}
            <div className="flex max-md:flex-col w-full items-center justify-between">
              <div className="col-span-2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    احصل على آخر الأخبار!
                  </h2>
                  <p className="mt-4 text-gray-500 w-[430px] max-md:w-fit">
                    تابع جميع آخر الأخبار
                  </p>
                </div>
              </div>
              <div className=" ">
                <form className="w-full">
                  <label htmlFor="UserEmail" className="sr-only">
                    Email
                  </label>

                  <div className="p-2 sm:flex sm:items-center sm:gap-4">
                    <input
                      type="email"
                      id="UserEmail"
                      placeholder="john@rhcp.com"
                      className="w-[300px] max-md:w-full h-[5vh] outline-none rounded-md px-3 placeholder-shown:px-3 border-none focus:border-transparent focus:ring-transparent sm:text-sm"
                    />
                    <button className="mt-1 w-full bg-teal-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-none hover:bg-teal-600 sm:mt-0 sm:w-auto sm:shrink-0">
                      اشترك
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full grid grid-cols-5 gap-16 items-center justify-items-center my-6">
              {/* عرض القوائم من الـ API */}
              {menus &&
                menus.map((menu: any, index) => (
                  <div key={index} className="w-full">
                    <ul className="mt-6 space-y-4 text-sm">
                      {menu.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.url}
                            className="text-gray-700 transition hover:opacity-75"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>

            {/* قسم الاشتراك في النشرة الإخبارية */}

            {/* روابط إضافية */}
            {/* يمكنك إضافة أي قسم آخر حسب الحاجة */}
          </div>
        </div>
      </div>
    </footer>
  );
}
