import './App.css';
import { Route, Routes } from "react-router-dom";
import  Home  from "./pages/Home";
import  Chats  from "./pages/Chats";
import ChatProvider from './Context/ChatProvider';

function App() {
  return (
  <ChatProvider>
    <div className="App">
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/chats" element = {<Chats />} />
      </Routes>
    </div>
  </ChatProvider>
  );
}

export default App;
