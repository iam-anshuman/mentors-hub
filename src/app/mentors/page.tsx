'use client'
import React,{ use, useEffect, useState } from "react";
import { getDocs,collection, DocumentData,query,where,addDoc,serverTimestamp,onSnapshot,limit,orderBy } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useAuth } from "@/lib/authContext";
import { SendIcon } from "../Components/Icons";
import { time } from "console";

export default function Mentors() {

  const [mentors,setMentors] = useState<DocumentData[]>();
  const [loading,setLoading] = useState<boolean>(true);
  const [message,setMessage] = useState("");
  const [receivedMessages,setReceivedMessages] = useState<DocumentData[]>();
  const [mentorDetails,setMentorDetails] = useState({
    mentorName:"",
    mentorId:""
  });
  const {user} = useAuth();

  // Fetching the mentors from the database
  useEffect(()=>{
    async function fetchMentors(){
      setLoading(true);
      const q = query(collection(db,"users"),where("role","==","mentor"));
      const querySnapshot = await getDocs(q);
      const mentorArray = querySnapshot.docs.map((doc)=>doc.data());
      setMentors(mentorArray);
      setLoading(false);
    }
    fetchMentors();
  },[]);



// FUnction to note the change and accoringly fetch the mentors
  async function handleChange(e:React.ChangeEvent<HTMLSelectElement>){
    const {value} = e.target;
    if(value != "All"){
      setLoading(true);
      const q = query(collection(db,"users"),where("domain","==",value));
      const querySnapshot = await getDocs(q);
      const mentorArray = querySnapshot.docs.map((doc)=>doc.data());
      setMentors(mentorArray);
      setLoading(false);  
    }else{
      setLoading(true);
      const querySnapshot = await getDocs(query(collection(db,"users"),where("role","==","mentor")));
      const mentorArray = querySnapshot.docs.map((doc)=>doc.data());
      setMentors(mentorArray);
      setLoading(false);
    }
  }


  // Handling Chat in the mentors section
  async function handleChat(uid: string) {
    if(!user?.uid){
      alert("Please Login to chat with the mentor");
      return;
    }
    const mentor = mentors?.find((mentor)=>mentor.uid === uid);
    setMentorDetails({
      mentorName:mentor?.fullName,
      mentorId:uid
    });
  }

  useEffect(()=>{
    if(mentorDetails.mentorId){
      fetchMessages(mentorDetails.mentorId);
    }

  },[mentorDetails.mentorId]);

  // Function to send message to mentors
  function fetchMessages(uid: string){

    if (!mentorDetails.mentorId || !user?.uid) {
      console.log("Mentor ID or UID is missing.");
      return;
    }      
      const q = query(
      collection(db,"messages"),
      where("mentorId","==",uid),
      where("uid","==",user.uid),
      orderBy("timestamp","asc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q
      ,(querySnapshot)=>{
        console.log("Inside Snapshot")
        const fetchMessages:DocumentData[] = [];
        querySnapshot.forEach((doc)=>{
          fetchMessages.push({...doc.data(),id:doc.id});;
        });
          setReceivedMessages(fetchMessages);
        },(error)=>{
            console.log("Error",error);
          }
        );
        
    return () => unsubscribe;
        
  };


  // Function to send message to mentors
  async function sendMsg(){
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    if(user?.uid){
      const {uid,displayName} = user;
      const messageObj = {
        mentorId : mentorDetails.mentorId,
        uid,
        displayName,
        message,
        timestamp: serverTimestamp()
      }
      await addDoc(collection(db,"messages"),messageObj);
      setMessage("");
    }
    else{
      alert("Please Login to chat with the mentor");
    }
  }

  return (
    <section className="min-h-screen">
        <div className="text-5xl font-bold text-center my-4">Our Expert Mentors</div>
        <p className="text-center m-2">Our Mentors are here to guide you to grow in your career</p>
        <div className="form-control mx-4 md:w-1/6">
        <select name="domain" id="domain" className="select select-bordered" onChange={handleChange}>
                        <option value="All">All</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Human Resources">Human Resource"</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="UX/UI Design">UX/UI Design</option>
                        <option value="Content Writing">Content Writing</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="Architecture">Architecture</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Graphic Design">Graphic Design</option>
                    </select>
          </div> 
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h3 className="font-bold text-lg">Lets Talk with Mentor</h3>
                {receivedMessages && receivedMessages.map((msg)=>{

                  const currentTime = new Date().getTime();
                  const messageTime = msg.timestamp?.toMillis();
                  const timeElapsed = Math.max(0, currentTime - messageTime);
                                  
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



                return (  <div key={msg.id} className="chat chat-start">
                    <div className="chat-header">
                      {msg.displayName}
                      <time className="text-xs opacity-50">{timeAgo}</time>
                    </div>
                    <div className="chat-bubble">{msg.message}</div>
                    <div className="chat-footer opacity-50">
                      Seen
                    </div>
                  </div>
                
                )})}
                <div className="flex">
                  <input type="text" id="message" name="message" placeholder="Enter Message...." className="input input-bordered w-full max-w-xs" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
                  <SendIcon sendMsg={sendMsg}/>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        <div className="m-5 grid md:grid-cols-4 gap-5">
          {mentors ? mentors.map((mentor)=>(
            <div key={mentor.uid} className="card bg-base-300 shadow-xl">
              <div className="card-body">
                <h2 className="card-title font-bold">{mentor.fullName}</h2>
                <p className="text-lg font-bold">{mentor.domain}</p>
                <p className="text-lg font-bold">{mentor.mentorDetails.specialization}</p>
                <p className="text-lg font-bold">{mentor.mentorDetails.experience}</p>
                <p className="">{mentor.mentorDetails.bio}</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary" onClick={()=>{handleChat(mentor.uid); (document.getElementById('my_modal_3') as HTMLDialogElement)?.showModal()}}>Chat Now</button>
                </div>
              </div>
            </div>
          ))
          :
            <div className="loading loading-dots loading-lg "></div>
        }
        </div>
    </section>
  )
}

