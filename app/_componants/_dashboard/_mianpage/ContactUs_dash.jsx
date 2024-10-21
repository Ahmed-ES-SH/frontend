"use client";
import React, { useRef, useState, useEffect } from "react";
import Img from "../../Image";
import LoadingSpiner from "../../LoadingSpiner";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";

export default function ContanctUS_dash() {
  const { language } = Usevariables();
  const [image, setimage] = useState("");
  const [currentimage, setcurrentimage] = useState("");
  const [loading, setloading] = useState(false);
  const openinput = useRef(null);

  const onchange = (e) => {
    setimage(e.target.files[0]);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get("/contactimage");
        const data = response.data.contact_img;

        // تخزين البيانات في الحالة
        if (data) {
          setcurrentimage(data); // تأكد من أن لديك حقل للصورة في البيانات المسترجعة
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const updateimage = async () => {
    const formData = new FormData();
    if (image) formData.append("contact_img", image);
    try {
      setloading(true);
      const response = await instance.post(`/updateContactImage`, formData);
      console.log(response.data.message);
      setloading(false);
    } catch (error) {
      console.error("Error updating text:", error);
      setloading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpiner />
      ) : (
        <section
          id="contactus"
          className="bg-gray-100 dark:bg-secend_dash py-3"
        >
          <input
            onChange={onchange}
            type="file"
            name=""
            hidden
            ref={openinput}
          />
          <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="title relative w-fit group">
              <h1 className=" text-4xl text-main_blue    duration-200">
                Contact us
              </h1>
              <div className="line group-hover:w-full duration-300 w-0 bg-sky-400 h-[2px] absolute"></div>
              <div className="circle group-hover:visible duration-300 w-[3px] invisible left-2 h-[3px] rounded-full bg-white z-[999] absolute"></div>
            </div>
            <div className="grid grid-cols-1 mt-2 lg:grid-cols-5">
              <div
                onClick={() => openinput.current.click()}
                className=" lg:col-span-2   w-full cursor-pointer  px-2 border-2 border-transparent hover:border-sky-400 transition-all duration-300"
              >
                {image ? (
                  <Img
                    imgsrc={URL.createObjectURL(image)}
                    styles="w-[1130px] self-center  relative rounded-md"
                  />
                ) : (
                  <Img
                    imgsrc={currentimage ? currentimage : "/contact-bg.jpg"}
                    styles="w-full h-full  object-cover"
                  />
                )}
              </div>

              <div className="rounded-lg dark:rounded-none bg-white dark:bg-main_dash p-8 shadow-lg lg:col-span-3 lg:p-12">
                <form action="#" className="space-y-4">
                  <div>
                    <label className="sr-only" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-300 outline-none shadow-md p-3 text-sm"
                      placeholder="Name"
                      type="text"
                      id="name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="sr-only" htmlFor="email">
                        Email
                      </label>
                      <input
                        className="w-full rounded-lg border-gray-300 outline-none shadow-md p-3 text-sm"
                        placeholder="Email address"
                        type="email"
                        id="email"
                      />
                    </div>

                    <div>
                      <label className="sr-only" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        className="w-full rounded-lg border-gray-300 outline-none shadow-md  p-3 text-sm"
                        placeholder="Phone Number"
                        type="tel"
                        id="phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="sr-only" htmlFor="message">
                      Message
                    </label>

                    <textarea
                      className="w-full h-[20vh] border border-gray-300 outline-none shadow-md rounded-lg  p-3 text-sm"
                      placeholder="Message"
                      id="message"
                    ></textarea>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="inline-block w-full rounded-lg bg-black dark:bg-main_orange px-5 py-3 font-medium text-white sm:w-auto"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <button
            onClick={updateimage}
            className="px-4 mx-auto mt-4 block w-fit h-fit shadow-md group overflow-hidden relative py-2 rounded-md bg-green-400"
          >
            {language == "en" ? "save" : "تحديث"}
          </button>
        </section>
      )}
    </>
  );
}
