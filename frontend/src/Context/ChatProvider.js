import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    // Initialize state from localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser ? JSON.parse(storedUser) : {};
    });
    
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState();
    const [notification, setNotification] = useState([]);
    const navigate = useNavigate();

    // useEffect to sync state changes with localStorage
    useEffect(() => {
        localStorage.setItem("userInfo", JSON.stringify(user));
        if (!user._id) {
            navigate("/");  // Redirect to home if userInfo is not valid
        }
    }, [user]);


    return (
        <ChatContext.Provider value = {{user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>
            {children}
        </ChatContext.Provider>
    )
}

export const ChatState = () => {
    return useContext(ChatContext);
}


export default ChatProvider;