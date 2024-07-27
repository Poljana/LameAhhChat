import { signInWithEmailAndPassword } from 'firebase/auth'
import './Signin.css' 
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'

function SignIn() {
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value 
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user
            console.log(user)
            navigate('/home')
        })
        .catch((error) => {
            const errorCode = error.code 
            const errorMessage = error.message 
            console.error("Error code: ", errorCode, "Error message: ", errorMessage)
        })
    }

    return (
        <form className='signinform' method='get' onSubmit={handleLogin}>
            <input type="text" placeholder='Email' id='email' />
            <input type="password" placeholder='Password' id='password' />
            <button type='submit'>Sign In</button>
            <div className='noAccount'>
                <span>Don't have an account?</span>
                <span><Link to="/register" className='toregisterpage'>Register</Link></span>
            </div>
        </form>
    )
}

export default SignIn