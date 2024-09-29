import './General.css'
import { useEffect, useRef, useState } from 'react';
import { doc, addDoc, collection,
         deleteDoc, getDocs, Timestamp,
          query, orderBy, 
          getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { IoMdSend, IoIosTrash, IoMdMore } from "react-icons/io";
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';


const General = ({ outerCollectionName, outerDocId, nestedCollectionName, userId }) => {
    const [userData, setUserData] = useState('')
    const [nestedDocuments, setNestedDocuments] = useState([])
    const [message, setMessage] = useState('')
    const [currentUserId, setCurrentUserId] = useState('')
    const [profilePictures, setProfilePictures] = useState({})
    const [popupVisible, setPopupVisible] = useState(false)
    const [activeMessageId, setActiveMessageId] = useState(null)
    const chatFieldRef = useRef(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, "users", userId)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setUserData(docSnap.data())
                } else {
                    console.error("No such document exists.")
                }
            } catch (error) {
                console.error("Error finding document: ", error)
            }    
        }

        if (userId) {
            fetchUserData()
        }
    }, [userId])

    const fetchNestedCollection = async () => {
        try {
            const nestedCollectionRef = collection(db, `${outerCollectionName}/${outerDocId}/${nestedCollectionName}`);
            const q = query(nestedCollectionRef, orderBy('time', 'asc'))
            const querySnapshot = await getDocs(q);
            const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNestedDocuments(docsData);

            const userIds = [...new Set(docsData.map(doc => doc.sentBy))];
            const profilePictures = {};
            for (const id of userIds) {
                const userDocRef = doc(db, "users", id);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    profilePictures[id] = userDocSnap.data().profilePicture;
                }
            }
            setProfilePictures(profilePictures);
        } catch (error) {
            console.error("Error fetching nested collection: ", error);
        }
    };

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

    useEffect(() => {
        if (chatFieldRef.current) {
            chatFieldRef.current.scrollTop = chatFieldRef.current.scrollHeight
        }
    }, [nestedDocuments])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (message.trim() === '') return

        try {
            const nestedCollectionRef = collection(db, `${outerCollectionName}/${outerDocId}/${nestedCollectionName}`)
            await addDoc(nestedCollectionRef, {
                content : message,
                time : Timestamp.now(),
                sentBy : currentUserId
            })
            setMessage('')
            fetchNestedCollection()
        } catch (error) {
            console.error("Error adding document: ", error)
        }
    }

    const handlePopup = async (id) => {
        try {
            if (activeMessageId === id) {
                setPopupVisible(!popupVisible)
            } else {
                setActiveMessageId(id)
                setPopupVisible(true)
            }
        } catch (error) {
            console.error("Error handling popup message.", error)
        }
    }

    const handleDelete = async (id) => {
        try {
            const docRef = doc(db, `${outerCollectionName}/${outerDocId}/${nestedCollectionName}`, id)
            await deleteDoc(docRef)
            fetchNestedCollection()
        } catch (error) {
            console.error("Error deleting document: ", error)
        }
    }
    
    useEffect(() => {
        fetchNestedCollection();
    }, []);

    const groupMessages = (messages) => {
        const groupedMessages = [];
        let currentGroup = [];

        messages.forEach((message, index) => {
            if (index === 0 || message.sentBy === messages[index - 1].sentBy) {
                currentGroup.push(message);
            } else {
                groupedMessages.push(currentGroup);
                currentGroup = [message];
            }
        });

        if (currentGroup.length > 0) {
            groupedMessages.push(currentGroup);
        }

        return groupedMessages;
    };

    const groupedMessages = groupMessages(nestedDocuments);

    const MessageGroup = ({ messages, currentUserId }) => {
        return (
            <div className={`messages ${messages[0].sentBy === currentUserId ? 'message-right' : 'message-left'}`}>
                {messages.map(doc => (
                    <div key={doc.id} className="message">
                        <div className="message-content">
                            <p>{doc.content}</p>
                        </div>  
                        <img
                            src={profilePictures[doc.sentBy]}
                            className={`chatpfp ${messages[0].sentBy === currentUserId ? 'pfp-right' : 'pfp-left'}`}
                        />
                        {doc.sentBy === currentUserId && (
                            <>
                                <button className="more-options" onClick={() => handlePopup(doc.id)}>
                                    <IoMdMore />
                                </button>
                                {popupVisible && activeMessageId === doc.id && (
                                    <div className="more-options-popup popupVisible">
                                        <button onClick={() => handleDelete(doc.id)} className='more-options-popup-button'>
                                            <IoIosTrash />
                                            <p>Delete message</p>
                                        </button>
                                    </div>
                                )}
                            </>
                            
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='generalChat'>
            <div className='chatField' ref={chatFieldRef}>
                {groupedMessages.map((group, index) => (
                        <MessageGroup key={index} messages={group} currentUserId={currentUserId} />
                ))}
            </div>
            <form className='messageArea' onSubmit={handleSubmit}>
                <textarea 
                    name="messageInputField" 
                    id="messageInputField" 
                    wrap='soft'
                    placeholder='New message...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                >
                </textarea>
                <button 
                    type='submit' 
                    className='sendButton'
                >
                    <IoMdSend />
                </button>
            </form>
        </div>
    );
};

export default General;
