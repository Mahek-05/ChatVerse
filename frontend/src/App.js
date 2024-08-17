import './App.css';
import { Route, Routes } from "react-router-dom";
import  Home  from "./pages/Home";
import  Chats  from "./pages/Chats";
import ChatProvider from './Context/ChatProvider';
import {GoogleOAuthProvider} from '@react-oauth/google';

function App() {
  return (  
  <GoogleOAuthProvider clientId="184385429113-85d8brc00ofkc2nuqh96i1ffg09r5npn.apps.googleusercontent.com">
    <ChatProvider>
      <div className="App">
        <Routes>
          <Route path = "/" element = {<Home />} />
          <Route path = "/chats" element = {<Chats />} />
        </Routes>
      </div>
    </ChatProvider>
  </GoogleOAuthProvider>
  
  );
}

export default App;
