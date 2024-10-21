/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { instance } from "@/app/Api/axios";
import { motion } from "framer-motion";
import { AiOutlineDelete, AiOutlineSearch } from "react-icons/ai";
import Img from "@/app/_componants/Image";
import { Usevariables } from "@/app/context/VariablesProvider";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";

const RequestList = () => {
  const { language } = Usevariables();
  const [requests, setRequests] = useState<any>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [loading, setloading] = useState(true);
  const [requestToDelete, setRequestToDelete] = useState<any>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<string>("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await instance.get("/orders");
        setRequests(response.data.data);
        setloading(false);
      } catch (error) {
        setloading(false);
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleDelete = (id) => {
    setRequestToDelete(id);
    setIsConfirmPopupOpen(true);
  };

  const confirmDelete = async () => {
    if (requestToDelete) {
      try {
        setloading(true);
        await instance.delete(`/delete-order/${requestToDelete}`);
        setRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== requestToDelete)
        );
        setloading(false);
        console.log(`Deleted request with id: ${requestToDelete}`);
      } catch (error) {
        setloading(false);
        console.error("Error deleting request:", error);
        alert("Failed to delete the request. Please try again.");
      } finally {
        setIsConfirmPopupOpen(false);
        setRequestToDelete(null);
      }
    }
  };

  const handleToggleDetails = (request) => {
    setSelectedRequest(selectedRequest === request ? null : request);
  };

  // دالة لتحديث حالة الطلب
  const updateOrderStatus = async (orderId) => {
    try {
      setloading(true);
      await instance.post(`/orders/${orderId}`, {
        order_status: statusToUpdate,
      });
      // تحديث الطلب في القائمة
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === orderId
            ? { ...request, order_status: statusToUpdate }
            : request
        )
      );
      setloading(false);
      alert("Order status updated successfully.");
    } catch (error) {
      setloading(false);
      console.error("Error updating order status:", error);
      alert("Failed to update the order status. Please try again.");
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <div className="p-5 mx-auto w-[95%] rounded-md max-md:w-[98%] mt-16 bg-[#f7f9fc] dark:bg-secend_dash">
          <h2 className="text-center text-xl font-bold text-gray-800 dark:text-white mb-4">
            {language == "en" ? "Orders List" : "قائمة الطلبات"}
          </h2>
          {requests.map((request) => (
            <motion.div
              key={request.id}
              className={`my-2 border border-gray-300 rounded-lg p-4 ${
                request.order_status == "done" ? "bg-green-400" : "bg-red-400"
              }  shadow-md transition-transform duration-200 hover:scale-105`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center max-md:flex-col max-md:gap-3">
                <div className="flex w-[35%] max-md:w-full max-md:justify-start max-md:gap-3 items-center justify-between">
                  <input
                    type="checkbox"
                    id={`request-${request.id}`}
                    className="mr-2"
                  />
                  <label
                    style={{ direction: "rtl" }}
                    htmlFor={`request-${request.id}`}
                    className="text-gray-600 dark:text-white"
                  >
                    {request.request_description.substring(0, 30)}...
                  </label>
                  <Img
                    imgsrc={
                      request.main_service.icon || "/servicessection/3.png"
                    }
                    styles="w-10 h-10 ml-5 rounded-md"
                  />
                </div>
                <div
                  className={`flex gap-3 w-fit ${
                    language == "en" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <button
                    onClick={() => handleToggleDetails(request)}
                    className="ml-auto bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600"
                  >
                    <AiOutlineSearch />
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="ml-2 bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600"
                  >
                    <AiOutlineDelete />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Popup لعرض تفاصيل الطلب */}
          {selectedRequest && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-main_dash dark:text-secend_text rounded-lg shadow-lg p-6 z-50 w-[70%] max-md:w-[95%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex w-full items-center justify-between ">
                <div>
                  <h4 className="text-center text-lg font-bold mb-4">
                    {language === "en" ? "Request Details" : "تفاصيل الطلب"}
                  </h4>
                  <p>
                    <strong>
                      {language === "en" ? "Client Phone:" : "رقم العميل:"}
                    </strong>{" "}
                    {selectedRequest.phone_number}
                  </p>
                  <p>
                    <strong>
                      {language === "en" ? "Main Service:" : "الخدمة الأساسية:"}
                    </strong>{" "}
                    {language === "en"
                      ? selectedRequest.main_service.title_en
                      : selectedRequest.main_service.title_ar}
                  </p>
                  <p>
                    <strong>
                      {language === "en" ? "Sub Service:" : "الخدمة الفرعية:"}
                    </strong>{" "}
                    {language === "en"
                      ? selectedRequest.sub_service.title_en
                      : selectedRequest.sub_service.title_ar}
                  </p>
                  <p>
                    <strong>وصف الطلب:</strong>{" "}
                    {selectedRequest.request_description}
                  </p>
                </div>
                <div>
                  <select
                    className="px-6 py-1 outline-none rounded-md shadow-md"
                    onChange={(e) => setStatusToUpdate(e.target.value)}
                    defaultValue={
                      selectedRequest.order_status ? "done" : "in work"
                    }
                  >
                    <option value="done">
                      {language == "en" ? "done" : "إنتهى"}
                    </option>
                    <option value="in work">
                      {language == "en" ? "in work" : "فى مرحلة العمل "}
                    </option>
                  </select>
                  <button
                    onClick={() => updateOrderStatus(selectedRequest.id)}
                    className="mt-2 w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                  >
                    {language === "en" ? "Update Status" : "تحديث الحالة"}
                  </button>
                </div>
              </div>
              {selectedRequest.main_service.icon && (
                <Img
                  imgsrc={selectedRequest.main_service.icon}
                  styles="w-[250px] h-auto mx-auto rounded-md mt-2"
                />
              )}
              <button
                onClick={() => setSelectedRequest(null)}
                className="mt-4 w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
              >
                إغلاق
              </button>
            </motion.div>
          )}

          {/* Popup تحذيري لحذف الطلب */}
          {isConfirmPopupOpen && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-main_dash dark:text-secend_text rounded-lg shadow-lg p-6 z-50 w-[70%]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-center text-lg font-bold mb-4">
                {language === "en" ? "Confirm Delete" : "تأكيد الحذف"}
              </h4>
              <p>
                {language === "en"
                  ? "Are you sure you want to delete this request?"
                  : "هل أنت متأكد أنك تريد حذف هذا الطلب؟"}
              </p>
              <div className="flex justify-around mt-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                >
                  {language === "en" ? "Delete" : "حذف"}
                </button>
                <button
                  onClick={() => setIsConfirmPopupOpen(false)}
                  className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                >
                  {language === "en" ? "Cancel" : "إلغاء"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </>
  );
};

export default RequestList;
