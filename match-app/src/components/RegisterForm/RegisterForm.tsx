import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import RegisterFormStyle from "./RegisterForm.module.css";
import { AuthError } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        
        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log(userCredential);
            navigate("/");

        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/email-already-in-use") {
                    setError("Email already in use");
                } else {
                    setError("Account creation failed");
                }
            }
        }
    }

    return (
        <div className={RegisterFormStyle.loginContainer}>
            <h1 className={RegisterFormStyle.loginTitle}>Register</h1>
            <form className={RegisterFormStyle.loginForm} onSubmit={handleLogin}>
                <input 
                    className={RegisterFormStyle.loginInput}
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    className={RegisterFormStyle.loginInput}
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <input 
                    className={RegisterFormStyle.loginInput}
                    type="password" 
                    placeholder="Re-enter Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                {error && <div className={RegisterFormStyle.errorMessage}>{error}</div>}
                <button className={RegisterFormStyle.loginButton} type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
