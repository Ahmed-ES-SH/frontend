"use client";
import HeadTable from "@/app/_componants/_dashboard/Head_table";
import PaginatedTable from "@/app/_componants/PagenationTable.jsx";
import { Usevariables } from "@/app/context/VariablesProvider";
import React from "react";

export default function Users() {
  const { language } = Usevariables();
  const headers = [
    "id",
    "الصورة",
    "الإسم",
    "البريد الإلكترونى ",
    "نوع الحساب",
    "وقت الإنشاء",
  ];
  const keys = ["id", "image", "name", "email", "role", "created_at"];
  return (
    <>
      <HeadTable
        title="المستخدمين"
        linktitle="أضف مستخدم جديد "
        path="/dashbord/adduser"
      />
      <PaginatedTable
        keys={keys}
        headers={language == "en" ? keys : headers}
        api="/users"
        apidelete="/user"
      />
    </>
  );
}
