import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from "../config/ChatLogics";
import CreateGroupChatModal from './miscellaneous/CreateGroupChatModal';

const MyChats = ({fetchAgain}) => {
    const [ loggedUser, setLoggedUser ] = useState();
    const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();

    const toast = useToast();

    const fetchChats = async() => {
        try{
            const token = user.token;

            const response = await fetch("/api/chat", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

             // Check if the response status indicates an error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            setChats(data);
        } catch(error) {
            // handle errors here
            toast({
                title: "Error occured!.",
                description: error.message || "Failed to load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    useEffect(()=>{
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, [fetchAgain]);

    const base = selectedChat ? "none" : "flex";

    return (
        <Box
            display={{ base: base, md: "flex" }}
            // display="flex"
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
            mr={3}
        >
            <Box
                as="b"
                pb={3}
                px={3}
                fontSize="30px"
                fontFamily="Work sans"
                display="flex"
                width="100%"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
            >
                My Chats
                <CreateGroupChatModal>
                    <Button
                        display="flex"
                        fontSize="12px"
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </CreateGroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {chats ? (
                <Stack overflowY="scroll">
                    {chats.map((chat) => (
                    <Box
                        onClick={() => setSelectedChat(chat)}
                        cursor="pointer"
                        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                        color={selectedChat === chat ? "white" : "black"}
                        px={3}
                        py={2}
                        borderRadius="lg"
                        key={chat._id}
                    >
                        <Text>
                            {!chat.isGroupChat
                                ? getSender(loggedUser, chat.users)
                                : chat.chatName}
                        </Text>
                        {chat.latestMessage && (
                            <Text fontSize="xs">
                                <b>{chat.latestMessage.sender.name} : </b>
                                {chat.latestMessage.content.length > 50
                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                : chat.latestMessage.content}
                            </Text>
                        )}
                    </Box>
                    ))}
                </Stack>
                ) : (
                <ChatLoading />
                )}
            </Box>
        </Box>
    );
};

export default MyChats;
