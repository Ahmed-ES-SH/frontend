"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { instance } from "@/app/Api/axios";
import LoadingSpiner from "./LoadingSpiner";
import { Usevariables } from "../context/VariablesProvider";

{
  /*
///////////////////////////////////////////////////////////////////       
////////////////////////////////  
//////////////////////////////// End of Imports lines
////////////////////////////////                                
//////////////////////////////////////////////////////////
  */
}

interface Type {
  inputs: { [key: string]: string }[];
  api: string;
  direct: string;
}

interface Typeform {
  [key: string]: any;
}

{
  /*
  ///////////////////////////////////////////////////////////////////       
  ////////////////////////////////  
  //////////////////////////////// End of types lines
  ////////////////////////////////                                
  //////////////////////////////////////////////////////////
    */
}

const DynamicPage: React.FC<Type> = ({ inputs, api, direct }) => {
  const { language } = Usevariables();
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [loading, setloading] = useState<boolean>(false);
  const [category, setCategory] = useState<any>(null);
  const [form, setForm] = useState<Typeform>({});
  const [initialForm, setInitialForm] = useState<Typeform>({}); // حفظ البيانات الأصلية للمقارنة
  const [errors, seterrors] = useState<any>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const openInput = useRef<HTMLInputElement | null>(null);
  console.log(form);

  useEffect(() => {
    const initialFormState = inputs.reduce(
      (acc: { [key: string]: string }, input: { [key: string]: string }) => {
        acc[input.name] = "";
        return acc;
      },
      {} as { [key: string]: string }
    );

    setForm(initialFormState);
    setInitialForm(initialFormState); // تخزين القيم الأولية
  }, [inputs]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await instance.get(`${api}/${id}`);
        setCategory(response.data.data);

        const initialFormState = inputs.reduce((acc, input) => {
          acc[input.name] = response.data.data[input.name] || "";
          return acc;
        }, {} as { [key: string]: string });

        setForm(initialFormState);
        setInitialForm(initialFormState); // حفظ البيانات الأصلية عند التحميل
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, [id, api, inputs]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setForm({
        ...form,
        [e.target.name]: e.target.files[0],
      });
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImages(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setloading(true);
      const formData = new FormData();

      // أضف فقط الحقول التي تم تعديلها
      for (const key in form) {
        if (form[key] !== initialForm[key]) {
          // مقارنة القيم الحالية بالقيم الأصلية
          formData.append(key, form[key]);
        }
      }

      // إضافة الصور
      if (selectedImages.length > 0) {
        selectedImages.forEach((file) => {
          formData.append("images[]", file);
        });
      }

      const res = await instance.post(`${api}/${id}`, formData);
      console.log(res);
      router.push(direct);
    } catch (error: any) {
      setloading(false);
      console.log("Error:", error);
      seterrors(error.response?.data?.errors || {});
    }
  };

  {
    /*
    ///////////////////////////////////////////////////////////////////       
    ////////////////////////////////  
    //////////////////////////////// End of dynamic functions lines
    ////////////////////////////////                                
    //////////////////////////////////////////////////////////
      */
  }

  console.log(form);

  return (
    <>
      {loading && <LoadingSpiner />}
      {category !== null ? (
        <div className="h-[90vh] overflow-y-auto hidden-scrollbar w-full">
          <div className="mt-16 head flex items-start max-lg:items-center border-b px-2 border-gray-300/30 pb-4">
            <h1 className="text-xl dark:text-white">
              {category[inputs[0].name]}
            </h1>
          </div>
          <div className="flex items-start gap-1 w-full h-full">
            <form
              className="px-4 relative hidden-scrollbar max-lg:w-3/4 m-auto w-[90%] h-[70vh] overflow-y-auto dark:bg-secend_dash bg-light_bg mt-8 z-[3] bg-transparent"
              onSubmit={handleSubmit}
            >
              {/*
    ///////////////////////////////////////////////////////////////////       
    ////////////////////////////////  
    //////////////////////////////// start of dynamic inputs lines
    ////////////////////////////////                                
    //////////////////////////////////////////////////////////
      */}
              {inputs.map((input: { [key: string]: string }, index: number) => (
                <div key={index}>
                  <label
                    htmlFor={input.name}
                    className="block text-sm font-medium text-secend_text max-lg:dark:text-white max-lg:font-light font-serif text-md py-2"
                  >
                    {input.label}
                  </label>
                  <input
                    ref={input.type === "file" ? openInput : null}
                    id={input.name}
                    className={`${
                      input.type === "file" ? "hidden" : ""
                    } p-4 duration-150 outline-none focus:valid:border-green-400 focus:invalid:border-red-400 border-4 border-gray-300 my-2 w-full rounded-md text-sm text-gray-700 shadow-sm`}
                    name={input.name}
                    type={input.type}
                    onChange={
                      input.type === "file"
                        ? input.name === "images"
                          ? handleImagesChange
                          : handleImageChange
                        : handleChange
                    }
                    multiple={input.name === "images"}
                    {...(input.type !== "file" && { value: form[input.name] })}
                  />
                  {input.name === "image" && (
                    <div className="group w-1/2 h-full relative cursor-pointer mt-4">
                      <label
                        className="block cursor-pointer text-sm font-medium text-secend_text max-lg:dark:text-white max-lg:font-light font-serif text-md py-2 after:content-[''] after:w-0 after:h-[90%] after:bg-black/40 after:absolute after:bottom-0 after:left-0 after:invisible before:content-['تغيير'] before:dark:text-white before:w-[160px] before:h-[50px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-0 before:absolute before:flex before:items-center before:justify-center before:bg-sky-400 before:rounded-md before:z-[22] before:invisible group-hover:before:visible group-hover:before:left-1/2 group-hover:before:duration-200 group-hover:after:visible group-hover:after:duration-200 group-hover:after:w-full duration-200"
                        onClick={() => openInput.current?.click()}
                      >
                        {language == "en" ? "Image:" : " صورة:"}
                      </label>

                      {typeof form[input.name] == "string" ? (
                        <Image
                          key={index}
                          src={form[input.name]}
                          alt="image"
                          width={1024}
                          height={1280}
                          className="w-full h-[250px]  max-md:h-full rounded-md shadow-lg"
                        />
                      ) : (
                        <Image
                          src={URL.createObjectURL(form[input.name])}
                          alt="image"
                          width={1024}
                          height={1280}
                          className="w-full h-[250px] max-md:w-full max-md:h-full rounded-md shadow-lg"
                        />
                      )}
                    </div>
                  )}

                  {input.type === "file" && input.name === "logo" && (
                    <div className="group w-full h-full relative cursor-pointer mt-4">
                      <label
                        className="block cursor-pointer text-sm font-medium text-secend_text max-lg:dark:text-white max-lg:font-light font-serif text-md py-2 after:content-[''] after:w-0 after:h-[90%] after:bg-black/40 after:absolute after:bottom-0 after:left-0 after:invisible before:content-['Change'] before:dark:text-white before:w-[160px] before:h-[50px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-0 before:absolute before:flex before:items-center before:justify-center before:bg-orange-400 before:rounded-md before:z-[22] before:invisible group-hover:before:visible group-hover:before:left-1/2 group-hover:before:duration-200 group-hover:after:visible group-hover:after:duration-200 group-hover:after:w-full duration-200"
                        onClick={() => openInput.current?.click()}
                      >
                        صورة:
                      </label>
                      {typeof form[input.name] == "string" ? (
                        <Image
                          key={index}
                          src={form[input.name]}
                          alt="image"
                          width={1024}
                          height={1280}
                          className="w-1/2 h-[250px] max-md:w-full max-md:h-full rounded-md shadow-lg"
                        />
                      ) : (
                        <Image
                          src={URL.createObjectURL(form[input.name])}
                          alt="image"
                          width={1024}
                          height={1280}
                          className="w-1/2 h-[250px] max-md:w-full max-md:h-full rounded-md shadow-lg"
                        />
                      )}
                    </div>
                  )}

                  {input.type === "file" && input.name === "images" && (
                    <div className=" h-full w-fit group relative cursor-pointer mt-4">
                      <label
                        onClick={() => openInput.current?.click()}
                        className="block cursor-pointer text-sm font-medium text-secend_text max-lg:dark:text-white max-lg:font-light font-serif text-md py-2 after:content-[''] after:w-0 after:h-full after:bg-black/40 after:absolute after:top-0 after:left-0 after:invisible before:content-['Change'] before:dark:text-white before:w-[160px] before:h-[50px] before:-translate-x-1/2 before:-translate-y-1/2 before:top-1/2 before:left-0 before:absolute before:flex before:items-center before:justify-center before:bg-orange-400 before:rounded-md before:z-[22] before:invisible group-hover:before:visible group-hover:before:left-1/2 group-hover:before:duration-200 group-hover:after:visible group-hover:after:duration-200 group-hover:after:w-full duration-200"
                      >
                        صور:
                      </label>

                      {selectedImages.length > 0 ? (
                        <div className="flex items-center flex-wrap overflow-hidden gap-2 h-fit ">
                          {selectedImages.map((file, index) => (
                            <Image
                              key={index}
                              src={URL.createObjectURL(file)}
                              alt="image"
                              width={1024}
                              height={1280}
                              className="w-[150px] rounded-md shadow-lg"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 h-fit flex-wrap overflow-hidden ">
                          {Array.isArray(form[input.name]) &&
                            form[input.name].map(
                              (src: string, index: number) => (
                                <Image
                                  key={index}
                                  src={src}
                                  alt="image"
                                  width={1024}
                                  height={1280}
                                  className="w-[150px] rounded-md shadow-lg"
                                />
                              )
                            )}
                        </div>
                      )}
                    </div>
                  )}
                  {errors !== null &&
                    errors[input.name] &&
                    errors[input.name].map((error: string, index: number) => (
                      <p
                        className="w-full px-2 py-1 my-1 bg-red-400 rounded-md text-white"
                        key={index}
                      >
                        {error}
                      </p>
                    ))}
                </div>
              ))}

              {api == "/user" && (
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium dark:text-white text-[22px] max-lg:font-light font-serif text-md py-2"
                  >
                    {language == "en" ? "Account Type" : "نوع الحساب :"}
                  </label>
                  <select
                    className="w-full rounded-md bg-secend_color dark:text-white dark:bg-main_dash shadow-md p-2 dark:border dark:border-secend_text outline-none"
                    name="role"
                    onChange={handleChange}
                    value={form.role || ""} // اجعل القيمة الافتراضية فارغة
                  >
                    <option value="" disabled>
                      {language == "en"
                        ? "Select Account Type"
                        : " حدد نوع الحساب"}
                    </option>
                    <option value="user">
                      {language == "en" ? "user" : "مستخدم"}
                    </option>
                    <option value="Admin">
                      {language == "en" ? "Admin" : "أدمن"}
                    </option>
                  </select>
                </div>
              )}

              {/*
    ///////////////////////////////////////////////////////////////////       
    ////////////////////////////////  
    //////////////////////////////// end of dynamic inputs lines
    ////////////////////////////////                                
    //////////////////////////////////////////////////////////
      */}
              <input
                type="submit"
                value="تعديل"
                className="w-fit px-8 py-2 my-3 rounded-md dark:text-white bg-sky-400 text-center  cursor-pointer mr-auto"
              />
            </form>
            <Image
              src={"/undraw.svg"}
              alt="catedit"
              width={1024}
              height={1280}
              className="w-[50%] object-contain h-full rounded-md mt-4 max-lg:hidden"
            />
          </div>
        </div>
      ) : (
        <LoadingSpiner />
      )}
    </>
  );
};

export default DynamicPage;
