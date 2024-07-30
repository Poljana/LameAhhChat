import { Link } from 'react-router-dom'
import './Drawer.css'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'

function Drawer() {
    const [displayFlex, setDisplayFlex] = useState(false)
    const [user, setUser] = useState(false)

    const handleDrawer = () => {
        setDisplayFlex(prevState => !prevState)
    }

    useEffect(() => {
        const toggleButton = document.getElementById("toggleDrawer")
        if (toggleButton) {
            toggleButton.onclick = handleDrawer
        }
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return unsubscribe
    }, [])

    return (
        <aside 
            id='mainDrawer' 
            style={ displayFlex ?
                    { display : "flex" } :
                    { display : "none" }
            }                               
        >
            <Link 
                to={user ? "chats/general" : "signin"} 
                className='drawerLink'
                onClick={ handleDrawer }
            >
                General
            </Link>
        </aside>
    )
}

export default Drawer