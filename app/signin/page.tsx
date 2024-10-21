import React from "react";
import SignIn from "../_componants/_Auth/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدد للدعاية الإعلان | تسجيل دخول",
  description: "مدد للدعاية الإعلان | تسجيل دخول",
};

export default function page() {
  return (
    <>
      <SignIn />
    </>
  );
}
