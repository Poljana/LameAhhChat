import { useEffect, useState } from 'react'
import './Profile.css'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import { updateEmail } from 'firebase/auth'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage'

function Profile({ userId }) {
    const [userData, setUserData] = useState('')
    const [editUsername, setEditUsername] = useState(false)
    const [newUsername, setNewUsername] = useState('')
    const [editEmail, setEditEmail] = useState(false)
    const [newEmail, setNewEmail] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)

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

    const handleEmail = () => {
        setEditEmail(!editEmail)
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
            window.location.reload()
        } catch (error) {
            console.error("Error updating document: ", error)
        }
    }

    const handleEmailEdit = async (e) => {
        e.preventDefault()
        
        try {
            const user = auth.currentUser

            if (user) {
                await updateEmail(user, newEmail)
                const docRef = doc(db, "users", userId)
                await updateDoc(docRef, {
                    email: newEmail
                })
                await userId.updateEmail(newEmail)
                setUserData(prevData => ({ ...prevData, email: newEmail }))
                setEditEmail(false)
            } else {
                console.error("No authenticated user found.")
            }
        } catch (error) {
            console.error("Error updating document: ", error)
        }
    }

    const handleImageUpload = async (file) => {
        const storage = getStorage()
        const storageRef = ref(storage, `images/${file.name}`)

        try {
            await uploadBytes(storageRef, file)

            const downloadURL = await getDownloadURL(storageRef)

            const docRef = doc(db, 'users', userId)
            await updateDoc(docRef, {
                profilePicture: downloadURL
            })
            setUserData(prevData => ({ ...prevData, profilePicture: downloadURL}))

            console.log("Image uploaded and URL stored in Firestore: ", downloadURL)
            window.location.reload()
        } catch (error) {
            console.error("Error uploading image:", error)
        }
    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const handleUpload = () => {
        if (selectedFile) {
            handleImageUpload(selectedFile)
        }
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

            <div className='profileImage'>
                <div className='stack'>
                    {
                        userData.profilePicture ?
                        <img src={userData.profilePicture} className='pfp' /> :
                        <img src='src\assets\defaultPFP.jpg' className='pfp' />
                    }
                    <input type='file' onChange={handleFileChange} />
                </div>
                <button 
                    onClick={handleUpload}
                    className='editbtn'
                >
                    Upload Image
                </button>
            </div>
        </div>
    )
}

export default Profile