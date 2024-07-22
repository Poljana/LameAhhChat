import './App.css'
import Home from '../pages/home/Home.jsx'
import SignIn from '../pages/signin/Signin.jsx'
import Navbar from '../components/navbar/Navbar.jsx'
import Register from '../pages/register/Register.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div className='wrapper'>
      <BrowserRouter>
      <Navbar />
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
