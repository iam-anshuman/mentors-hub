'use client'
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ButtonHTMLAttributes, useEffect, useState } from "react";
import {auth,db} from "@/FirebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/lib/authContext";


export default function SignUp() {

    const [fullName,setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [domain, setDomain] = useState("");
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [bio, setBio] = useState("");
    const [error, setError] = useState("");
    const {user,setUser} = useAuth();

    useEffect(()=>{{user?.uid && redirect("/")}},[user?.uid]);

    function handleChange(e:React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>){
        const {name,value} =  e.target;
        switch(name){
            case "fullName":
                setFullName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "domain":
                setDomain(value);
                break;
            case "role":
                setRole(value);
                break;
            case "experience":
                setExperience(value);
                break;
            case "specialization":
                setSpecialization(value);
                break;
            case "bio":
                setBio(value);
                break;
            default:
                break;
        }        
    }
    
    function handleSignUp (){
        if(fullName === "" || email === "" || password === "" || domain === "" || role === "" || (role === "mentor" && (experience === "" || specialization === "" || bio === ""))){
            alert("Please fill all the fields");
            return;
        }
        createUserWithEmailAndPassword(auth,email,password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            updateProfile(user,{displayName:fullName})
            addDoc(collection(db,"users"),{
                uid:user.uid,
                fullName:fullName,
                email:email,
                domain:domain,
                role:role,
                mentorDetails:{
                    ...(role === "mentor" ? {
                        experience: experience,
                        specialization: specialization,
                        bio: bio
                    } : {}),
                } 
            });
            setUser({
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
                role: role
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage);
            setError(errorCode);
        });

    }


  return (
    <section>
            <div className="hero min-h-screen bg-base-200">
            <div className="text-center hero-content">
            <div className="">
                <h1 className="mb-5 text-5xl font-bold">Sign Up</h1>
                <p>Sign Up for free to get start your journey</p>
                <div className="card md:w-[33vw] shadow-xl px-4 py-5">
                <div className="form-control">
                    <label className="label" htmlFor="fullName">
                    <span className="label-text">Full Name</span>
                    </label>
                    <input type="text" placeholder="Full Name" id="fullName" name="fullName" className="input input-bordered"  onChange={handleChange}  value={fullName}/>
                </div>
                <div className="form-control">
                    <label className="label" id="email">
                    <span className="label-text">Email</span>
                    </label>
                    <input type="email" placeholder="email" id="email" name="email" className="input input-bordered"  onChange={handleChange}  value={email}/>
                </div>
                <div className="form-control">
                    <label className="label" id="password">
                    <span className="label-text">Password</span>
                    </label>
                    <input type="password" placeholder="password" id="password" name="password" className="input input-bordered"  onChange={handleChange} value={password}/>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="domain">
                    <span className="label-text">Domain</span>
                    </label>
                    <select name="domain" id="domain" className="select select-bordered" onChange={handleChange}>
                        <option value="art">Art</option>
                        <option value="dance">Dance</option>
                        <option value="finance">Finance</option>
                        <option value="public speaking">Public Speaking</option>
                        <option value="software engineering">Software Engineering</option>
                        <option value="leadership">Leadership</option>
                    </select>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="role">
                    <span className="label-text">Sign Up As</span>
                    </label>
                    <select name="role" id="role" className="select select-bordered" onChange={handleChange}>
                        <option value="">select</option>
                        <option value="mentor">Mentor</option>
                        <option value="mentee">Mentee</option>
                    </select>
                </div>
                {role === "mentor" &&
                <>
                <div className="form-control">
                    <label className="label" htmlFor="experience">
                    <span className="label-text">Experience</span>
                    </label>
                    <input type="text" placeholder="Experience" id="experience" name="experience" className="input input-bordered" value={experience} onChange={handleChange}/>
                </div>
                <div className="form-control">
                    <label className="label" htmlFor="specialization">
                    <span className="label-text">Specialization</span>
                    </label>
                    <input type="text" placeholder="Specialization" id="specialization" name="specialization" className="input input-bordered" value={specialization} onChange={handleChange}/>
                </div>
                    <label className="form-control">
                      <div className="label">
                        <span className="label-text">Your bio</span>
                        <span className="label-text-alt">Describe yourself</span>
                      </div>
                      <textarea className="textarea textarea-bordered h-24" name="bio" id="bio" placeholder="Bio.." value={bio}  onChange={handleChange}></textarea>
                    </label>
                </>
                }

                <button type="submit" className="btn btn-primary my-4" onClick={handleSignUp}>Signup</button>
                <Link href={"/login"}><p className='cursor-pointer hover:text-gray-500'>Already have an account?</p></Link>
                </div>
                {error && <div role="alert" className="alert alert-error" onClick={()=>{setError("")}}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span>{error}</span>
                 </div>
                }
            </div>
            </div>
        </div>
    </section>
  )
}
