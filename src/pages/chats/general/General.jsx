import './General.css'
import { useEffect, useState } from 'react';
import { doc, addDoc, collection,
         deleteDoc, getDocs, Timestamp,
          query, orderBy } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { IoMdSend, IoIosTrash } from "react-icons/io";
import { onAuthStateChanged } from 'firebase/auth';


const General = ({ outerCollectionName, outerDocId, nestedCollectionName }) => {
    const [nestedDocuments, setNestedDocuments] = useState([]);
    const [message, setMessage] = useState('')
    const [currentUserId, setCurrentUserId] = useState('')

    const fetchNestedCollection = async () => {
        try {
            const nestedCollectionRef = collection(db, `${outerCollectionName}/${outerDocId}/${nestedCollectionName}`);
            const q = query(nestedCollectionRef, orderBy('time', 'asc'))
            const querySnapshot = await getDocs(q);
            const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNestedDocuments(docsData);
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
                        <p className="message-content">
                            {doc.content}
                        </p>
                        {doc.sentBy === currentUserId && (
                            <button onClick={() => handleDelete(doc.id)} className='deleteButton'>
                                <IoIosTrash />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='generalChat'>
            <div className='chatField'>
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
