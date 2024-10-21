/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import React, { useState } from "react";
import Img from "../Image";
import Navbar from "../_webiste/Navbar";
import Footer from "../_webiste/Footer";
import Cookie from "cookie-universal";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../LoadingSpiner";

export default function SignIn() {
  const language = true;
  const cookie = Cookie();
  const [loading, setloading] = useState(false);
  const [errors, seterrors] = useState<any>({});
  const [form, setForm] = useState({
    email: "",
    password: "",
    marketing_accept: false,
  });

  const handelchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);

    try {
      const data = new FormData();
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("marketing_accept", String(form.marketing_accept));
      const response = await instance.post("/login", data);
      cookie.set("madad_token", response.data.token);
      if (typeof window !== "undefined") {
        window.location.pathname = "/";
      }
      setloading(false);
    } catch (error: any) {
      setloading(false);
      console.error("Error logging in:", error);
      if (error.status == 401) {
        console.log(error);
      } else seterrors(error.response.data.errors);
    }
  };

  // نصوص اللغة الإنجليزية
  const en = {
    welcome: "Welcome again to Madad!",
    email: "Email",
    password: "Password",
    marketing_accept:
      "I want to receive emails about events, product updates, and company announcements.",
    terms: "terms and conditions",
    privacy: "privacy policy",
    login: "Log in",
  };

  // نصوص اللغة العربية
  const ar = {
    welcome: "مرحبًا مجددًا في مدد!",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    marketing_accept:
      "أرغب في تلقي رسائل حول الأحداث وتحديثات المنتجات وإعلانات الشركة.",
    terms: "الشروط والأحكام",
    privacy: "سياسة الخصوصية",
    login: "تسجيل الدخول",
  };

  const text = language ? en : ar; // تحديد النص بناءً على اللغة

  return (
    <>
      <Navbar />

      <main className="flex items-center justify-center h-[90vh] max-md:h-fit bg-transparent pt-16 dark:bg-secend_dash px-8 py-8 sm:px-12 lg:px-16 lg:py-12 ">
        {loading ? (
          <LoadingSpiner />
        ) : (
          <div className="max-w-xl lg:max-w-3xl">
            <Link className="block text-blue-600" href="/">
              <Img imgsrc="/logo.png" styles="w-[120px] object-contain" />
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              {text.welcome}
            </h1>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {text.email}
                </label>

                <input
                  onChange={handelchange}
                  type="email"
                  id="Email"
                  name="email"
                  className={`mt-1 outline-none h-[4vh] px-3 border border-gray-300 shadow-30 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>
                )}
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {text.password}
                </label>

                <input
                  onChange={handelchange}
                  type="password"
                  id="Password"
                  name="password"
                  className={`mt-1 outline-none h-[4vh] px-3 border border-gray-300 shadow-30 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm ${
                    errors.password ? "border-red-500" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password[0]}
                  </p>
                )}
              </div>

              <div className="col-span-6">
                <label htmlFor="MarketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                  />
                  <span className="text-sm text-gray-700 dark:text-white">
                    {text.marketing_accept}
                  </span>
                </label>
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  {language
                    ? "By creating an account, you agree to our "
                    : "بإنشاء حساب، أنت توافق على "}
                  <Link
                    href="#"
                    className="text-gray-700 dark:text-white underline"
                  >
                    {text.terms}
                  </Link>
                  {language ? " and " : " و "}
                  <Link
                    href="#"
                    className="text-gray-700 dark:text-white underline"
                  >
                    {text.privacy}
                  </Link>
                  .
                </p>
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  {text.login}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
