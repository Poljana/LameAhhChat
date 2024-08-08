import './Home.css'
import { Link } from 'react-router-dom'

function Home() {

    return (
        <div className='homepage'>
            <div className='welcome'>
                <svg viewBox="0 0 200 200" id='welcomeBlob' xmlns="http://www.w3.org/2000/svg">
                    <path fill="#28A745" d="M34,-46.2C46.7,-37.6,61.4,-31.2,69.4,-19.5C77.3,-7.9,78.4,9,74,24.6C69.6,40.2,59.8,54.5,46.6,56.5C33.4,58.5,16.7,48.2,1.7,45.8C-13.2,43.4,-26.4,49,-39.6,47C-52.8,45,-65.9,35.3,-73.7,21.6C-81.4,7.8,-83.8,-10.1,-78.8,-25.6C-73.8,-41.1,-61.3,-54.2,-47,-62.2C-32.6,-70.3,-16.3,-73.3,-2.8,-69.4C10.7,-65.6,21.3,-54.8,34,-46.2Z" transform="translate(100 100)" />
                </svg>  
                <h1>Welcome to the lamest chat website on the internet</h1>
            </div>
        </div>
    )

}

export default Home