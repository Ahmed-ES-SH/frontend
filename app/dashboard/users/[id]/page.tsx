"use client";
import DynamicPage from "@/app/_componants/DynamicPage";
import { Usevariables } from "@/app/context/VariablesProvider";
import React from "react";

export default function EditUserPage() {
  const { language } = Usevariables();
  const inputs: {
    [key: string]: string;
  }[] = [
    {
      name: "name",
      label: language == "en" ? "name" : "الاسم :",
      type: "text",
    },
    {
      name: "email",
      label: language == "en" ? "Email" : "البريد الالكترونى :",
      type: "email",
    },
    // {
    //   name: "phone_number",
    //   label: language == "en" ? "Phone Number" : " رقم الجوال  :",
    //   type: "text",
    // },
    { name: "image", type: "file" },
  ];
  return (
    <>
      <div>
        <DynamicPage inputs={inputs} api="/user" direct="/dashboard/users" />
      </div>
    </>
  );
}
