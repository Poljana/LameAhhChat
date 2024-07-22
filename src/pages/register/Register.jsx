import { createUserWithEmailAndPassword } from 'firebase/auth'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'

function Register() {
    const navigate = useNavigate()

    const register = (e) => {
        e.preventDefault()

        const username = document.getElementById("username").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            navigate("/signin")
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.errorMessage
            console.error("Error code:", errorCode, "Error message:", errorMessage)
        })         
    }

    return (
        <form className='registerform' onSubmit={register}>
            <input type="text" placeholder='Username' id='username' />
            <input type="text" placeholder='Email' id='email' />
            <input type="password" placeholder='Password' id='password' />
            <button type='submit'>Register</button>
            <div className='hasAccount'>
                <span>Already have an account?</span>
                <span><Link to="/signin" className='tologinpage'>Sign in</Link></span>
            </div>
        </form>
    )
}

export default Register