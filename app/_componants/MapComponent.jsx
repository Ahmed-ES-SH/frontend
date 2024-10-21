"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { instance } from "../Api/axios";

// إصلاح مشكلة الأيقونات الافتراضية في Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function CompanyMap() {
  const [showMap, setShowMap] = useState(false); // حالة التحكم في إظهار الخريطة
  const position = [31.2156, 29.9553]; // إحداثيات العنوان (مثال: الإسكندرية، مصر)

  const fetchContactInfo = async () => {
    try {
      const response = await instance.get("/getContactInfo");
      const data = response.data;
      setShowMap(data.show_map); // جلب قيمة show_map
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  // شرط لعرض الخريطة
  if (showMap == "false") {
    return null; // إذا كانت show_map false، لا ترجع شيئًا
  }

  return (
    <div className="w-full h-[500px] shadow-lg rounded-xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          height: "50vh",
          width: "98%",
          margin: "auto",
          borderRadius: "15px",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            شركتنا هنا! <br /> العنوان الدقيق.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
