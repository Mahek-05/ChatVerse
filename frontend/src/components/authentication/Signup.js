import React from 'react';
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";


const Signup = () => {
  const [show, setShow] = useState(false); 
  const handleClick = () => setShow(!show);

  const toast = useToast();
  const navigate = useNavigate(); 

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

const submitHandler = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Set loading state to true
    setPicLoading(true);

    // Check if any required field is empty
    if (!name || !email || !password || !confirmpassword) {
      
      // Display a warning toast if any field is missing
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Set loading state to false
      setPicLoading(false);
      // Exit the function
      return;
    }

    // Check if password and confirm password match
    if (password !== confirmpassword) {
      // Display a warning toast if passwords do not match
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // Exit the function
      return;
    }
    
    // Log the user input values to the console
    console.log(name, email, password, pic);
    
    try {
      // Send a POST request to the server to register the user
      // and the servers response is stored in response variable
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          pic,
        })
      });

      // Parse the response data
      const data = await response.json();

       // Display a success toast on successful registration
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      // Store the user data in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      // Set loading state to false
      setPicLoading(false);
      
      // Redirect to the chats page
      navigate("/chats");

    } catch (error) {

      // Display an error toast if the request fails
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      // Set loading state to false
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatVerse");
      data.append("cloud_name", "chatverse");
      fetch("https://api.cloudinary.com/v1_1/chatverse/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <form onSubmit={submitHandler}>
      {/* for vertically stacking up the form fields */}
      <VStack spacing = '5px'>
        {/* form field for name */}
        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
            focusBorderColor='pink.700'
          />
        </FormControl>
        
        {/* form field for email */}
        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            focusBorderColor='pink.700'
          />
        </FormControl>
        
        {/* form field for password */}
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete='off'
              focusBorderColor='pink.700'
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        
        {/* form field for confirm password */}
        <FormControl id="confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              onChange={(e) => setConfirmpassword(e.target.value)}
              autoComplete='off'
              focusBorderColor='pink.700'
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        
        {/* form field for picture upload */}
        <FormControl id="pic">
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            focusBorderColor='pink.700'
          />
        </FormControl>
        
        {/* form submit button */}
        <Button
          type="submit"
          width="100%"
          style={{ marginTop: 15 }}
          isLoading={picLoading}
          colorScheme='pink'
        >
          Sign Up
        </Button>
      
      </VStack>
    </form>
  );
};

export default Signup;
