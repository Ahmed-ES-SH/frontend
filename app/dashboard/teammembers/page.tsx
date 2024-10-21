/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/Api/axios";
import Img from "@/app/_componants/Image";
import Link from "next/link";
import { Usevariables } from "@/app/context/VariablesProvider";
import { FaPlusCircle } from "react-icons/fa";
import LoadingSpiner from "@/app/_componants/LoadingSpiner";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  facebook: string;
  X_Account: string;
  instagram: string;
  image: string;
}

const TeamMembersComponent = () => {
  const { language } = Usevariables();
  const openinput = useRef<any>(null);
  const [loading, setloading] = useState(true);
  const [editimage, seteditimage] = useState<null | File>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null); // New state

  // Fetch all team members
  const fetchTeamMembers = async () => {
    try {
      const response = await instance.get("/team-members");
      setTeamMembers(response.data.data);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error fetching team members", error);
    } finally {
      setloading(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = async (id: number) => {
    try {
      setloading(true);
      await instance.delete(`/team-member/${id}`);
      setTeamMembers(teamMembers.filter((member) => member.id !== id));
      setDeleteMemberId(null); // Close confirmation after deletion
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error deleting member", error);
    }
  };

  // Open the edit popup
  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsPopupOpen(true);
  };

  // Update the member information along with image
  const handleUpdate = async (updatedMember: TeamMember) => {
    try {
      setloading(true);
      const formData = new FormData();
      formData.append("name", updatedMember.name);
      formData.append("position", updatedMember.position);
      formData.append("facebook", updatedMember.facebook);
      formData.append("X_Account", updatedMember.X_Account);
      formData.append("instagram", updatedMember.instagram);
      if (editimage) {
        formData.append("image", editimage); // Append image if selected
      }

      await instance.post(`/team-member/${updatedMember.id}`, formData);
      setTeamMembers(
        teamMembers.map((member) =>
          member.id === updatedMember.id ? updatedMember : member
        )
      );
      setIsPopupOpen(false);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error("Error updating member", error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleimagechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      seteditimage(files[0]);
    }
  };

  return (
    <>
      {loading ? (
        <div className="h-screen relative">
          <LoadingSpiner />
        </div>
      ) : (
        <div className="w-full mt-20 bg-gray-100 rounded-md dark:bg-secend_dash dark:text-secend_text ">
          <Link
            className=" flex items-center gap-3 w-fit px-4 py-2 text-white shadow-md rounded-md bg-green-400 duration-200  border border-transparent hover:text-black hover:bg-transparent hover:border-green-400"
            href={"/dashboard/addmember"}
          >
            <p>{language == "en" ? "Add New Member" : "أضف عضو جديد"}</p>
            <FaPlusCircle />
          </Link>
          <h1 className="w-fit mx-auto text-xl my-4 text-main_text dark:text-white">
            {language == "en" ? "Team Members" : "أعضاء الفريق"}
          </h1>
          <div className="grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                className="border p-4 h-[300px] max-lg:h-[450px] flex flex-col  justify-between rounded-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex max-lg:flex-col-reverse max-lg:justify-center items-center justify-between">
                  <div className="">
                    <h2 className="text-xl font-semibold">{member.name}</h2>
                    <p className="text-gray-600">{member.position}</p>
                    <div className="flex flex-col gap-2 my-2">
                      <Link
                        className="px-2 py-1 rounded-sm shadow-sm bg-main_blue text-white"
                        href={member.facebook}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Facebook
                      </Link>
                      <Link
                        className="px-2 py-1 rounded-sm shadow-sm bg-black/50 text-white"
                        href={member.X_Account}
                        target="_blank"
                        rel="noreferrer"
                      >
                        X
                      </Link>
                      <Link
                        className="px-2 py-1 rounded-sm shadow-sm bg-red-400 text-white"
                        href={member.instagram}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Instagram
                      </Link>
                    </div>
                  </div>
                  <Img
                    imgsrc={member.image ? member.image : "/avatar-2.jpg"}
                    styles="w-[150px] rounded-md"
                  />
                </div>
                <div className="flex w-full gap-3 self-end max-lg:self-center max-lg:w-fit mt-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => handleEdit(member)}
                  >
                    {language == "en" ? "Edit" : "تعديل"}
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => setDeleteMemberId(member.id)} // Set the specific member for deletion
                  >
                    {language == "en" ? "Delete" : "حذف"}
                  </button>
                </div>

                {deleteMemberId === member.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded">
                      <p>
                        {language == "en"
                          ? "Are You Sure you want deleted this member ?"
                          : "هل أنت متأكد من حذف العضو؟"}
                      </p>
                      <div className="flex space-x-4 mt-4">
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() => handleDelete(member.id)}
                        >
                          {language == "en" ? "yes" : "نعم"}
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-500 text-white rounded"
                          onClick={() => setDeleteMemberId(null)} // Close confirmation
                        >
                          {language == "en" ? "No" : "لا"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {isPopupOpen && selectedMember && (
              <div className="fixed mt-16 inset-0 bg-main_dash bg-opacity-50 flex items-center justify-center">
                <div className="bg-white w-[85%] max-md:w-[95%] p-6 rounded">
                  <h2 className="text-xl font-semibold">تعديل معلومات العضو</h2>
                  <div className="flex max-md:flex-col items-center justify-between gap-6 mt-3 w-full">
                    <div onClick={() => openinput.current.click()}>
                      {editimage ? (
                        <Img
                          imgsrc={URL.createObjectURL(editimage)}
                          styles="w-[150px] rounded-md"
                        />
                      ) : (
                        <Img
                          imgsrc="/avatar-2.jpg"
                          styles="w-[150px] rounded-md"
                        />
                      )}
                    </div>
                    <form
                      className="w-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(selectedMember);
                      }}
                    >
                      <input
                        type="text"
                        className="block w-full border p-2 mt-4"
                        placeholder="الاسم"
                        value={selectedMember.name}
                        onChange={(e) =>
                          setSelectedMember({
                            ...selectedMember,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="block w-full border p-2 mt-4"
                        placeholder="الوظيفة"
                        value={selectedMember.position}
                        onChange={(e) =>
                          setSelectedMember({
                            ...selectedMember,
                            position: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="block w-full border p-2 mt-4"
                        placeholder="Facebook"
                        value={selectedMember.facebook}
                        onChange={(e) =>
                          setSelectedMember({
                            ...selectedMember,
                            facebook: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="block w-full border p-2 mt-4"
                        placeholder="X"
                        value={selectedMember.X_Account}
                        onChange={(e) =>
                          setSelectedMember({
                            ...selectedMember,
                            X_Account: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        className="block w-full border p-2 mt-4"
                        placeholder="Instagram"
                        value={selectedMember.instagram}
                        onChange={(e) =>
                          setSelectedMember({
                            ...selectedMember,
                            instagram: e.target.value,
                          })
                        }
                      />

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
                        >
                          {language == "en" ? "update" : "تحديث"}
                        </button>
                        <button
                          onClick={() => setIsPopupOpen(false)}
                          className="px-4 py-2 bg-red-500 text-white rounded mt-4"
                        >
                          {language == "en" ? "cancle" : "إلغاء"}
                        </button>
                      </div>
                    </form>
                  </div>
                  <input
                    type="file"
                    hidden
                    ref={openinput}
                    onChange={handleimagechange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TeamMembersComponent;
