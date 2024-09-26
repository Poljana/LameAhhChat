import { Link } from 'react-router-dom'
import './Verification.css'

function VerificationMail () {

    return (
        <div className='verification-mail'>
            <p>Verification mail sent!<br />
            Once verified, click on the button below to sign in.</p>
            <Link to={'/signin'}>Sign in</Link>
        </div>
    )
}

export default VerificationMail
