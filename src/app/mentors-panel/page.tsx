'use client'
import React,{useState,useRef, useEffect} from 'react';
import {
    addDoc,
    serverTimestamp,
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    DocumentData,
    where
} from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useAuth } from '@/lib/authContext';
import { SendIcon } from '../Components/Icons';


export default function MentorsPanel() {
    const [userMessaged,setUserMessaged] = useState<DocumentData[]>();
    const [receivedMessages,setReceivedMessages] = useState<DocumentData[]>();
    const [message,setMessage] = useState<string>("");
    const [loading,setLoading] = useState<boolean>(false);
    const {user} = useAuth();
    const chatContainerRef = useRef<HTMLElement|null>(null);

    useEffect(()=>{
        setLoading(true);
        const q = query(collection(db,"messages"),where("mentorId","==",user?.uid),orderBy("timestamp","asc"),limit(10));
        const unsubscribe = onSnapshot(q,(querySnapshot)=>{
            const usersMessages:DocumentData = [];
            querySnapshot.forEach((doc)=>{
                usersMessages.push({...doc.data(),id:doc.id});
                
            });
            const uniqueUsers = Object.values(usersMessages.reduce((acc:any,cur:any)=>{
                if(!acc[cur.uid]){
                    acc[cur.uid] = cur;
                }
                return acc;
            },{}));
            // console.log("Unique Users",uniqueUsers);
            setUserMessaged(uniqueUsers as DocumentData[]);
            setLoading(false);
        }, (error)=>{
            console.log(error);
            setLoading(false);
        });
        return () => unsubscribe();
    },[user?.uid]);


    function handleShowMessage(userUid:string){
        // console.log("UserUid",userUid);
        setLoading(true);
        const q = query(collection(db,"messages"),where("roomId","==",(userUid+"_"+user?.uid)),orderBy("timestamp","asc"));
        const unsubscribe = onSnapshot(q,(querySnapshot)=>{
            const messageArray:DocumentData[] = [];
            querySnapshot.forEach((doc)=>{
                // console.log("Message: ",doc.data());
                messageArray.push(doc.data());
            });
            setReceivedMessages(messageArray);
            const observer = new MutationObserver(()=>{
                if(chatContainerRef.current){
                    chatContainerRef.current.scroll({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
                }
            });
            if(chatContainerRef.current){
                observer.observe(chatContainerRef.current,{childList:true})
            }
            setLoading(false);
            // return () => observer.disconnect();
        },(error)=>{
            console.log(error);
            setLoading(false);
        });
        return () => unsubscribe();
    }

    function sendMsgMentee(){
        if(message.trim() === ""){
            return;
        }

        if (user?.uid) {
            const { uid, displayName } = user;
            const roomId = (receivedMessages ?? [])[0]?.uid + "_" + uid;
            const messageObj = {
                mentorId: uid,
                uid:(receivedMessages ?? [])[0]?.uid,
                displayName,
                message,
                timestamp: serverTimestamp(),
                roomId,
            };
            addDoc(collection(db, "messages"), messageObj);
            setMessage("");
        }

    }


  return (
    <>
    <section className='min-h-screen'>
        <div className=' flex'>
        <div className="container mx-6 basis-1/5">
            <h1 className='text-2xl font-bold'>Mentors Panel</h1>
            <p className=''>Here you can manage your students and their progress</p>
            <div className="mt-5">
                <h2 className='text-2xl font-semibold'>Received Messages</h2>
                <div className='overflow-auto'>
                    {loading && <div>Loading...</div>}
                    {userMessaged ? userMessaged.map((MessagedUser:DocumentData,index)=>{
                        return(
                            <div key={index}>
                                {MessagedUser.displayName && <div className='py-5 mt-4 px-2 rounded cursor-pointer bg-slate-800 hover:bg-black' onClick={()=>handleShowMessage(MessagedUser.uid)}>{MessagedUser.displayName}</div>}
                            </div>
                        )
                    })
                    :
                    <div>No Messages</div>
                }
                </div>
            </div>
        </div>
        <div className='chatbox mx-6 basis-4/5 max-h-[80vh] overflow-y-auto' ref={chatContainerRef as React.RefObject<HTMLDivElement> | null}>
            {receivedMessages ? 
            receivedMessages.map((message:DocumentData)=>{

                const currentTime = new Date().getTime();
                const messageTime = message.timestamp?.toMillis();
                const timeElapsed = Math.max(1, currentTime - messageTime);
                
                // Convert milliseconds to seconds, minutes, hours, or days
                let timeAgo;
                if ( timeElapsed < 60000) { // less than 1 minute
                    timeAgo = Math.floor(timeElapsed / 1000) + " seconds ago";
                } else if (timeElapsed < 3600000) { // less than 1 hour
                    timeAgo = Math.floor(timeElapsed / 60000) + " minutes ago";
                } else if (timeElapsed < 86400000) { // less than 1 day
                    timeAgo = Math.floor(timeElapsed / 3600000) + " hours ago";
                } else { // more than 1 day
                    timeAgo = Math.floor(timeElapsed / 86400000) + " days ago";
                }
                
                return(
                    <div key={message.id}>
                        {
                            message.displayName === user?.displayName ?
                            <div className="chat chat-end">
                                <div className="chat-header">
                                {message.displayName}
                                <time className="text-xs opacity-50">{timeAgo}</time>
                                  </div>
                                  <div className="chat-bubble">{message.message}</div>
                            </div>
                            :
                            <div className="chat chat-start">
                                <div className="chat-header">
                                {message.displayName}
                                <time className="text-xs opacity-50">{timeAgo}</time>
                                  </div>
                                  <div className="chat-bubble">{message.message}</div>
                            </div> 
                        }

                    </div>
                )
            })
            
            :
            <h1>There is nothing to show here</h1>
        }
        </div>
    </div>
{ receivedMessages &&
        <div className='mx-[25vw] mt-5 flex'>
            <input type="text" placeholder="Reply Message here...." className="input basis-4/5input-bordered w-full max-w-xl mr-4" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
            <SendIcon sendMsgMentee={sendMsgMentee}/>
        </div>
}
    </section>
    </>
  )
}
