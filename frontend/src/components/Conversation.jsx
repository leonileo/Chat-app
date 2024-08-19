import React, { useEffect, useState } from 'react'
import { getUser } from '../slices/ChatRequest';
import "./Chat.css"

const Conversation = ({ data, currentUserId, online }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const userId = data.members.find((id) => id !== currentUserId )
        const getUserData = async () => {
            try {
                const {data} = await getUser(userId)
                setUserData(data)
                console.log(userData)
            } catch(error) {
                console.log(error)
            }
        }
        getUserData()
    }, [])
  return (
        <>
    <div className='follower conversation'>
        <div>
            {online && <div className="online-dot"></div>}
            <img src={'/defaultProfile.png'} alt="User Avater" className='followerImage' 
            style={{ width:'50px', height: '50px' }} 
            />
            <div className="name" style={{ fontSize: '0.8rem' }}>
                <span>{userData?.name}</span>
                <span>{online ? "Online": "Offline"}</span>
            </div>
        </div>
    </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />

    </>
  )
}

export default Conversation