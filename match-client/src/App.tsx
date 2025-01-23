import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar/NavBar'
import { LandingPage } from './components/LandingPage/LandingPage'
import { Chat } from './components/Chat/Chat'
import { HomePage } from './components/HomePage/HomePage'
import { Project } from './components/Project/Project'

import './App.css'

function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/project" element={<Project />} />
      </Routes>
    </Router>
  )
}

export default App
