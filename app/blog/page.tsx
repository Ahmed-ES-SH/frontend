import React from "react";
import Blogpage from "../_componants/_blog/Blogpage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدد للدعاية الإعلان | المدونة",
  description: "مدد للدعاية الإعلان | المدونة",
};

export default function page() {
  return (
    <>
      <Blogpage />
    </>
  );
}
