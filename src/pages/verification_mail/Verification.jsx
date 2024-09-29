import { Link } from 'react-router-dom'
import './Verification.css'
import { IoIosDoneAll } from "react-icons/io";

function VerificationMail () {

    return (
        <div className='verification-mail'>
            <p>Verification mail sent!<br />
            Once verified, click on the button below to sign in.</p>
            <Link to={'/signin'} className='to-signin'>Sign in</Link>
            <IoIosDoneAll className='all-done' />
        </div>
    )
}

export default VerificationMail
