import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const CreateGroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();
    
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
        console.log(selectedUsers);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const token = user.token; 
            const searchQuery = encodeURIComponent(search); // Encode search query for URL

            const response = await fetch(`/api/user?search=${searchQuery}`, {
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
            
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.message || "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const token = user.token;
            const response = await fetch('/api/chat/group-chat',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id))
                })
            });
            
            console.log(response);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            setChats([data, ...chats]);
            onClose();

            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        } catch (error) {
            toast({
                title: "Failed to create the chat!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } finally {
            setSelectedUsers([]);
            setSearch("");
            setSearchResult([]);
        }
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalCloseButton />
                <ModalContent>
                    <ModalHeader
                        as='b'
                        fontSize='4xl'
                        fontFamily='Work sans'
                        display='flex'
                        justifyContent='center'
                    >
                        Create Group Chat
                    </ModalHeader>

                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        gap="7"
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                autoComplete="off"
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add Users eg: John, Jane'
                                mb={3}
                                onChange={(e) => handleSearch(e.target.value)}
                                autoComplete="off"
                            />
                        </FormControl>

                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            <div>Loading...</div>
                            ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                        )}

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit} colorScheme="blue">
                        Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
};

export default CreateGroupChatModal
