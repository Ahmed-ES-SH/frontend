/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { instance } from "@/app/Api/axios";
import { Usevariables } from "@/app/context/VariablesProvider";
import Navbar from "@/app/_componants/_webiste/Navbar";
import Footer from "@/app/_componants/_webiste/Footer";

const BlogPost = ({ params }) => {
  const { language } = Usevariables();
  const postId = params.blogid;
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await instance.get(`/blog-posts/${postId}`);
        setPost(response.data.data);
        const relatedResponse = await instance.get(`/blog-posts?page=1`);
        setRelatedPosts(relatedResponse.data.data);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل المقال.");
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <div className="text-center py-10">جارٍ التحميل...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="w-[80%] pt-36 mb-4 mx-auto p-6 bg-white rounded-lg shadow-md">
        <motion.h1
          className="text-3xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {language == "en" ? post.title_en : post.title_ar}
        </motion.h1>

        {
          <motion.img
            src={post.image ? post.image : "/portfoliosection/5.jpg"}
            className="mb-4  w-full h-72 object-cover rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        }

        <motion.div
          className="post-content mb-6"
          dangerouslySetInnerHTML={{
            __html: language == "en" ? post.content_en : post.content_ar,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        <div className="flex justify-between mb-4">
          <span className="text-gray-600">
            المؤلف: {post.author || "Admin"}
          </span>
          <span className="text-gray-600">
            تاريخ النشر: {new Date(post.published_date).toLocaleDateString()}
          </span>
        </div>

        <div className="mb-4">
          <span className="font-semibold">الفئة: </span>
          {post.category}
        </div>

        {post.tags && (
          <div className="mb-4">
            <span className="font-semibold">العلامات: </span>
            {post.tags.split(",").map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 rounded-full px-2 py-1 mr-2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-4">اقتراحات مشابهة</h2>
        <div className="related-posts space-y-4">
          {relatedPosts.length > 0 ? (
            relatedPosts.map((relatedPost) => (
              <motion.div
                key={relatedPost.id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold">
                  {language == "en"
                    ? relatedPost.title_en
                    : relatedPost.title_ar}
                </h3>
                <p className="text-gray-600">
                  {language == "en"
                    ? relatedPost.content_en
                    : relatedPost.content_ar}
                </p>
                <a
                  href={`/blog/${relatedPost.id}`}
                  className="text-blue-500 underline"
                >
                  اقرأ المزيد
                </a>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">لا توجد مقالات مشابهة.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPost;
