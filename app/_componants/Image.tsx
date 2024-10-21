import Image from "next/image";
import React from "react";

interface props {
  styles: string;
  imgsrc: string;
}

export default function Img({ styles, imgsrc }: props) {
  return (
    <>
      <Image
        src={imgsrc}
        alt="Image"
        width={1280}
        height={1024}
        className={`${styles}`}
      />
    </>
  );
}
