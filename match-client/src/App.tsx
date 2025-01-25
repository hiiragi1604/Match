import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { Chat } from "./components/Chat/Chat";
import { HomePage } from "./components/HomePage/HomePage";
import { Project } from "./components/Project/Project";
import SigninForm from "./components/SigninForm/SigninForm";
import { AuthProvider } from "./context/AuthContext";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import Welcome from "./components/Welcome/Welcome";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Welcome />
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/project" element={<Project />} />
          <Route path="/signin" element={<SigninForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
