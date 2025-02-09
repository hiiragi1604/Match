import React from 'react'
import { Link } from 'react-router-dom'
import navBarStyle from "./NavBar.module.scss"
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../utils/signOut';

export const NavBar = () => {
  const { user, loading } = useAuth();
  const [isOwnerMode, setIsOwnerMode] = React.useState(true);
  const setOwnerMode = () => {
    setIsOwnerMode(!isOwnerMode);
  }
  if (loading) return <div>Loading...</div>;
  return (
    <div className={navBarStyle.container}>
        <ul className={navBarStyle.navlist}>
            <div className={navBarStyle.logo}>Logo </div>
            <li className={navBarStyle.navitem}><Link to="/match">Match</Link></li>
            <li className={navBarStyle.navitem}><Link to="/search">Search</Link></li>
            <li className={navBarStyle.navitem}><Link to="/chat">Chat</Link></li>
            {isOwnerMode ? <li className={navBarStyle.navitem} onClick={setOwnerMode}>Owner</li> : <li className={navBarStyle.navitem} onClick={setOwnerMode}>User</li>}
            {user ? <button className={navBarStyle.navitem} onClick={signOutUser}>Sign out</button> : <li className={navBarStyle.navitem}><Link to="/signin">Sign in</Link></li>}
            {!user ? <li className={navBarStyle.navitem}><Link to="/register">Register</Link></li> : null}
        </ul>
    </div>
  )
}
