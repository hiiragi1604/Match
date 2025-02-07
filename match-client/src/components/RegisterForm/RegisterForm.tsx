import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import RegisterFormStyle from "./RegisterForm.module.css";
import { AuthError } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import axios from "axios";

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        skills: [],
        languages: [],
    });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        
        const userData = {
            personalInfo: {
                name: formData.name,
                username: formData.username,
            },
            technicalInfo: {
                skills: formData.skills,
                languages: formData.languages
            }
        }
        
        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            const fetchUserName = await axios.get("http://localhost:6969/users/all")
            const userNames = fetchUserName.data?.map((user: any) => user.personalInfo.username) || []
            if (userNames.includes(formData.username)) {
                setError("Username already in use");
                return;
            }
            const response = await axios.post("http://localhost:6969/users/create", { ...userData, email });
            console.log("User registered:", response);
            console.log("User data:", userData);
            
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
                <input 
                    className={RegisterFormStyle.loginInput}
                    type="text" 
                    placeholder="Name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                />
                <input 
                    className={RegisterFormStyle.loginInput}
                    type="text" 
                    placeholder="Username" 
                    name="username"
                    value={formData.username} 
                    onChange={handleChange}
                />
                <input 
                    className={RegisterFormStyle.loginInput}
                    type="text" 
                    placeholder="Skills" 
                    name="skills"
                    value={formData.skills} 
                    onChange={handleChange}
                />
                <input 
                    className={RegisterFormStyle.loginInput}
                    type="text" 
                    placeholder="Languages" 
                    name="languages"
                    value={formData.languages} 
                    onChange={handleChange}
                />
                {error && <div className={RegisterFormStyle.errorMessage}>{error}</div>}
                <button className={RegisterFormStyle.loginButton} type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
