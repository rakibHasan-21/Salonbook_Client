import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SiteLayout from "@/components/shared/SiteLayout";
import ToastFromQuery from "@/components/shared/ToastFromQuery";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SalonBook",
  description: "Salon Appointment Booking Platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col" cz-shortcut-listen="true">
        <SiteLayout>{children}</SiteLayout>

        <Suspense fallback={null}>
          <ToastFromQuery />
        </Suspense>

        <ToastContainer
          position="top-right"
          autoClose={3500}
          closeOnClick
          pauseOnHover
          pauseOnFocusLoss
          draggable
          limit={3}
          newestOnTop
          theme="light"
        />
      </body>
    </html>
  );
}

