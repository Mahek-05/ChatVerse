import React from 'react';
import {useState, useEffect} from 'react';

const Chats = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    
    const response = await fetch('api/chat');
    const data = await response.json();
    setChats(data);
    console.log(data);

  };

  useEffect(() => {
    fetchChats();
  }, [])
  

  return (
    <div>
        <h1>Chat List</h1>
        {chats.map((chat) => (
            <div key={chat._id}>{chat._id}: {chat.chatName}</div>
        ))}
    </div>
  )
};

export default Chats;
