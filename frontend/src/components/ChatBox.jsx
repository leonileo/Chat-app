import React, { useEffect, useRef, useState } from 'react'
import { getUser } from '../slices/ChatRequest';
import { addMessage, getMessages } from '../slices/MessagesRequests';
import "./ChatBox.css";
import {format } from 'timeago.js'
import InputEmoji from 'react-input-emoji'

const ChatBox = ({chat, currentUser, setSendMessage, recieveMessage}) => {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if(recieveMessage !== null && recieveMessage.chatId === chat._id) {
            setMessages([...messages, recieveMessage])
        }
    }, [recieveMessage])

    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser )
        const getUserData = async () => {
            try {
                const {data} = await getUser(userId)
                setUserData(data)
                console.log(data)
            } catch(error) {
                console.log(error)
            }
        }
        if(chat!==null) getUserData();
    }, [chat, currentUser])

    useEffect(() => {
        const fetchMessages = async() => {
            try{
                const {data} = await getMessages(chat._id)
                setMessages(data)
            } catch (error) {
                console.log(error)
            }
        }   
        if(chat!== null) fetchMessages()
    }, [chat])

    const handleChange = (newMessage) => {
        setNewMessage(newMessage)
    }

    const handleSend = async (e) => {
        e.preventDefault()
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id
        }

        // send message to DB

        try {
            const {data} = await addMessage(message);
            setMessages([...messages, data])
            setNewMessage("")
        } catch (error) {
            console.log(error)
        }

        // send message to socket server
        const receiverId = chat.members.find((id) => id !== currentUser);
        setSendMessage({...message, receiverId})

        // Always scroll to the last message
    }
    useEffect(() => {
        scroll.current?.scrollIntoView({ behaviour: "smooth"})
    })
    const scroll = useRef();

  return (
    <>
        <div className="ChatBox-container">
            {chat ? (
              
            <>
                <div className="chat-header">
                    <div className="follower">
                        <div>
                            <img src={'/defaultProfile.png'} alt="User Avater" className='followerImage' 
                            style={{ width:'50px', height: '50px' }} 
                            />
                            <div className="name" style={{ fontSize: '0.8rem' }}>
                                <span>{userData?.name}</span>
                                <span>Online</span>
                            </div>
                        </div>
                    </div>
                    <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
                </div>
                {/* chatbox messages */}
                <div className="chat-body">
                    {messages.map((message) => (
                        <>
                            <div ref={scroll}
                            className={message.senderId === currentUser? "message own": "message"}>
                                <span>{message.text}</span>
                                <span>{format(message.createdAt)}</span>
                            </div>
                        </>
                    ))}
                </div>
                {/* chat sender */}
                <div className="chat-sender">
                    <div>+</div>
                    <InputEmoji 
                    value={newMessage}
                    onChange={handleChange}
                    />
                    <div className="send-button button" onClick={handleSend}>Send</div>
                </div>
            </>
            ) : (
                <span className='chatbox-empty-message'>
                    Tap on a chat to start conversation...
                </span>
            )}
        </div>
    </>
  )
}

export default ChatBox