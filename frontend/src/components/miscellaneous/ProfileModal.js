import React from 'react';
import { IconButton, Modal, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Image, Text } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';


const ProfileModal = ({user, children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
      {
        children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
          <IconButton 
            display={{base: "flex" }}
            icon = {<ViewIcon />}
            onClick={onOpen}
          />
        )
      }

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader
            as='b'
            fontSize='4xl'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >
            {user.name}
          </ModalHeader>

          <ModalBody 
            display='flex'
            flexDirection='column'
            alignItems='center'
            gap="7"
          >
              <Image
                borderRadius='full'
                boxSize='300px'
                src={user.pic}
                alt={user.name}
              />
              <Text 
                maxW='-webkit-fill-available'
                as='i'
                fontSize='2xl'
                fontFamily='Work sans'
              >
                {user.email}
              </Text>
          </ModalBody>

          <ModalFooter
            display='flex'
            justifyContent='center'
          >
            <Button fontSize='xl' colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
