/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Particle = () => {
  // دالة للحصول على موضع عشوائي
  const getRandomPosition = () => {
    const x = Math.random() * 100; // موضع عشوائي على المحور X
    const y = Math.random() * 100; // موضع عشوائي على المحور Y
    return { x, y };
  };

  const [particles, setParticles] = useState(
    Array.from({ length: 50 }, () => getRandomPosition()) // إنشاء المواقع العشوائية للجزيئات
  );

  const updateParticles = () => {
    setParticles((prevParticles) =>
      prevParticles.map(() => getRandomPosition())
    );
  };

  useEffect(() => {
    const interval = setInterval(updateParticles, 2000); // تحديث المواقع كل 2 ثانية
    return () => clearInterval(interval); // تنظيف عند فك التركيب
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        zIndex: "0",
        backgroundColor: "transparent",
      }}
    >
      {particles.map((position, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            width: "8px",
            height: "8px",
            backgroundColor: "#007baa",
            borderRadius: "50%",
            left: `${position.x}vw`, // موضع X عشوائي
            top: `${position.y}vh`, // موضع Y عشوائي
          }}
          animate={{
            opacity: [1, 0], // تقليل الشفافية
          }}
          transition={{
            duration: Math.random() * 1 + 1, // مدة الحركة عشوائية
            repeat: Infinity,
            ease: "easeInOut", // تغيير سلاسة الحركة
          }}
        />
      ))}
    </div>
  );
};

export default Particle;
