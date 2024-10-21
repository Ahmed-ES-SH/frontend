import React from "react";
import Navbar from "../_componants/_webiste/Navbar";
import Footer from "../_componants/_webiste/Footer";
import PortfolioSection from "../_componants/_portfolio/PortfolioSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدد للدعاية الإعلان | أعمال الشركة",
  description: "مدد للدعاية الإعلان | أعمال الشركة",
};

export default function page() {
  return (
    <>
      <Navbar />
      <PortfolioSection />
      <Footer />
    </>
  );
}
