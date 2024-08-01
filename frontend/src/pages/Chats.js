import React from 'react';
import {useState, useEffect} from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import SideDrawer from '../components/miscellaneous/SideDrawer';

const Chats = () => {
  const { user } = ChatState();

  return <div style={{width: "100%"}}>
    {user && <SideDrawer/>}
    <Box
      display="flex"
      justifyContent="space-between"
      w="100%"
      h="91.5vh"
      p="10px"
    >
      {user && <MyChats/>}
      {user && <ChatBox/>}
    </Box>
  </div>;
};

export default Chats;
