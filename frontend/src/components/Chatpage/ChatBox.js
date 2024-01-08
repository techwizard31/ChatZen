import React, { useEffect } from 'react'
import "./ChatBox.css"
import { ChatState } from '../../context/chatProvider'
import SingleChat from './SingleChat/SingleChat'

export const ChatBox = (fetchAgain,setFetchAgain) => {

  const { selectedChat } = ChatState()

  useEffect(()=>{
    const a = document.querySelector(".mainchatbox")
    if(selectedChat ===""){
      a.style.display="none"
    }else{
      a.style.display="flex"
      // console.log(a)
    }
  },[])
  return (
    <div className='mainchatbox'><SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /></div>
  )
}

