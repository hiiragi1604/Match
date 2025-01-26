import React from "react";
import welcomeStyle from "./Welcome.module.css";
import { useAuth } from "../../context/AuthContext";

export default function Welcome() {
  const { user } = useAuth();
  if (user) {
    return <div className={welcomeStyle.welcomeContainer}>Welcome {user.email}</div>;
  }
  return <div className={welcomeStyle.welcomeContainer}>Please sign in</div>;
}
