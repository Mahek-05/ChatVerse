import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react'

const UserListItem = ({user, handleFunction}) => {

    return (
        <Box
            onClick = {handleFunction}
            cursor = "pointer"
            bg = "gray.50"
            _hover = {{
                background: "pink.700",
                color: "white",
            }}
            w="100%"
            display="flex"
            alignItems="center"
            px={3}
            py={2}
            mb={2}
            borderRadius="lg"
        >

            <Avatar 
                mr={2}
                size="sm"
                name={user.name}
                src={user.pic}
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontsize="xs">
                    <b>Email:</b>
                    {user.email}
                </Text>
            </Box>

        </Box>
    )
}

export default UserListItem;
