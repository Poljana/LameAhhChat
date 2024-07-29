import './General.css'
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { IoMdSend } from "react-icons/io";

const General = ({ outerCollectionName, outerDocId, nestedCollectionName }) => {
    const [nestedDocuments, setNestedDocuments] = useState([]);

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

    return (
        <div className='generalChat'>
            <div className='chatField'>
                {nestedDocuments.map(doc => (
                    <div key={doc.id}>
                        <p>{doc.content}</p>
                    </div>
                ))}
            </div>
            <form className='messageArea'>
                <textarea name="messageInputField" id="messageInputField" wrap='soft'></textarea>
                <button type='submit' className='sendButton'><IoMdSend /></button>
            </form>
        </div>
    );
};

export default General;
