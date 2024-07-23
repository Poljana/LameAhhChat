import { signOut } from 'firebase/auth'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { IoIosClose } from "react-icons/io";

function Navbar() {
    const [showAlert, setShowAlert] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Listener for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set user based on sign-in status
        });
        return unsubscribe; // Cleanup subscription on unmount
    }, [])

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
                {user ? (
                        <li className='noPadding'>
                            <button 
                                type='button' 
                                onClick={onClickHandler}
                                className='signoutbtn'
                            >
                                Sign out
                            </button>
                        </li>
                ) : (
                    <li><Link to="signin">Sign In</Link></li>
                )}
            </ul>
            <Alert 
                variant='warning'
                onClose={onClickHandler}
                show={showAlert}
                id='alert'
            >
                <button onClick={onClickHandler} id='closebtn'><IoIosClose /></button>
                Are you sure you want to sign out?
                <button 
                    onClick={() => 
                    {
                        onClickHandler(); 
                        handleSignOut()
                    }}
                    className='signoutbtn'
                >
                    Sign out
                </button>
            </Alert>
        </nav>
    )
}

export default Navbar