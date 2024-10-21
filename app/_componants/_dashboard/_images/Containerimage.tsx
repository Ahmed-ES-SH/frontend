/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Img from "@/app/_componants/Image";
import Change_img from "@/app/_componants/_dashboard/_images/Change_img";
import React, { useRef, useState } from "react";

interface props {
  title: string;
  mainimage: string;
}

export default function ContainerImage({ title, mainimage }: props) {
  const openinput = useRef<any>(null);
  const [image, setimage] = useState<any>("");

  const onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setimage(e.target.files[0]);
    }
  };
  return (
    <>
      <div className="w-full px-4">
        <section>
          <h2 className="text-[18px] w-[90%] whitespace-nowrap mt-6 mx-auto ">
            {title} :
          </h2>
          <div className="mx-auto border w-[90%] max-auto mt-4 border-gray-400 rounded-md shadow-md  px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <div className=" gap-4 flex items-center justify-between max-lg:flex-col relative">
              <div className="relative flex flex-col gap-3 items-center h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
                {image ? (
                  <Img
                    imgsrc={URL.createObjectURL(image)}
                    styles="  h-full w-[200px] object-contain"
                  />
                ) : (
                  <Img
                    imgsrc={
                      mainimage ? mainimage : "/public/portfoliosection/3.jpg"
                    }
                    styles="  h-full w-[200px] object-contain"
                  />
                )}
                <button
                  onClick={() => openinput.current.click()}
                  className="px-4 py-2 text-white rounded-md shadow-md bg-main_red hover:bg-transparent hover:border-main_red border border-transparent hover:text-black duration-300"
                >
                  تغيير
                </button>
              </div>

              <Change_img newimage={image} mianimage={mainimage} />
            </div>
          </div>
        </section>
        <input onChange={onchange} ref={openinput} type="file" hidden />
      </div>
    </>
  );
}
