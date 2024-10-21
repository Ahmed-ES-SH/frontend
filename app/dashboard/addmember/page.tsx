/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/Api/axios";
import Img from "@/app/_componants/Image";
import { Usevariables } from "@/app/context/VariablesProvider";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";

const AddTeamMember = () => {
  const { language } = Usevariables();
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [facebook, setFacebook] = useState("");
  const [loading, setloading] = useState(false);
  const [X_Account, setX_Account] = useState("");
  const [instagram, setInstagram] = useState("");
  const [image, setImage] = useState<null | File>(null);
  const openInputRef = useRef<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setloading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("position", position);
      formData.append("facebook", facebook);
      formData.append("X_Account", X_Account);
      formData.append("instagram", instagram);
      if (image) {
        formData.append("image", image);
      }

      await instance.post("/team-member", formData);
      // Reset the form
      setName("");
      setPosition("");
      setFacebook("");
      setX_Account("");
      setInstagram("");
      setImage(null);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error adding team member", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <motion.div
          className="w-[90%] max-md:w-[95%] mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-4">
            {language === "en" ? "Add New Team Member" : "إضافة عضو جديد"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-gray-700">
                {language === "en" ? "Name" : "الاسم"}
              </label>
              <input
                type="text"
                className="border p-2 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">
                {language === "en" ? "Position" : "الوظيفة"}
              </label>
              <input
                type="text"
                className="border p-2 rounded-md"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">
                {language === "en" ? "Facebook Profile" : "صفحة الفيسبوك"}
              </label>
              <input
                type="text"
                className="border p-2 rounded-md"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">
                {language === "en" ? "X Account" : "حساب X"}
              </label>
              <input
                type="text"
                className="border p-2 rounded-md"
                value={X_Account}
                onChange={(e) => setX_Account(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">
                {language === "en" ? "Instagram Profile" : "صفحة إنستغرام"}
              </label>
              <input
                type="text"
                className="border p-2 rounded-md"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">
                {language === "en" ? "Profile Image" : "صورة الملف الشخصي"}
              </label>
              <div
                className="border-dashed border-2 border-gray-300 flex items-center justify-center p-6 rounded-md cursor-pointer"
                onClick={() => openInputRef.current.click()}
              >
                {image ? (
                  <Img
                    imgsrc={URL.createObjectURL(image)}
                    styles="w-32 h-32 rounded-md"
                  />
                ) : (
                  <p className="text-gray-500">
                    {language === "en" ? "Upload Image" : "تحميل صورة"}
                  </p>
                )}
              </div>
              <input
                type="file"
                hidden
                ref={openInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-md transition duration-200 hover:bg-blue-600"
            >
              {language === "en" ? "Add Member" : "إضافة عضو"}
            </button>
          </form>
        </motion.div>
      )}
    </>
  );
};

export default AddTeamMember;
