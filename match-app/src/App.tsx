import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainFeature } from "./components/MainFeature/MainFeature";
import "./App.css";
import SigninForm from "./components/SigninForm/SigninForm";
import { AuthProvider } from "./context/AuthContext";
import { IsOwnerProvider } from "./context/IsOwnerContext";
import { NavBar } from "./components/NavBar/NavBar";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import { ChatList } from "./components/ChatList/ChatList";
import { ChatRoom } from "./components/ChatRoom/ChatRoom";
import { Match } from "./components/Match/Match";

function App() {
  return (
    <AuthProvider>
      <IsOwnerProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<MainFeature />} />
            <Route path="/signin" element={<SigninForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:chatRoomId" element={<ChatRoom />} />
            <Route path="/match" element={<Match />} />
          </Routes>
        </Router>
      </IsOwnerProvider>
    </AuthProvider>
  );
}

export default App;
