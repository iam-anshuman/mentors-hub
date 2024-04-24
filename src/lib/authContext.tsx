"use client"
import {useState, useEffect , createContext , useContext} from "react";
import {auth,db} from "@/FirebaseConfig";
import { onAuthStateChanged, } from "firebase/auth";
import { query,getDocs,collection,where } from "firebase/firestore";

interface user {
    displayName: string;
    email: string;
    uid: string;
    role: string;
}

type AuthContextType = {
    user: {
        displayName: string;
        email: string;
        uid: string;
        role: string;
    } | null,
    setUser: (user: any) => void;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
});


export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    
    const [user, setUser] = useState<user>({
        displayName: "",
        email: "",
        uid: "",
        role: "",
    } as user);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user?.uid) {
                const q = query(collection(db, "users"), where("uid", "==", user.uid));
                getDocs(q).then((querySnapshot) => {
                    const usersData = querySnapshot.docs.map((doc) => doc.data());
                    if(usersData[0]?.uid){                    
                        setUser({
                            displayName: user.displayName || "",
                            email: user.email || "",
                            uid: user.uid || "",
                            role: usersData[0].role || "",
                        });
                    }
                });
            } else {
                console.log("No user found");
            }
        });
        return () => unsubscribe();
    }, []);
    
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};