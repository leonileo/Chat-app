import React, { useEffect, useRef, useState } from 'react'
import "./Chat.css"
import { userChats } from '../slices/ChatRequest'
import Conversation from './Conversation'
import ChatBox from './ChatBox'
import {io} from 'socket.io-client'

const Chat = () => {
    const user = "66c3388d3d52bc6279b1025a"
    const [chats, setChats] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [sendMessage, setSendMessage] = useState(null)
    const [recieveMessage, setRecieveMessage] = useState(null)

    const socket = useRef()

    useEffect(() => {
        if(sendMessage !== null){
            socket.current.emit('send-message', sendMessage)
        }
    }, [sendMessage])

    useEffect(() => {
        socket.current = io('http://localhost:8800')
        socket.current.emit('new-user-add', user)
        socket.current.on('get-users', (users) => {
            setOnlineUsers(users);
        })
    }, [user])

    useEffect(() => {
        socket.current.on('receive-message', (data)=>{
            setRecieveMessage(data)
        })

    }, [])

    useEffect(() => {
        const getChats = async () => {
            try {
                const {data} = await userChats(user)
                setChats(data)
            } catch (error) {
                console.log(error)
            }
        }
        getChats()
    }, [])

    const checkOnLineStatus = (chat) => {
        const chatMembers = chat.members.find((member) => member!== user)
        const online = onlineUsers.find((user) => user.userId=== chatMembers)
        return online? true : false
    }

  return (
    <div className='Chat'>
        {/* left side */}
        <div className="Left-side-chat">
            <div className="Chat-container">
                <h2>Chats</h2>
                <div className="Chat-list">
                    {chats.map((chat) => (
                        <div onClick={() => setCurrentChat(chat)}>
                            <Conversation data={chat} currentUserId={user} online={checkOnLineStatus(chat)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right side */}
        <div className="Right-side-chat">
            {/* chat body */}
            <ChatBox chat={currentChat} currentUser={user} setSendMessage={setSendMessage} recieveMessage={recieveMessage} />
        </div>
    </div>
  )
}

export default Chat