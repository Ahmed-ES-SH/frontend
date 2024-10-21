import React from "react";
import Services from "../_componants/_services/Services";
import Navbar from "../_componants/_webiste/Navbar";
import Footer from "../_componants/_webiste/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدد للدعاية الإعلان | الخدمات",
  description: "مدد للدعاية الإعلان | الخدمات",
};

export default function page() {
  return (
    <>
      <Navbar />
      <Services />
      <Footer />
    </>
  );
}
