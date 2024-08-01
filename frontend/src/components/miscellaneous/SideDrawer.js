import React, { useState } from 'react';
import { Box, Button, Menu, MenuButton, 
    MenuList, Text, Tooltip, Avatar, 
    MenuItem, MenuDivider, Drawer, 
    useDisclosure, DrawerOverlay, DrawerContent, 
    DrawerHeader, DrawerBody, Input, DrawerCloseButton, 
    useToast, 
    Spinner} from '@chakra-ui/react';
import { BellIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    
    const { user, setSelectedChat, chats, setChats } = ChatState();
    const navigate = useNavigate(); 

    const { isOpen, onOpen, onClose } = useDisclosure()

    const logout = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const toast = useToast();

    const handleSearch = async() => {
        if(!search) {
            toast({
                title: "Search box cant be empty.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try{
            setLoading(true);
            const token = user.token; // Assuming user.token contains the JWT token
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

            const data = await response.json(); // Parse JSON from the response

            setSearchResult(data);
        } catch(error) {
            // handle errors here
            toast({
                title: "Error occured!.",
                description: error.message || "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
        } finally {
            setLoading(false); // Ensure loading state is set to false regardless of success or failure
        }

    };

    const accessChat = async(userId) => {
        try{
            setLoadingChat(true);
            const token = user.token; // Assuming user.token contains the JWT token
            const searchQuery = encodeURIComponent(search); // Encode search query for URL

            const response = await fetch('api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId
                })
            });

            // Check if the response status indicates an error
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // Parse JSON from the response

            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            onClose();
        } catch(error) {
            // handle errors here
            toast({
                title: "Error occured!.",
                description: error.message || "Failed to load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
        } finally {
            setLoadingChat(false); // Ensure loading state is set to false regardless of success or failure
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent='space-between'
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search Users" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <SearchIcon m='1'/>
                        <Text d={{base: "none", md: "flex"}} px="4">
                            Search User
                        </Text>
                    </Button>                          
                </Tooltip>
                <Text as='b' fontSize="2xl" fontFamily="Work sans">
                    ChatVerse
                </Text>
                <div>
                    <Menu >
                        <MenuButton p={1}>
                            <BellIcon boxSize={6} m='1'/>
                        </MenuButton>
                        <MenuList>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar name={user.name} src={user.pic} size="sm" cursor="pointer"/>
                        </MenuButton>
                        <MenuList>
                            <ProfileModal>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay/>
                <DrawerContent>
                    
                    <DrawerCloseButton/>

                    <DrawerHeader borderBottomWidth="1px">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display='flex' pb={2}>
                            <Input
                                placeholder='Search by name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}> Go </Button>
                                
                        </Box>
                        {loading ? (
                            <ChatLoading/>
                        ):(
                            searchResult?.map((user) => (
                                <UserListItem
                                    key = {user._id}
                                    user = {user}
                                    handleFunction = {() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>

                </DrawerContent>

            </Drawer>
        </>
    );
};

export default SideDrawer;
