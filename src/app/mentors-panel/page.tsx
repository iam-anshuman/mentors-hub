'use client'
import React,{useState,useRef, useEffect, use} from 'react';
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    DocumentData,
    where
} from "firebase/firestore";
import { db,auth } from "@/FirebaseConfig";
import { useAuth } from '@/lib/authContext';


export default function MentorsPanel() {
    const [mentors,setMentors] = useState<DocumentData[]>();
    const [mentorId,setMentorId] = useState<string>("");
    const [messages,setMessages] = useState<DocumentData[]>();
    const [loading,setLoading] = useState<boolean>(false);
    const [role,setRole] = useState<string>("");    
    const {user} = useAuth();
    console.log(user);

    useEffect(()=>{
        setLoading(true);
        const q = query(collection(db,"users"),where("role","==","mentor"));
        const unsubscribe = onSnapshot(q,(querySnapshot)=>{
            const mentorArray = querySnapshot.docs.map((doc)=>doc.data());
            setMentors(mentorArray);
            setLoading(false);
        });
        return () => unsubscribe();
    },[]);



    function handleMessages(id:string){
        console.log("Handle Messages",id);
        setLoading(true);
        setMentorId(id);
        const q = query(collection(db,"messages"),where("mentorId","==",id),orderBy("timestamp"),limit(10));
        const unsubscribe = onSnapshot(q,(querySnapshot)=>{
            const receivedMessages = querySnapshot.docs.map((doc)=>doc.data());
            setMessages(receivedMessages);
            console.log(receivedMessages);
            setLoading(false);
        });
        return () => unsubscribe();
    }

  return (
    <>
    <section className='min-h-screen'>

        <h1 className='text-center text-2xl font-bold'>Mentors Panel</h1>
        <p className='text-center'>Here you can manage your students and their progress</p>
        { user?.role === "mentee" ?

            <div className='text-center my-20 text-xl'>You are not authorized to view this page</div>
            :
            <div className='my-5'>
            <div className='grid grid-cols-5 place-items-center'>
                {mentors && mentors?.map((mentor,index)=>(
                    <div className='my-4 ring-2 p-4 rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-900 hover:text-white min-w-56' key={mentor.id} onClick={()=>{handleMessages(mentor.id)}}>
                        <div>{mentor.name}</div>
                        <div>{mentor.experience}</div>
                        <div>{mentor.specialization}</div>
                    </div>
                ))}
            </div>
        </div>
    }
    </section>
    </>
  )
}
