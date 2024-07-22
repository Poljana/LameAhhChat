import { signOut } from 'firebase/auth'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Alert } from 'react-bootstrap'
import { auth } from '../../firebase'

function Navbar() {
    const [showAlert, setShowAlert] = useState(false)
    const onClickHandler = () => {
        setShowAlert(!showAlert)
    }

    const handleSignOut = (e) => {
        signOut(auth)
        .then(() => {
            console.log("User signed out successfully.")
            
        })
        .catch((error) => {
            const errorCode = error.code 
            const errorMessage = error.message 
            console.error("Error code: ", errorCode, "Error message: ", errorMessage)
        })
    }

    return (
        <nav>
            <ul>
                <li><Link to="home">Lame A$$ Chat</Link></li>
                <li><Link to="signin">Sign In</Link></li>
                <li><button type='button' onClick={onClickHandler}>Sign out</button></li>
            </ul>
            <Alert 
                variant='warning'
                dismissible
                onClose={onClickHandler}
                show={showAlert}
            >
                Are you sure you want to sign out?
                <button onClick={() => {onClickHandler(); handleSignOut()}}>Sign out</button>
            </Alert>
        </nav>
    )
}

export default Navbar