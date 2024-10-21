import React from "react";
import ContanctUS from "../_webiste/ContanctUS";
import dynamic from "next/dynamic";
import FAQComponant from "./FAQ";
import Quations_Answers from "../_FAQ/Quations_Answers";

export default function Contactus_FAQ() {
  const DynamicMap = dynamic(() => import("../MapComponent"), {
    ssr: false,
  });
  return (
    <div>
      <Quations_Answers />
      <ContanctUS />
      <DynamicMap />
    </div>
  );
}
