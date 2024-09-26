import './App.css'
import Home from '../pages/home/Home.jsx'
import SignIn from '../pages/signin/Signin.jsx'
import Navbar from '../components/navbar/Navbar.jsx'
import Register from '../pages/register/Register.jsx'
import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import Drawer from '../components/drawer/Drawer.jsx'
import General from '../pages/chats/general/General.jsx'
import Profile from '../pages/profile/Profile.jsx'
import VerificationMail from '../pages/verification_mail/Verification.jsx'

function App() {
  const [currentUserId, setCurrentUserId] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid)
      } else {
        setCurrentUserId('')
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className='wrapper'>
      <Navbar userId={currentUserId}/>
      <Drawer />
        <Routes>
          <Route index path='home' element={<Home />} />
          <Route path='signin' element={<SignIn />} />
          <Route path='register' element={<Register />} />
          <Route path='profile' element={<Profile userId={currentUserId} />} />
          <Route 
                path='chats/general' 
                element={<General 
                            outerCollectionName='chats'
                            outerDocId='general' 
                            nestedCollectionName='messages' 
                            userId={currentUserId}
                          />} 
          />
          <Route path='verification-mail' element={<VerificationMail />} />
        </Routes>
    </div>
  )
}

export default App
