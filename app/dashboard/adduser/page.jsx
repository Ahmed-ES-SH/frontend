"use client";
import Img from "@/app/_componants/Image";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import React, { useRef, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";

export default function Adduser() {
  const { language } = Usevariables();
  const openinput = useRef(null);
  const [form, setForm] = useState({
    name: "",
    last_name: "",
    email: "",
    phonenumber: "",
    password: "",
    password_confirm: "",
    role: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setloading] = useState(false);
  const [errors, setErrors] = useState({}); // لإدارة الأخطاء لكل حقل
  const [successMessage, setSuccessMessage] = useState(null); // لإدارة الرسائل الناجحة

  const translations = {
    en: {
      title: "Add New User",
      name: "Name",
      last_name: "Last Name",
      email: "Email",
      phonenumber: "Phone Number",
      password: "Password",
      confirmPassword: "Confirm Password",
      role: "Account Type",
      user: "User",
      admin: "Admin",
      image: "Image",
      submit: "Add User",
      passwordMismatch: "Passwords do not match",
      serverError: "An error occurred while creating the user.",
      validationError: "Please fill in all required fields correctly.",
    },
    ar: {
      title: "إضافة مستخدم جديد",
      name: "الاسم",
      last_name: "الاسم الأخير",
      email: "البريد الإلكتروني",
      phonenumber: "رقم الهاتف",
      password: "كلمة السر",
      confirmPassword: "تأكيد كلمة السر",
      role: "نوع الحساب",
      user: "مستخدم",
      admin: "أدمن",
      image: "صورة",
      submit: "إضافة مستخدم",
      passwordMismatch: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين",
      serverError: "حدث خطأ أثناء إنشاء المستخدم.",
      validationError: "يرجى ملء جميع الحقول المطلوبة بشكل صحيح.",
    },
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // مسح الخطأ عند التغيير
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setImage(files[0]);
      setErrors({ ...errors, image: null }); // مسح خطأ الصورة
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setloading(true);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("last_name", form.last_name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("password_confirm", form.password_confirm);
      formData.append("role", form.role);
      formData.append("image", image);

      const response = await instance.post("/register", formData);

      setSuccessMessage(
        language === "en"
          ? "User created successfully"
          : "تم إنشاء المستخدم بنجاح"
      );
      setloading(false);
      setForm({
        name: "",
        last_name: "",
        email: "",
        phonenumber: "",
        password: "",
        password_confirm: "",
        role: "",
      });
      setImage(null);
    } catch (error) {
      setloading(false);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // تخزين الأخطاء في حالة الأخطاء
      } else {
        setErrors({
          server:
            language === "en"
              ? translations.en.serverError
              : translations.ar.serverError,
        });
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-[90vh] relative">
          <LoadingSpiner />
        </div>
      ) : (
        <div className="w-full mx-auto p-6 bg-white dark:bg-secend_dash dark:text-secend_text mt-16 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {translations[language].title}
          </h1>
          {errors.server && (
            <div className="text-red-600 text-center mb-4">{errors.server}</div>
          )}
          {successMessage && (
            <div className="text-green-600 text-center mb-4">
              {successMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* حقل الاسم */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-white"
              >
                {translations[language].name}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                className={`mt-1 outline-none block w-full px-4 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-main_dash dark:text-secend_text sm:text-sm`}
                placeholder={translations[language].name}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name[0]}</p>
              )}
            </div>

            {/* حقل الاسم الأخير */}
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].last_name}
              </label>
              <input
                type="text"
                name="last_name"
                id="last_name"
                value={form.last_name}
                onChange={handleChange}
                className={`mt-1 outline-none block w-full px-4 py-2 border ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-main_dash dark:text-secend_text sm:text-sm`}
                placeholder={translations[language].last_name}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">{errors.last_name[0]}</p>
              )}
            </div>

            {/* حقل البريد الإلكتروني */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].email}
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className={`mt-1 outline-none block w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-main_dash dark:text-secend_text sm:text-sm`}
                placeholder={translations[language].email}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email[0]}</p>
              )}
            </div>

            {/* حقل كلمة السر */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].password}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className={`mt-1 outline-none block w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-main_dash dark:text-secend_text sm:text-sm`}
                placeholder={translations[language].password}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password[0]}</p>
              )}
            </div>

            {/* حقل تأكيد كلمة السر */}
            <div>
              <label
                htmlFor="password_confirm"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].confirmPassword}
              </label>
              <input
                type="password"
                name="password_confirm"
                id="password_confirm"
                value={form.password_confirm}
                onChange={handleChange}
                className={`mt-1 outline-none block w-full px-4 py-2 border ${
                  errors.password_confirm ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-main_dash dark:text-secend_text sm:text-sm`}
                placeholder={translations[language].confirmPassword}
              />
              {errors.password_confirm && (
                <p className="text-red-500 text-sm">
                  {errors.password_confirm[0]}
                </p>
              )}
            </div>

            {/* حقل الدور */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].role}
              </label>
              <select
                name="role"
                id="role"
                value={form.role}
                onChange={handleChange}
                className={`mt-1 outline-none block w-full px-4 py-2 border ${
                  errors.role ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-main_dash dark:text-secend_text sm:text-sm`}
              >
                <option value="user">{translations[language].user}</option>
                <option value="admin">{translations[language].admin}</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role[0]}</p>
              )}
            </div>

            {/* حقل الصورة */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                {translations[language].image}
              </label>
              <input
                hidden
                type="file"
                name="image"
                id="image"
                ref={openinput}
                onChange={handleImageChange}
              />
              {image ? (
                <Img
                  imgsrc={URL.createObjectURL(image)}
                  styles="w-[250px] object-contain"
                />
              ) : (
                <div
                  onClick={() => openinput.current.click()}
                  className={`${
                    errors.image ? "border-red-500" : "border-sky-300"
                  }    w-full h-[30vh] border-2 border-dashed cursor-pointer flex items-center justify-center `}
                >
                  <FaPlusSquare
                    className={`size-8  ${
                      errors.image ? "text-red-500" : "text-sky-400"
                    }  `}
                  />
                </div>
              )}
              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image[0]}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-400 duration-300 text-white py-2 px-4 rounded-md hover:bg-transparent  border border-transparent hover:text-black hover:border-green-400 "
            >
              {translations[language].submit}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
