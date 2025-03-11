import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { verifyUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import SignInFormStyle from "./SigninForm.module.css";
import { FirebaseError } from "firebase/app";
import axios from "axios";

const SigninForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        const baseUri = import.meta.env.VITE_MATCH_API_URI;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            const token = await userCredential.user.getIdToken();
            console.log(token);
            const response = await verifyUser(token);
            console.log(response);
            if (response.status === 200) {
                const uid = await axios.get(`${baseUri}/users/firebase/${userCredential.user?.uid}`);
                console.log(`User ID: ${uid.data.id}`);
                localStorage.setItem("uid", uid.data._id);// store in cookie later on
                console.log("Signed in successfully");
                navigate("/");
            }
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/invalid-credential") {
                    setError("Invalid email or password");
                } else {
                    setError("Login failed");
                }
            }
        }
    }

    return (
        <div className={SignInFormStyle.loginContainer}>
            <h1 className={SignInFormStyle.loginTitle}>Login</h1>
            <form className={SignInFormStyle.loginForm} onSubmit={handleLogin}>
                <input 
                    className={SignInFormStyle.loginInput}
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    className={SignInFormStyle.loginInput}
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                {error && <div className={SignInFormStyle.errorMessage}>{error}</div>}
                <button className={SignInFormStyle.loginButton} type="submit">Login</button>
            </form>
        </div>
    );
};

export default SigninForm;
