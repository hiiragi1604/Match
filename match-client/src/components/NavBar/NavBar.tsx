import React from 'react'
import { Link } from 'react-router-dom'
import navBarStyle from "./NavBar.module.css"

export const NavBar = () => {
  return (
    <div className={navBarStyle.container}>
        <ul className={navBarStyle.navlist}>
            <li className={navBarStyle.navitem}><Link to="/logo">Logo</Link></li>
            <li className={navBarStyle.navitem}><Link to="/match">Match</Link></li>
            <li className={navBarStyle.navitem}><Link to="/community">Community</Link></li>
            <li className={navBarStyle.navitem}><Link to="/project">Project</Link></li>
            <li className={navBarStyle.navitem}><Link to="/chat">Chat</Link></li>
            <li className={navBarStyle.navitem}><Link to="/signin">Sign in</Link></li>
            <li className={navBarStyle.navitem}><Link to="/register">Register</Link></li>
        </ul>
    </div>
  )
}
