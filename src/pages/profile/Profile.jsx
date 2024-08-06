import { useEffect, useState } from 'react'
import './Profile.css'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

function Profile({ userId }) {
    const [userData, setUserData] = useState('')
    const [editUsername, setEditUsername] = useState(false)
    const [newUsername, setNewUsername] = useState('')
    const [editEmail, setEditEmail] = useState(false)
    const [newEmail, setNewEmail] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", userId)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setUserData(docSnap.data())
                } else {
                    console.log("No such document exists.")
                }
            } catch (error) {
                console.error("Error finding document: ", error)
            }
        }

        if (userId) {
            fetchUserData()
        }
    }, [userId])

    const handleUsername = () => {
        setEditUsername(!editUsername)
    }

    const handleUsernameEdit = async (e) => {
        e.preventDefault()
        
        try {
            const docRef = doc(db, "users", userId)
            await updateDoc(docRef, {
                username: newUsername
            })
            setUserData(prevData => ({ ...prevData, username: newUsername }))
            setEditUsername(false)
        } catch (error) {
            console.error("Error updating document: ", error)
        }
    }

    const handleEmailEdit = async (e) => {
        
    }

    return (
        <div id='userProfile'>
            <h3>Personal info</h3>
            <div className='username'>
                {
                    editUsername ?
                    <form className='editForm' onSubmit={handleUsernameEdit}>
                        <input 
                            type='text' 
                            placeholder='New username...'
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}    
                        />
                        <button type='submit' className='editbtn'>Confirm username</button>
                    </form> :
                    <p>Username: {userData.username}</p>
                }
                    <button 
                        className='editbtn' 
                        onClick={handleUsername}
                    >
                        {editUsername ? "Cancel" : "Edit"}
                    </button>                
            </div>
            <div className='email'>
                {
                    editEmail ?
                    <form className='editForm' onSubmit={handleEmailEdit}>
                        <input 
                            type='text' 
                            placeholder='New email...'
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}    
                        />
                        <button type='submit' className='editbtn'>Confirm email</button>
                    </form> :
                    <p>Email: {userData.email}</p>
                }
                    <button 
                        className='editbtn' 
                        onClick={handleEmail}
                    >
                        {editEmail ? "Cancel" : "Edit"}
                    </button>                
            </div>
        </div>
    )
}

export default Profile