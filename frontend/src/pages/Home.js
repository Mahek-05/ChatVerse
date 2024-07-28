import React from 'react'
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

const Home = () => {
  return (
    <Container maxW='xl'centerContent>
      <Box
        display="flex"
        alignItems="center"
        justifyContent = "center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0" 
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">ChatVerse</Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
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