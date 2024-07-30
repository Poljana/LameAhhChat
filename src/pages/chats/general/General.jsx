import './General.css'
import { useEffect, useState } from 'react';
import { doc, addDoc, collection, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IoMdSend, IoIosTrash } from "react-icons/io";


const General = ({ outerCollectionName, outerDocId, nestedCollectionName }) => {
    const [nestedDocuments, setNestedDocuments] = useState([]);
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchNestedCollection = async () => {
            try {
                const nestedCollectionRef = collection(db, `${outerCollectionName}/${outerDocId}/${nestedCollectionName}`);
                const querySnapshot = await getDocs(nestedCollectionRef);
                const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNestedDocuments(docsData);
            } catch (error) {
                console.error("Error fetching nested collection: ", error);
            }
        };

        fetchNestedCollection();
    }, [outerCollectionName, outerDocId, nestedCollectionName]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (message.trim() === '') return

        try {
            const nestedCollectionRef = collection(db, `${outerCollectionName}/${outerDocId}/${nestedCollectionName}`)
            await addDoc(nestedCollectionRef, {
                content : message,
                time : Timestamp.now()
            })
            setMessage('')

            const querySnapshot = await getDocs(nestedCollectionRef)
            const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
            setNestedDocuments(docsData)
        } catch (error) {
            console.error("Error adding document: ", error)
        }
    }

    const handleDelete = async (id) => {
        try {
            const docRef = doc(db, `${outerCollectionName}/${outerDocId}/${nestedCollectionName}`, id)
            await deleteDoc(docRef)

            setNestedDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id))
        } catch (error) {
            console.error("Error deleting document: ", error)
        }
    }

    return (
        <div className='generalChat'>
            <div className='chatField'>
                {nestedDocuments.map(doc => (
                    <div key={doc.id} className='messages'>
                        <p>{doc.content}</p>
                        <button 
                            onClick={() => handleDelete(doc.id)}
                            className='deleteButton'
                        >
                                <IoIosTrash />
                        </button>
                    </div>
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
