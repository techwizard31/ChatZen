import React, { useState,useEffect } from 'react'
import { ChatState } from '../context/chatProvider';
import { SideDrawer } from "../components/Chatpage/SideDrawer.js"
import { MyChats } from "../components/Chatpage/MyChats.js";
import { ChatBox } from "../components/Chatpage/ChatBox.js";
import './Chat.css'

function Chat() {
    const {user,firstbox,setFirstbox,secondbox,setSecondbox} = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false)
    const handleResize = () => {
      if (window.innerWidth < 715) {
        setSecondbox(false)
        setFirstbox(true)
      }
      if (window.innerWidth > 715) {
        setSecondbox(true)
        setFirstbox(true)
      }
    };
  
    useEffect(() => {
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

  return (
    <div className='fullchat'>
        {user && <SideDrawer />}
       <div className="box">
        <div className={firstbox ? "visible" : "invisible"}>{user && <MyChats fetchAgain={fetchAgain} />}</div>
       <div className={secondbox ? "visible" : "invisible"}>{user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}</div>
       </div>
    </div>
  )
}

export default Chat;