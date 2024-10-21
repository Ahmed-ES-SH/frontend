/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Img from "../Image";
import Link from "next/link";
import DarkmodeButton from "../DarkmodeButton";
import { navlinks } from "@/app/constants/websitecontent";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import { MdOutlineLogout } from "react-icons/md";
import { Usevariables } from "@/app/context/VariablesProvider";
import { RiArrowDropDownLine } from "react-icons/ri"; // استبدال أيقونة السهم

export default function Navbar() {
  const {
    currentuser,
    setLanguage,
    language,
  }: { currentuser: any; setLanguage: any; language: any } = Usevariables();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const userMenuItems = [
    { name: "dashboard", href: "/dashboard" },
    { name: "My profile", href: "#" },
    { name: "Billing summary", href: "#" },
    { name: "Team settings", href: "#" },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLanguageChange = (mainlanguage: React.SetStateAction<string>) => {
    setSelectedLanguage(mainlanguage);
    setLanguage(mainlanguage === "English" ? "en" : "ar");
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="w-full z-[999] h-[70px] shadow-md px-2 py-2 fixed bg-main_blue">
        <div className="mainbar w-[90%] m-auto flex items-center justify-between">
          <div className="logo relative">
            <Link href={"/"}>
              <Img imgsrc="/logo.png" styles="w-[90px] object-contain" />
            </Link>
          </div>
          <div className="links max-md:hidden text-white">
            <ul className="flex items-center gap-6">
              {navlinks.map((link, index) => (
                <Link
                  href={link.link ? link.link : "/#contactus"}
                  key={index}
                  className="group main_link text-[18px] relative hover:text-sky-200 duration-150 cursor-pointer"
                >
                  <p>{language === "en" ? link.text.en : link.text.ar}</p>{" "}
                  {/* تعديل هنا */}
                  <div className="line group-hover:w-full duration-300 w-0 bg-sky-400 h-[2px] absolute"></div>
                  <div className="circle group-hover:visible duration-300 w-[3px] invisible left-2 h-[3px] rounded-full bg-white z-[999] absolute"></div>
                </Link>
              ))}
            </ul>
          </div>
          <div className="btn+toggel relative flex items-center gap-2 max-md:hidden">
            {/* زر تبديل اللغة بشكل dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center px-4 py-2 text-white bg-main_blue rounded-md shadow-md"
              >
                {selectedLanguage} {/* عرض اللغة المختارة */}
                <RiArrowDropDownLine className="w-4 h-4 ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleLanguageChange("العربية")}
                  >
                    العربية
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleLanguageChange("English")}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            {currentuser ? (
              <div className="hidden md:relative md:block">
                <button
                  type="button"
                  className="overflow-hidden rounded-full shadow-inner"
                  onClick={toggleUserMenu}
                >
                  <span className="sr-only">Toggle dashboard menu</span>
                  <Img
                    imgsrc={
                      currentuser && currentuser.image
                        ? currentuser.image
                        : "/avatar-1.jpg"
                    }
                    styles="w-[40px]"
                  />
                </button>

                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-8 z-10 mt-0.5 w-56 divide-y rounded-md bg-white shadow-lg"
                    role="menu"
                  >
                    <div className="p-2">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          role="menuitem"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>

                    <div className="p-2">
                      <form method="POST" action="#">
                        <button
                          type="submit"
                          className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          role="menuitem"
                        >
                          <MdOutlineLogout className="size-4" />
                          Logout
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Link
                href={"/signup"}
                className="px-4 block shadow-md group overflow-hidden h-full relative py-2 rounded-full bg-main_blue"
              >
                <p className="z-[999] relative group-hover:text-black text-white duration-300">
                  {language == "en" ? "Join now" : "إنضم الأن"}
                </p>
                <div className="group-hover:w-full left absolute right-0 top-0 bg-white w-0 duration-700 h-[500px]"></div>
                <div className="group-hover:w-full right absolute left-0 top-0 bg-white w-0 duration-700 h-[500px]"></div>
              </Link>
            )}
            <button className="w-[40px] h-[40px] relative overflow-hidden rounded-full bg-white shadow-md flex items-center justify-center">
              <DarkmodeButton />
            </button>
          </div>
          <div
            className="bars text-white cursor-pointer md:hidden"
            onClick={toggleSidebar}
          >
            <HiOutlineBars3BottomRight size={30} />
          </div>
        </div>
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 right-0 w-[250px] h-full bg-white shadow-md z-[9999] transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col items-start p-4 w-full">
          <button className="self-end mb-4" onClick={toggleSidebar}>
            <HiOutlineBars3BottomRight size={30} className="text-main_blue" />
          </button>
          <ul className="flex flex-col items-start gap-4 text-main_blue w-full">
            {navlinks.map((link, index) => (
              <Link
                href={link.link ? link.link : "/#contactus"}
                key={index}
                className="group main_link text-[18px] relative hover:text-sky-200 duration-150 cursor-pointer"
              >
                <p>{language === "en" ? link.text.en : link.text.ar}</p>{" "}
                {/* تعديل هنا */}
                <div className="line group-hover:w-full duration-300 w-0 bg-sky-400 h-[2px] absolute"></div>
                <div className="circle group-hover:visible duration-300 w-[3px] invisible left-2 h-[3px] rounded-full bg-white z-[999] absolute"></div>
              </Link>
            ))}
            <div className="relative w-full">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full px-4 py-2 text-white bg-main_blue rounded-md shadow-md"
              >
                {selectedLanguage} {/* عرض اللغة المختارة */}
                <RiArrowDropDownLine className="w-4 h-4 ml-2" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleLanguageChange("العربية")}
                  >
                    العربية
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleLanguageChange("English")}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
          </ul>
        </div>
      </div>
    </>
  );
}
