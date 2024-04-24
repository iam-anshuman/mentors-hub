'use client'
import Link from 'next/link'
import React,{ useState,useEffect} from 'react';
import { redirect } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {collection, doc,getDoc, getDocs, query, where} from 'firebase/firestore';
import {auth,db} from "@/FirebaseConfig";
import { useAuth } from '@/lib/authContext';

export default function Login() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const {user,setUser} = useAuth();

    useEffect(()=>{{user?.uid && redirect("/")}},[]);

    function handleChange(e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>){
        const {name,value} = e.target;
        switch(name){
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }
    }

    function handleLogin(){
        if(email === "" || password === ""){
            alert("Please fill all the fields");
            return;
        }
        signInWithEmailAndPassword(auth,email,password)
        .then((userCredential) => {
            // Signed in 
            setEmail("");
            setPassword("");
            const user = userCredential.user;         
            return user;
        })
        .then(async(user)=>{
            const q = query(collection(db,"users"),where("uid","==",user.uid));
            const querySnapshot = await getDocs(q);
            const usersData =  querySnapshot.docs.map((doc)=>doc.data());
            setUser({
                displayName: user.displayName || "",
                email: user.email || "",
                uid: user.uid || "",
                role: usersData[0].role || "",
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode,errorMessage);
            setError(errorCode);
            setEmail("");
            setPassword("");
        });
    }

  return (
    <section>
        <div className="hero min-h-screen bg-base-100">
            <div className="text-center hero-content">
            <div className="max-w-2xl">
                <h1 className="mb-5 text-5xl font-bold">Login</h1>
                <div className="card md:w-[33vw] shadow-xl px-16 py-5">
                <div className="form-control">
                    <label className="label">
                    <span className="label-text">Email</span>
                    </label>
                    <input type="email" placeholder="email" name='email' className="input input-bordered" onChange={handleChange}  value={email}/>
                </div>
                <div className="form-control">
                    <label className="label">
                    <span className="label-text">Password</span>
                    </label>
                    <input type="password" placeholder="password" name='password' className="input input-bordered" onChange={handleChange}  value={password}/>
                </div>
                <button className="btn btn-primary my-4" onClick={handleLogin}>Login</button>
                <Link href={"/signup"}><p className='cursor-pointer hover:text-gray-500'>Don't have an account?</p></Link>
                {error && <div role="alert" className="alert alert-error" onClick={()=>{setError("")}}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span>{error}</span>
                            </div>
                }
                </div>
            </div>
            </div>
        </div>
    </section>
  )
}
