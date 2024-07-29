import { Link } from 'react-router-dom'
import './Drawer.css'
import { useEffect, useState } from 'react'

function Drawer() {
    const [displayFlex, setDisplayFlex] = useState(false)

    const handleDrawer = () => {
        setDisplayFlex(prevState => !prevState)
    }

    useEffect(() => {
        const toggleButton = document.getElementById("toggleDrawer")
        if (toggleButton) {
            toggleButton.onclick = handleDrawer
        }
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
                to="chats/general" 
                className='drawerLink'
                onClick={ handleDrawer }
            >
                General
            </Link>
        </aside>
    )
}

export default Drawer