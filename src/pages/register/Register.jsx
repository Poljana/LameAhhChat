import { createUserWithEmailAndPassword } from 'firebase/auth'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { useState } from 'react'
import { setDoc, doc } from 'firebase/firestore'

function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email,
                uid: user.uid
            })

            navigate('/home')
        } catch (error) {
            const errorCode = error.code
            const errorMessage = error.errorMessage
            console.error("Error code:", errorCode, "Error message:", errorMessage)
        }}  
        
        return (
        <form className='registerform' onSubmit={handleRegister}>
            <input
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => {setUsername(e.target.value)}}
                required
            />
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
                required
            />
            <button type='submit'>Register</button>
            <div className='hasAccount'>
                <span>Already have an account?</span>
                <span><Link to="/signin" className='tologinpage'>Sign in</Link></span>
            </div>
        </form>
    )
    }

export default Register