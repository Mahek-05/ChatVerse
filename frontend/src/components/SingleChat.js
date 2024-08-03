import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing_animation.json";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;


const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        },
    };
    
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);
    
    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            // Set headers
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            };

            setLoading(true);

            // Make the fetch request
            const response = await fetch(`/api/message/${selectedChat._id}`, {
                method: "GET",
                headers: headers,
            });

            // Check if the response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the response as JSON
            const data = await response.json();

            // Update the messages state
            setMessages(data);

            // Emit the join chat event
            socket.emit("join chat", selectedChat._id);

            setLoading(false);
        } catch (error) {
            // Show error message
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setLoading(false);
        }
    };


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {

            // Clear the new message input
            setNewMessage("");

            socket.emit("stop typing", selectedChat._id);
            try {
                // Set headers
                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                };

                // Prepare the request payload
                const payload = JSON.stringify({
                    content: newMessage,
                    chatId: selectedChat,
                });

                // Make the fetch request
                const response = await fetch("/api/message", {
                    method: "POST",
                    headers: headers,
                    body: payload,
                });

                // Check if the response is ok
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse the response as JSON
                const data = await response.json();

                // Emit the new message event
                socket.emit("new message", data);

                // Update the messages state
                setMessages([...messages, data]);

            } catch (error) {
                // Show error message
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }            
        }
    };

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
        if (
            !selectedChatCompare || // if chat is not selected or doesn't match current chat
            selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
            if (!notification.includes(newMessageRecieved)) {
                setNotification([newMessageRecieved, ...notification]);
                setFetchAgain(!fetchAgain);
            }
        } else {
            setMessages([...messages, newMessageRecieved]);
        }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            { selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user = {getSenderFull(user, selectedChat.users)}/>   
                            </>
                        ):(
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchMessages={fetchMessages}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        p={3}
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                        justifyContent="flex-end"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {istyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                            <Input
                                variant="filled"
                                bg="gray.50"
                                placeholder="Enter a message.."
                                value={newMessage || ''}
                                onChange={typingHandler}
                                autoComplete="off"
                            />
                        </FormControl>

                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize = "3xl" pb={3} fontFamily="Work sans" >
                        Select a chat to start chatting.
                    </Text>
                </Box>
            )}
        </>
    )
}

export default SingleChat;




