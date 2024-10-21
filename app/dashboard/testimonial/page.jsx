"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Img from "@/app/_componants/Image";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";

const TestimonialComponent = () => {
  const { language } = Usevariables();
  // تمرير المتغير language كخاصية للمكون
  const [testimonials, setTestimonials] = useState([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    client_name: "",
    image: null,
    content: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // تحميل الآراء من API عند تحميل المكون
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await instance.get("/customer-feedbacks");
        setTestimonials(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  // إدارة المدخلات
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  // فتح نافذة التعديل
  const openModal = (testimonial) => {
    if (testimonial) {
      setSelectedTestimonial(testimonial);
      setFormData({
        client_name: testimonial.client_name,
        image: testimonial.image || "/public/avatar-2.jpg",
        content: testimonial.content,
      });
      setIsEditMode(true);
    } else {
      setFormData({ client_name: "", image: null, content: "" });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  // إغلاق نافذة التعديل
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
    setDeleteConfirmId(null);
    setIsDeleteModalOpen(false); // إغلاق نافذة الحذف أيضًا
  };

  // إضافة أو تحديث الرأي
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("client_name", formData.client_name);
    data.append("content", formData.content);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (isEditMode) {
        await instance.post(
          `/customer-feedbacks/${selectedTestimonial.id}`,
          data
        );
      } else {
        await instance.post("/customer-feedbacks", data);
      }
      // إعادة تحميل الآراء
      const response = await instance.get("/customer-feedbacks");
      setTestimonials(response.data);
      closeModal();
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };

  // بدء عملية الحذف
  const confirmDelete = (id) => {
    setDeleteConfirmId(id);
    setIsDeleteModalOpen(true);
  };

  // حذف الرأي
  const handleDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await instance.delete(`/customer-feedbacks/${deleteConfirmId}`);
        setTestimonials((prev) =>
          prev.filter((item) => item.id !== deleteConfirmId)
        );
        setDeleteConfirmId(null);
        closeModal(); // إغلاق نافذة الحذف
      } catch (error) {
        console.error("Error deleting testimonial:", error);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-center text-2xl font-bold mb-6">
        {language === "ar" ? "آراء العملاء" : "Customer Testimonials"}
      </h2>
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300"
      >
        {language === "ar" ? "إضافة رأي جديد" : "Add New Testimonial"}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {testimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <Img
                imgsrc={testimonial.image}
                styles="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold">{testimonial.client_name}</h3>
                <p className="text-gray-600">{testimonial.date}</p>
              </div>
            </div>
            <p className="text-gray-700">{testimonial.content}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => openModal(testimonial)}
                className="text-yellow-500 hover:underline"
              >
                {language === "ar" ? "تعديل" : "Edit"}
              </button>
              <button
                onClick={() => confirmDelete(testimonial.id)}
                className="text-red-500 hover:underline"
              >
                {language === "ar" ? "حذف" : "Delete"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* نافذة منبثقة لتأكيد الحذف */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {language === "ar" ? "تأكيد الحذف" : "Delete Confirmation"}
            </h3>
            <p>
              {language === "ar"
                ? "هل أنت متأكد أنك تريد حذف هذا الرأي؟"
                : "Are you sure you want to delete this testimonial?"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="mr-2 text-gray-500 hover:underline"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition duration-300"
              >
                {language === "ar" ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة منبثقة للتعديل */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {isEditMode
                ? language === "ar"
                  ? "تعديل"
                  : "Edit"
                : language === "ar"
                ? "إضافة"
                : "Add"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2">
                  {language === "ar" ? "اسم العميل" : "Client Name"}
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  {language === "ar" ? "الصورة" : "Image"}
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">
                  {language === "ar" ? "المحتوى" : "Content"}
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="border border-gray-300 p-2 rounded w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 text-gray-500 hover:underline"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-300"
                >
                  {isEditMode
                    ? language === "ar"
                      ? "تحديث"
                      : "Update"
                    : language === "ar"
                    ? "إضافة"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialComponent;
