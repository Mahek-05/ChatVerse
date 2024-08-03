import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";
import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    DrawerCloseButton
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    
    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();

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
                p="5px 10px 5px 10px"
                borderWidth="2px"
                borderRadius="6px"
                m="8px"
            >
                <Tooltip label="Search Users" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen} colorScheme="white">
                        <SearchIcon m='1'/>
                        <Text display={{base: "none", md: "flex"}} px={4}>
                            Search User
                        </Text>
                    </Button>                          
                </Tooltip>
                <Text fontSize="3xl" fontFamily="Work sans" >
                    ChatVerse
                </Text>
                <div>
                    <Menu >
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon boxSize={6} m='1' color="white"/>
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                    <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                    >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                    </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton variant="ghost" colorScheme="white" as={Button} rightIcon={<ChevronDownIcon color="pink.700" />}>
                            <Avatar name={user.name} src={user.pic} size="sm" cursor="pointer"/>
                        </MenuButton>
                        <MenuList
                            color="black"
                            bg="gray.50"
                            paddingLeft="7px"
                            paddingRight="7px"
                        >
                            <ProfileModal user={user}>
                                <MenuItem as="b">My Profile</MenuItem>
                            </ProfileModal >
                            <MenuDivider />
                            <MenuItem as="b" onClick={logout}>Logout</MenuItem>
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
                    
                    <DrawerCloseButton />

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
