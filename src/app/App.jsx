import './App.css'
import Home from '../pages/home/Home.jsx'
import SignIn from '../pages/signin/Signin.jsx'
import Navbar from '../components/navbar/Navbar.jsx'
import Register from '../pages/register/Register.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

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
      <BrowserRouter>
      <Navbar userId={currentUserId}/>
        <Routes>
          <Route index path='home' element={<Home />} />
          <Route path='signin' element={<SignIn />} />
          <Route path='register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
