"use client";
import Link from "next/link";
import React, { useRef, useState } from "react";
import Img from "../Image";
import Navbar from "../_webiste/Navbar";
import Footer from "../_webiste/Footer";
import { FaCamera } from "react-icons/fa";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "../../_componants/LoadingSpiner";
import Cookie from "cookie-universal";

export default function SignUp() {
  // اضفنا متغير اللغة كـ prop
  const language = true;
  const refinput = useRef<any | null>(null);
  const cookie = Cookie();
  const [loading, setloading] = useState(false);
  const [errors, seterrors] = useState<any>({});
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    paswword_confirm: "",
    marketing_accept: false,
  });

  const handelchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImage(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setloading(true);

    try {
      const data = new FormData();
      data.append("name", form.first_name);
      data.append("last_name", form.last_name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("password_confirm", form.paswword_confirm);
      data.append("marketing_accept", String(form.marketing_accept));
      if (image) {
        data.append("image", image);
      }

      const response = await instance.post("/register", data);
      cookie.set("madad_token", response.data.token);
      if (typeof window != undefined) {
        window.location.pathname = "/";
      }
      setloading(false);
    } catch (error: any) {
      setloading(false);
      console.error("Error registering:", error);
      if (error.response) {
        seterrors(error.response.data.errors);
      }
    }
  };

  return (
    <>
      <Navbar />

      <section className="h-[90vh] max-md:h-fit bg-white pt-16 dark:bg-secend_dash">
        {loading ? (
          <LoadingSpiner />
        ) : (
          <div className="w-full">
            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:px-16 lg:py-12">
              <div className="max-w-xl lg:max-w-3xl">
                <Link className="block text-blue-600" href="/">
                  <Img imgsrc="/logo.png" styles="w-[120px] object-contain" />
                </Link>

                <div className="w-full mt-6 flex items-center gap-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-secend_text sm:text-3xl md:text-4xl">
                    {language ? "Welcome to Madad!" : "مرحبًا بك في مدد!"}
                  </h1>
                  {image ? (
                    <div
                      onClick={() => refinput.current?.click()}
                      className="w-[50px] h-[50px] border bg-transparent rounded-full border-gray-400 overflow-hidden flex items-center justify-center cursor-pointer"
                    >
                      <Img
                        imgsrc={URL.createObjectURL(image)}
                        styles="w-full h-full rounded-full"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => refinput.current?.click()}
                      className="w-[50px] h-[50px] border bg-transparent rounded-full border-gray-400 flex items-center justify-center cursor-pointer"
                    >
                      <FaCamera className="size-8 dark:text-white" />
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 grid grid-cols-6 gap-6"
                >
                  <input
                    onChange={handleimagechange}
                    type="file"
                    name="image"
                    ref={refinput}
                    hidden
                  />

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="first_name"
                      className="block text-sm dark:text-secend_text font-medium text-gray-700"
                    >
                      {language ? "First Name" : "الاسم الأول"}
                    </label>
                    <input
                      onChange={handelchange}
                      type="text"
                      id="FirstName"
                      name="first_name"
                      className={`mt-1 outline-none h-[4vh] px-3 border border-gray-300 shadow-30 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm ${
                        errors.first_name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="LastName"
                      className="block text-sm dark:text-secend_text font-medium text-gray-700"
                    >
                      {language ? "Last Name" : "الاسم الأخير"}
                    </label>
                    <input
                      onChange={handelchange}
                      type="text"
                      id="LastName"
                      name="last_name"
                      className={`mt-1 outline-none h-[4vh] px-3 border border-gray-300 shadow-30 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm ${
                        errors.last_name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.last_name[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="Email"
                      className="block text-sm dark:text-secend_text font-medium text-gray-700"
                    >
                      {language ? "Email" : "البريد الإلكتروني"}
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="Password"
                      className="block text-sm dark:text-secend_text font-medium text-gray-700"
                    >
                      {language ? "Password" : "كلمة المرور"}
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

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="PasswordConfirmation"
                      className="block text-sm dark:text-secend_text font-medium text-gray-700"
                    >
                      {language ? "Password Confirmation" : "تأكيد كلمة المرور"}
                    </label>
                    <input
                      onChange={handelchange}
                      type="password"
                      id="PasswordConfirmation"
                      name="paswword_confirm"
                      className={`mt-1 outline-none h-[4vh] px-3 border border-gray-300 shadow-30 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm ${
                        errors.paswword_confirm ? "border-red-500" : ""
                      }`}
                    />
                    {errors.password_confirm && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password_confirm[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="MarketingAccept" className="flex gap-4">
                      <input
                        onChange={handelchange}
                        type="checkbox"
                        id="MarketingAccept"
                        name="marketing_accept"
                        className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                      />
                      <span className="text-sm text-gray-700 dark:text-secend_text">
                        {language
                          ? "I want to receive emails about events, product updates and company announcements."
                          : "أرغب في تلقي رسائل البريد الإلكتروني حول الأحداث وتحديثات المنتجات وإعلانات الشركة."}
                      </span>
                    </label>
                  </div>

                  <div className="col-span-6">
                    <p className="text-sm text-gray-500">
                      {language ? (
                        <>
                          By creating an account, you agree to our
                          <Link
                            href="#"
                            className="text-gray-700 dark:text-white hover:text-sky-400 duration-200 underline"
                          >
                            terms and conditions
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="#"
                            className="text-gray-700 dark:text-white hover:text-sky-400 duration-200 underline"
                          >
                            privacy policy
                          </Link>
                          .
                        </>
                      ) : (
                        <>
                          بإنشاء حساب، فإنك توافق على
                          <Link
                            href="#"
                            className="text-gray-700 dark:text-white hover:text-sky-400 duration-200 underline"
                          >
                            الشروط والأحكام
                          </Link>{" "}
                          و{" "}
                          <Link
                            href="#"
                            className="text-gray-700 dark:text-white hover:text-sky-400 duration-200 underline"
                          >
                            سياسة الخصوصية
                          </Link>
                          .
                        </>
                      )}
                    </p>
                  </div>

                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                      {language ? "Create an account" : "إنشاء حساب"}
                    </button>

                    <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                      {language
                        ? "Already have an account?"
                        : "هل لديك حساب بالفعل؟"}{" "}
                      <Link
                        href="/signin"
                        className="text-gray-700 dark:text-white  underline"
                      >
                        {language ? "Log in" : "تسجيل الدخول"}
                      </Link>
                      .
                    </p>
                  </div>
                </form>
              </div>
            </main>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}
