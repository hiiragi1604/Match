import React from 'react'
import { Link } from 'react-router-dom'
import navBarStyle from "./NavBar.module.css"
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../utils/signOut';

export const NavBar = () => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div className={navBarStyle.container}>
        <ul className={navBarStyle.navlist}>
            <li className={navBarStyle.navitem}><Link to="/logo">Logo</Link></li>
            <li className={navBarStyle.navitem}><Link to="/match">Match</Link></li>
            <li className={navBarStyle.navitem}><Link to="/community">Community</Link></li>
            <li className={navBarStyle.navitem}><Link to="/project">Project</Link></li>
            <li className={navBarStyle.navitem}><Link to="/chat">Chat</Link></li>
            {user ? <button className={navBarStyle.navitem} onClick={signOutUser}>Sign out</button> : <li className={navBarStyle.navitem}><Link to="/signin">Sign in</Link></li>}
            {!user ? <li className={navBarStyle.navitem}><Link to="/register">Register</Link></li> : null}
        </ul>
    </div>
  )
}
