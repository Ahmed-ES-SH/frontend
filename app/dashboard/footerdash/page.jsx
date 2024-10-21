"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownLong } from "react-icons/fa6";
import { FaPen, FaTrash } from "react-icons/fa";
import { instance } from "@/app/Api/axios";

const DropdownMenu = ({ menu, setMenus, menuIndex, title }) => {
  const [isOpen, setIsOpen] = useState(false); // حالة للتحكم بفتح القائمة
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentLink, setCurrentLink] = useState(null);

  // إضافة رابط جديد عبر API
  const addLink = async () => {
    if (newLinkName && newLinkUrl) {
      try {
        const formdata = new FormData();
        // أضف الرابط الجديد إلى القائمة الحالية
        const updatedLinks = [
          ...menu.links,
          { name: newLinkName, url: newLinkUrl },
        ];
        // قم بترميز القائمة الجديدة ك JSON
        formdata.append(`list${menuIndex + 1}`, JSON.stringify(updatedLinks));

        // أرسل الطلب إلى الخادم
        const response = await instance.post(`/footer-lists`, formdata);
        setMenus((prev) => {
          const newMenus = [...prev];
          newMenus[menuIndex].links = JSON.parse(
            response.data[`list${menuIndex + 1}`]
          );
          return newMenus;
        });
        // إعادة تعيين المدخلات
        setNewLinkName("");
        setNewLinkUrl("");
      } catch (error) {
        console.error("Error adding link:", error);
      }
    }
  };

  // حذف رابط عبر API
  const deleteLink = async (name) => {
    try {
      // حذف الرابط من الواجهة الأمامية
      const updatedLinks = menu.links.filter((link) => link.name !== name);

      const formdata = new FormData();
      // قم بترميز القائمة المعدلة ك JSON
      formdata.append(`list${menuIndex + 1}`, JSON.stringify(updatedLinks));

      // تحديث المصفوفة الأمامية بتعديل المجموعة المحددة فقط
      setMenus((prev) => {
        return prev.map((menuItem, index) => {
          if (index === menuIndex) {
            return { ...menuItem, links: updatedLinks };
          }
          return menuItem;
        });
      });

      // تحديث القائمة بأكملها باستخدام API التعديل
      await instance.post(`/footer-lists`, formdata);
    } catch (error) {
      console.error("Error updating menu:", error);
    }
  };

  // فتح نافذة التعديل
  const openEditModal = (link) => {
    setCurrentLink(link);
    setIsEditing(true);
  };

  // حفظ التعديلات عبر API
  const saveEdit = async () => {
    try {
      // تحديث الرابط في الواجهة الأمامية
      const updatedLinks = menu.links.map((link) =>
        link.id === currentLink.id
          ? { ...link, name: currentLink.name, url: currentLink.url }
          : link
      );

      const formdata = new FormData();
      // قم بترميز القائمة المعدلة ك JSON
      formdata.append(`list${menuIndex + 1}`, JSON.stringify(updatedLinks));

      // تحديث حالة القائمة في الواجهة الأمامية
      setMenus((prev) => {
        return prev.map((menuItem, index) => {
          if (index === menuIndex) {
            return { ...menuItem, links: updatedLinks };
          }
          return menuItem;
        });
      });

      // تحديث القائمة في الخادم باستخدام API التعديل
      await instance.post(`/footer-lists`, formdata);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  // المتغيرات لتأثيرات الحركة
  const variants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.4 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="mb-4">
      <div
        className="text-xl font-semibold cursor-pointer bg-gray-200 dark:bg-main_dash dark:text-secend_text p-4 rounded-lg flex items-center justify-between w-full"
        onClick={() => setIsOpen(!isOpen)} // عكس حالة القائمة المفتوحة
      >
        <p>{title}</p>
        <FaDownLong />
      </div>

      {/* القائمة المنسدلة */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            className="overflow-hidden mt-4 pl-4"
          >
            {/* قائمة الروابط */}
            <AnimatePresence>
              {menu.links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border-b border-gray-300 py-4 flex justify-between items-center"
                >
                  <div>
                    <a
                      href={link.url}
                      className="text-lg text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                    <p className="text-gray-600">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(link)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <FaPen />
                    </button>
                    <button
                      onClick={() => deleteLink(link.name)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* إضافة رابط جديد */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="اسم الرابط"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                value={newLinkName}
                onChange={(e) => setNewLinkName(e.target.value)}
              />
              <input
                type="text"
                placeholder="رابط URL"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
              />
              <button
                onClick={addLink}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full"
              >
                إضافة الرابط
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة التعديل المنبثقة */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4">تعديل الرابط</h2>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={currentLink?.name}
                onChange={(e) =>
                  setCurrentLink({ ...currentLink, name: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={currentLink?.url}
                onChange={(e) =>
                  setCurrentLink({ ...currentLink, url: e.target.value })
                }
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={saveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  حفظ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FooterLinks() {
  // حالة القوائم
  const [menus, setMenus] = useState([]);

  // جلب البيانات عند التحميل
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await instance.get("/footer-lists");
        const data = response.data;

        // إعداد هيكل القوائم بشكل صحيح
        const combinedLists = [
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
    <div className="w-[90%] max-md:w-[98%] mt-16 bg-gray-100 dark:bg-secend_dash mx-auto p-4">
      {menus.map((menu, index) => (
        <DropdownMenu
          key={index}
          menu={menu}
          setMenus={setMenus}
          menuIndex={index}
          title={menu.title}
        />
      ))}
    </div>
  );
}
