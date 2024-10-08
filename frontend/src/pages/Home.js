import React, { useEffect } from 'react'
import { 
  Container, 
  Box, 
  Text,   
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW='xl'centerContent>
      <Box
        display="flex"
        alignItems="center"
        justifyContent = "center"
        p={3}
        w="100%"
        m="40px 0 15px 0" 
        borderRadius="lg"
        borderWidth="1px"
        color="white"
      >
        <Text as="b" fontSize="4xl" fontFamily="Work sans">ChatVerse</Text>
      </Box>
      <Box color="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded" colorScheme='pink'>
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Home
