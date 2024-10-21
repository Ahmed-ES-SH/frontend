/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { Usevariables } from "@/app/context/VariablesProvider";
import { instance } from "@/app/Api/axios";

// حل مشكلة الأيقونة الافتراضية لـ Marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapDash({ setLocation }) {
  const { language } = Usevariables();
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("Loading address..."); // قيمة افتراضية

  // دالة لجلب بيانات الاتصال عند تحميل المكون
  const fetchContactInfo = async () => {
    try {
      const response = await instance.get("/getContactInfo");
      const data = response.data;

      // تحقق من وجود العنوان
      console.log("Fetched data:", data);
      const latLng = JSON.parse(data.address); // تأكد من أن العنوان موجود ككائن JSON
      console.log(latLng);

      // تحقق من وجود الإحداثيات
      if (latLng && latLng.lat && latLng.lng) {
        setPosition({ lat: latLng.lat, lng: latLng.lng });
        setLocation({ lat: latLng.lat, lng: latLng.lng }); // تحديث الموقع

        // جلب العنوان باستخدام الإحداثيات
        await getAddress(latLng.lat, latLng.lng);
      } else {
        console.error("Invalid latLng data:", latLng);
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  // عند النقر على الخريطة
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        // جلب العنوان باستخدام API Nominatim
        getAddress(e.latlng.lat, e.latlng.lng);
        // تحديث الموقع باستخدام دالة setLocation
        const newLocation = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setLocation(newLocation);
      },
    });

    return position === null ? null : <Marker position={position}></Marker>;
  };

  // دالة لجلب العنوان باللغة العربية باستخدام الإحداثيات
  const getAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Address not found");
    }
  };

  return (
    <div>
      <MapContainer
        center={position || [23.8859, 45.0792]} // استخدام الموقع الحالي إذا كان موجودًا
        zoom={6}
        style={{ height: "400px", width: "100%" }} // تحديد حجم الخريطة
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
      {address && (
        <div>
          <h3 className="text-[18px] my-2 pb-2 border-b border-black">
            {language === "en" ? "Selected Address: " : "العنوان المختار:"}
          </h3>
          <p>{address}</p>
        </div>
      )}
    </div>
  );
}
