import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({children}) => {
    // Initialize state from localStorage
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("userInfo");
        return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    });
    
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState();
    const [notification, setNotification] = useState([]);
    const navigate = useNavigate();

    // useEffect to sync state changes with localStorage
    useEffect(() => {

        if (user) {
            localStorage.setItem("userInfo", JSON.stringify(user));
        } else {
            localStorage.removeItem("userInfo");
            navigate("/");  // Redirect to home if user is not logged in
        }
    }, [user, navigate]);


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