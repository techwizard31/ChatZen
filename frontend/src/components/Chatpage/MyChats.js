import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import Spinner from "../Userlistitem/Loaders/Spinner/Spinner";
import { getSender } from "../../config/Chatlogics.js";
import "./MyChat.css";
import "../Modals/Newgroup/Newgroup.css";
import Userlistitem from "../Userlistitem/Userlistitem";
import  "../Userlistitem/UserBadgeItem/UserBadgeItem.css";

export const MyChats = ({fetchAgain}) => {
  const { selectedChat, setSelectedChat, user, chats, setChats,setFirstbox,firstbox,secondbox,setSecondbox } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [groupChatName, setGroupChatName] = useState();
  const [groupModal, setGroupModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState();

  const Singlechats = (chat) => {
    const name = !chat.chat.isGroupChat
      ? getSender(loggedUser, chat.chat.users)
      : chat.chat.chatName;

      const Boxchange = ()=>{
        setSelectedChat(chat)
        if(window.innerWidth < 700){
           setFirstbox(!firstbox)
           setSecondbox(!secondbox)
        }
      }

    return (
      <div className="Singlechats" onClick={() => Boxchange()}>
        <h className="apnanaam">{name}</h>
        <span className="lastchat">
          Click to check latest messages
        </span>
      </div>
    );
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      alert("Unable to fetch chats")
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userinfo")));
    fetchChats();
  }, [fetchAgain]);

  const UserBadgeItem = ({user}) => {
    return (
      <div className="tagbox">
        <div className="username">{user.name}</div>
        <span
          className="material-symbols-outlined"
          id="deleteuser"
          onClick={()=>handleDelete(user)}
        >
          close
        </span>
      </div>
    );
  };

  const Newgroup = () => {
    return (
      <div className="boxbackground">
        <div className="addbox">
          <span
            className="material-symbols-outlined"
            id="close"
            onClick={() => setGroupModal(false)}
          >
            close
          </span>
          <header className="create-gc">Create Group Chat</header>
          <input
            type="text"
            placeholder="Chat Name"
            className="gcinput"
            value={groupChatName} 
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Add Users"
            className="gcinput"
            value={deleting} 
            autoFocus 
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="tags">
          {selectedUser.map((u)=>(
            <UserBadgeItem key={user._id} user={u} />
          ))}
          </div>
          {loading ? (
            <div>loading</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <Userlistitem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
          <button className="createbutton" onClick={handleSubmit}>
            Create Chat
          </button>
        </div>
      </div>
    );
  };

  const handleSubmit = async ()=>{
    if(!groupChatName || !selectedUser){
      alert("Give Details")
      return ;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat/group",{
        name: groupChatName,
        users: JSON.stringify(selectedUser.map((u)=>u._id))
      },config)
      setChats([data,...chats])
      onclose();
      alert("A group chat has been created")
      setGroupModal(false)
    } catch (error) {
      alert("Could not create a group")
    }
  }

  const handleDelete = (delUser)=>{
    setSelectedUser(selectedUser.filter((sel)=> sel._id !== delUser._id))
  }

  const handleGroup = (userToAdd)=>{
    if(selectedUser.includes(userToAdd)){
      alert("user already exists")
    }
    setSelectedUser([...selectedUser,userToAdd])
  }

  const handleSearch = async (query) => {
    setSearch(query);
    setDeleting(query)
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`./api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("User not found")
    }
  };

  return (
    <div className="chats-box">
      <div className="name-newbutton">
        <h className="naam">My Chats</h>
        <button className="newbutton" onClick={() => setGroupModal(true)}>
          New Group Chat
        </button>
        {groupModal && <Newgroup />}
      </div>
      {chats ? (
        chats.map((chat) => {
          return <Singlechats key={chat._id} chat={chat} />;
        })
      ) : (
        <Spinner />
      )}
    </div>
  );
};