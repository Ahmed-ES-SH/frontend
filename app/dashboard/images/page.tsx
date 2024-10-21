import ContainerImage from "@/app/_componants/_dashboard/_images/Containerimage";
import React from "react";

export default function page() {
  return (
    <>
      <div className="w-full flex items-center flex-col gap-2">
        <ContainerImage
          mainimage={"/image-3-copyright.svg"}
          title={"صورة الواجهة الرئيسية"}
        />
        <ContainerImage
          mainimage={"/madad-hero-2.png"}
          title={"صورة عن الشركة الرئيسية "}
        />
        <ContainerImage
          mainimage={"/madad-hero-3.png"}
          title={"صورة قيم الشركة"}
        />
        <ContainerImage
          mainimage={"/Mudd-Hero-3-repng.png"}
          title={"صورة قائمة الأسئلة - الرئيسية"}
        />
        <ContainerImage
          mainimage={"/contact-bg.jpg"}
          title={"صورة اتصل بنا - الرئيسية :"}
        />
      </div>
    </>
  );
}
