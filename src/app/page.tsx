'use client'
import React,{useState,useEffect} from "react";
import {auth} from "@/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import AboutSection from "./Components/AboutSection";
import HeroSection from "./Components/HeroSection";
import Testimonial from "./Components/Testimonial";
import { useAuth } from "@/lib/authContext";


export default function Home() {

  const {user,setUser} = useAuth();


  return (
    <>
      <HeroSection/>
      <AboutSection/>
      <Testimonial/>
    </>
  );
}
