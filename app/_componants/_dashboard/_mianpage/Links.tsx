/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import React from "react";
import {
  FaImages,
  FaMapMarkerAlt,
  FaMicroblog,
  FaTextHeight,
} from "react-icons/fa";
import { FcAbout, FcCheckmark, FcServices } from "react-icons/fc";
import { GoGoal } from "react-icons/go";
import { GrServices } from "react-icons/gr";
import { LiaLinkSolid } from "react-icons/lia";
import { MdOutlineImagesearchRoller } from "react-icons/md"; // استيراد الأيقونة المطلوبة
import { RiContactsBook3Line } from "react-icons/ri";
import { RxValue } from "react-icons/rx";

interface props {
  title: string;
  to: string;
  icon: any;
}

const Card = ({ title, to, icon }: props) => {
  return (
    <Link
      className="bg-sky-400 hover:bg-transparent hover:text-black hover:border-sky-400 border border-transparent duration-300 h-[240px] flex flex-col items-center justify-center gap-3 rounded-xl  text-white   shadow-sm "
      href={to}
    >
      {icon}
      <h2 className="mt-4 text-xl font-bold ">{title}</h2>
    </Link>
  );
};

export default function Mainpagelinks() {
  const cardsData = [
    {
      title: "الصور",
      icon: <FaImages className="size-8" />,
      to: "/dashboard/images",
    },
    {
      title: "النصوص",
      icon: <FaTextHeight className="size-8" />,
      to: "/images",
    },
    {
      title: "عن الشركة",
      icon: <FcAbout className="size-8" />,
      to: "/images",
    },
    {
      title: "قيم الشركة",
      icon: <FcCheckmark className="size-8" />,
      to: "/images",
    },
    {
      title: "رسالة الشركة",
      icon: <GoGoal className="size-8" />,
      to: "/images",
    },

    {
      title: "معلومات الاتصال",
      icon: <RiContactsBook3Line className="size-8" />,
      to: "/images",
    },
    {
      title: "روابط نهاية الموقع",
      icon: <LiaLinkSolid className="size-8" />,
      to: "/images",
    },
    {
      title: "عنوان الشركة",
      icon: <FaMapMarkerAlt className="size-8" />,
      to: "/images",
    },
  ];

  return (
    <section className=" ">
      <div className="mx-auto max-w-screen-xl px-4  sm:px-6 sm:py-12 lg:px-8 ">
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 max-sm:grid-cols-2 lg:grid-cols-4">
          {cardsData.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              icon={item.icon}
              to={item.to}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="#"
            className="inline-block rounded  px-12 py-3 text-sm font-medium text-white transition  focus:outline-none focus:ring "
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
}
