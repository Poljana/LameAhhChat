import { signOut } from 'firebase/auth'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'
import { auth, db } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { IoIosClose, IoIosMenu } from "react-icons/io";
import { doc, getDoc } from 'firebase/firestore'

function Navbar({ userId }) {
    const [showAlert, setShowAlert] = useState(false)
    const [user, setUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return unsubscribe
    }, [])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', userId)
                const docSnap = await getDoc(docRef)

                if(docSnap.exists()) {
                    setUserData(docSnap.data())
                } else {
                    console.log("No such document exists")
                }
            } catch (error) {
                const errorCode = error.code
                const errorMessage = error.message
                console.error("Error code: ", errorCode, "Error message: ", errorMessage)
            }
        }

        if(userId) {
            fetchUserData()
        }
    }, [userId])

    const onClickHandler = () => {
        setShowAlert(!showAlert)
    }

    const handleSignOut = (e) => {
        signOut(auth)
        .then(() => {
            console.log("User signed out successfully.")
            navigate('/home')
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
                <li>
                    <button id='toggleDrawer'>
                        <IoIosMenu />
                    </button>
                    <Link to="home">
                        Lame A$$ Chat
                    </Link>                    
                </li>
                {user ? (
                        <li className='noPadding'>
                            <Link to="profile">
                                <button
                                    type='button'
                                    id='profilebtn'
                                >
                                    { userData ? userData.username : "No profile" }
                                </button>
                            </Link>                            
                            <button 
                                type='button' 
                                onClick={onClickHandler}
                                className='signoutbtn'
                            >
                                Sign out
                            </button>
                        </li>
                ) : (
                    <li><Link to="signin" id='signinbtn'>Sign In</Link></li>
                )}
            </ul>
            <Alert 
                variant='warning'
                onClose={onClickHandler}
                show={showAlert}
                id='alert'
            >
                <button 
                    onClick={onClickHandler} 
                    id='closebtn'
                >
                    <IoIosClose />
                </button>
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