import { createContext,useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
    const navigate = useNavigate()
    const [user,setUser]= useState();
    const [selectedChat, setSelectedChat]= useState();
    const [chats,setChats]= useState();
    const [notification,setNotification] = useState([]);
    const [firstbox,setFirstbox]= useState(true)
    const [secondbox,setSecondbox]= useState(true)
    
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userinfo"))
        setUser(userInfo);
        if(!userInfo){
           navigate('/')
        }
    },[])

    return  <ChatContext.Provider value={{ user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification,firstbox,setFirstbox,secondbox,setSecondbox }}>
            {children}
           </ChatContext.Provider>
}

export const ChatState = () =>{
    return useContext(ChatContext)
}
