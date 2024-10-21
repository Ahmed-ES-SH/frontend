import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientLayout from "./_componants/ClientLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "مدد للدعاية والاعلان ",
  description:
    "شركة مدد للدعاية والاعلان والتخصص فى الخدمات الافتراضية مثل - (بناء التطبيقات - بناء المواقع الالكترونية - تنيظم حملات التسويق - مراجعة الخطط التسويقية وتطويرها - بناء خطط تسويقية تناسب السوق المستهدف - بناء إحصائيات تخص النظام الاقتصادى للسوق المستهدف )",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
