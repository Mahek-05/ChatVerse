import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Route, Routes } from "react-router-dom";
import  Home  from "./pages/Home";
import  Chats  from "./pages/Chats";

function App() {
  return (
  <div className="App">
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/chats" element = {<Chats />} />
    </Routes>
  </div>
  );
  //(
  //   <div className="App">
  //     <Button colorScheme='blue'>Button</Button>
  //   </div>
  // );
}

export default App;
