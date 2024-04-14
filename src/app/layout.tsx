import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "Mentors School",
  description: "A hub for learning and mentorship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
        <AuthProvider>
        <body suppressHydrationWarning={true} >
            <Navbar/>
              {children}
            <Footer/>
        </body>
      </AuthProvider>
      </html>
);
}
