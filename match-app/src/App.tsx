import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainFeature } from './components/MainFeature/MainFeature'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeature />} />
      </Routes>
    </Router>
  )
}

export default App
