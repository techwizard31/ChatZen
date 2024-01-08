import React, { useEffect, useState } from "react";
import "./SingleChat.css";
import "../profileModal.css";
import { ChatState } from "../../../context/chatProvider";
import { getSender, getSenderFull } from "../../../config/Chatlogics";
import UserBadgeItem from "../../Userlistitem/UserBadgeItem/UserBadgeItem";
import axios from "axios";
import Groupchatloader from "../../Userlistitem/Loaders/Groupchatloader/Groupchatloader.js";
import Spinner from "../../Userlistitem/Loaders/Spinner/Spinner";
import Userlistitem from "../../Userlistitem/Userlistitem";
import ScrollableChat from "../../ScrollableChat/ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../../Animation - 1698513080200.json";
import song from "./notification.mp3";
// import { useNavigate } from "react-router-dom";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = (fetchAgain, setFetchAgain) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification ,setFirstbox,firstbox,secondbox,setSecondbox} = ChatState();
  const [dekho, setDekho] = useState(false);
  const [send,setSend] = useState(false)
  const [groupDekho, setGroupDekho] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  function play() {
    new Audio(song).play();
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const UpdateGroupChatModal = (fetchAgain, setFetchAgain, fetchMessages) => {
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);

    const handleRemove = async (user1) => {
      if (selectedChat.chat.groupAdmin._id !== user._id) {
        alert("Only admins can remove")
        setLoading(false);
        return;
      } else {
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `/api/chat/groupremove`,
            {
              chatId: selectedChat.chat._id,
              userId: user1._id,
            },
            config
          );
          (user1._id === user._id)
            ? setSelectedChat()
            : setSelectedChat(data);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          fetchMessages();
          setLoading(false);
          alert("User removed successfully")
        } catch (error) {
          alert("Could not remove the user")
          setLoading(false)
        }
      }
    };

    const handleRename = async () => {
      if (!groupChatName) return;
      try {
        console.log(selectedChat.chat._id)
        setRenameloading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          "/api/chat/rename",
          {
            chatId: selectedChat.chat._id,
            chatName: groupChatName,
          },
          config
        );
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameloading(false);
      } catch (error) {
        console.log(selectedChat)
        alert("Only admins can rename")
        setRenameloading(false);
      }
    };

    const handleSearch = async (query) => {
      setSearch(query);
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

    const handleAddUser = async (user1) => {
      if (selectedChat.chat.users.find((u) => u._id === user1._id)) {
        alert("the user is already in the group")
        return;
      } else {
        if (selectedChat.chat.groupAdmin._id !== user._id) {
          console.log(user1);
          alert("only admins can add")
          console.log(selectedChat);
          return;
        } else {
          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.put(
              "/api/chat/groupadd",
              {
                chatId: selectedChat.chat._id,
                userId: user1._id,
              },
              config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
          } catch (error) {
            alert("Error occured")
            setLoading(false);
          }
        }
      }
    };

    return (
      <div class="anivarya">
        <div class="puramodal">
          <span
            class="material-symbols-outlined"
            id="close1"
            onClick={() => setGroupDekho(false)}
          >
            close
          </span>
          <p class="current">{selectedChat.chat.chatName}</p>
          <div class="sareusers">
            {selectedChat.chat.users.map((u) => {
              return (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFuction={() => handleRemove(u)}
                />
              );
            })}
          </div>
          <div class="inputbox1">
            <input
              type="text"
              class="chatname"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <button
              class="updateit"
              isloading={renameloading}
              onClick={handleRename}
            >
              Update
            </button>
          </div>
          <input
            type="text"
            class="addusers"
            placeholder="Add Users To Group"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <Groupchatloader />
          ) : (
            searchResult.map((user) => (
              <Userlistitem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
          <button class="leave" onClick={() => handleRemove(user)}>
            Leave Group
          </button>
        </div>
      </div>
    );
  };

  const ProfileModal = (user) => {
    return (
      <div className="modal-full">
        <div className="modal">
          <h5>{user.user.name}</h5>
          <img src={user.user.pic} alt="Error" className="modalpic" />
          <p>Email: {user.user.email}</p>
          <button className="back" onClick={() => setDekho(false)}>
            Close
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  },[]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare.chat._id !== newMessageRecieved.chatId
        ) {
          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            play();
            window.location.reload()
            // useNavigate(/chat/)
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  const sendMessage = async () => {
    if (send === true) {
      socket.emit("stop typing", selectedChat.chat._id);
      setSend(false)
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const a = selectedChat.chat._id;
        console.log(newMessage);
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: a,
          },
          config
        );
        setNewMessage("");
        socket.emit("new message", data, selectedChat);
        setMessages([...messages, data]);
      } catch (error) {
        alert("failed to send the message")
      }
    }
  };

  const typingHandler = (u) => {
    setNewMessage(u.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat.chat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat.chat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const a = selectedChat.chat._id;
      setLoading(true);
      const { data } = await axios.get(`/api/message/${a}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", a);
    } catch (error) {
      alert("Unable to fetch data")
    }
  };
  const bhejo = ()=>{
    setSend(true)
    sendMessage()
  }

  const backkro = ()=>{
    setFirstbox(!firstbox)
    setSecondbox(!secondbox)
  }

  return (
    <div>
      {selectedChat ? (
        <div className="SingleChat">
          <div>
            {!selectedChat.chat.isGroupChat ? (
              <div className="chatnamemodal">
                <span className="material-symbols-outlined" id ="backbox" onClick={backkro}>arrow_back_ios</span>
                <header>{getSender(user, selectedChat.chat.users)}</header>
                <span
                  class="material-symbols-outlined"
                  onClick={() => {
                    setDekho(true);
                  }}
                  id="visible"
                >
                  visibility
                </span>
                {dekho && (
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.chat.users)}
                  />
                )}
              </div>
            ) : (
              <div className="chatnamemodal">
                <span className="material-symbols-outlined" id ="backbox" onClick={backkro} >arrow_back_ios</span>
                <header>{selectedChat.chat.chatName}</header>
                <span
                  class="material-symbols-outlined"
                  onClick={() => {
                    setGroupDekho(true);
                  }}
                  id="visible"
                >
                  visibility
                </span>
                {groupDekho && (
                  <UpdateGroupChatModal
                    fetchagain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                )}
              </div>
            )}
          </div>
          <div className="damagecontrol">
            {loading ? (
              <Spinner />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping ? (
              <div>
                <Lottie
                  width={75}
                  options={defaultOptions}
                  style={{ marginBottom: 0, marginLeft: 1, paddingBottom: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <div className="fullsend">
            <input
              type="text"
              placeholder="Enter a message..."
              onChange={(u) => typingHandler(u)}
              value={newMessage}
              className="messageinput"
            />
            <button className="material-symbols-outlined" id="send" onClick={bhejo}>send</button>
            </div>
          </div>
        </div>
      ) : (
        <h className="singleline">Click on a user to start chatting</h>
      )}
    </div>
  );
};

export default SingleChat;