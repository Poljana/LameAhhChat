import './Register.css'
import { createUserWithEmailAndPassword, 
        signOut, 
        sendEmailVerification 
        } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { useState } from 'react'
import { setDoc, doc } from 'firebase/firestore'

function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const defaultPFP = "C:\Users\Pavin\OneDrive\Radna površina\I\LACH\src\assets\defaultPFP.jpg"

    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await sendEmailVerification(user).then(() => {
                console.log('Verification email sent.');
            }).catch((error) => {
                console.error('Error sending verification email:', error);
            });
            

            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email,
                uid: user.uid,
                profilePicture: defaultPFP
            })

            await signOut(auth)
            navigate('/verification-mail')
        } catch (error) {
            const errorCode = error.code
            const errorMessage = error.message
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