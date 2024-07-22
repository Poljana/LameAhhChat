import './Navbar.css'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav>
            <ul>
                <li><Link to="home">Lame A$$ Chat</Link></li>
                <li><Link to="signin">Sign In</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar