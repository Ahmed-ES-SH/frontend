import React from "react";
import Aboutus from "../_componants/_ِِAboutus/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدد للدعاية الإعلان | عن الشركة",
  description: "مدد للدعاية الإعلان | عن الشركة",
};

export default function page() {
  return (
    <>
      <Aboutus />
    </>
  );
}
