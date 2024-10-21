import React from "react";
import SignUp from "../_componants/_Auth/SignUp";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "مدد للدعاية الإعلان |إنشاء حساب",
  description: "مدد للدعاية الإعلان |إنشاء حساب",
};
export default function page() {
  return (
    <>
      <SignUp />
    </>
  );
}
