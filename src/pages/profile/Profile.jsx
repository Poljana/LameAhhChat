import { useEffect, useState } from 'react'
import './Profile.css'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'

function Profile({ userId }) {
    const [userData, setUserData] = useState('')

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

    return (
        <div id='userProfile'>
            <p>Personal info</p>

        </div>
    )
}

export default Profile