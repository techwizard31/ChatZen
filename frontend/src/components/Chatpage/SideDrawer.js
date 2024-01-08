import React, { useState } from "react";
import "./SideDrawer.css";
import "./profileModal.css";
import { ChatState } from "../../context/chatProvider";
import { useNavigate } from "react-router-dom";
import "./Searchbox.css";
import Chatloading from "./Chatloading";
import axios from "axios";
import Userlistitem from "../Userlistitem/Userlistitem.js";
import Spinner from "../Userlistitem/Loaders/Spinner/Spinner";

export const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [dropdown, setDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [logout, setLogout] = useState(false);
  const [searchbox, setSearchbox] = useState(false);

  const navigate = useNavigate();
  const { user, setSelectedChat, chats, setChats } = ChatState();

  window.addEventListener("keydown", end);
  function end(e) {
    if (e.keyCode === 27 || e.keyCode === 37) {
      setSearchbox(false);
    }
    if (e.keyCode === 39) {
      setSearchbox(true);
    }
  }

  const Searchbox = () => {
    return (
      <div className="search-hub">
        <div className="searchbox">
          <h6>Search Users</h6>
          <div className="search-box">
            <input
              type="text"
              className="dabba"
              placeholder="search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <button className="go" onClick={handlesearch}>
              Go
            </button>
          </div>
          {loading ? (
            <Chatloading />
          ) : (
            searchResult.map((user) => {
              return (
                <Userlistitem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              );
            })
          )}
          {loadingChat && <Spinner />}
        </div>
      </div>
    );
  };
  const accessChat = async (userid) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userid }, config);

      if(!chats.find((c)=>c._id === data._id))setChats([data,...chats])

      setSelectedChat(data);
      setLoadingChat(false);
      onclose();
    } catch (error) {
      alert("Error occured while accessing chat")
    }
  };
  const handlesearch = async () => {
    if (!search) {
      alert("Give Valid Details")
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert("User not found")
    }
  };

  if (logout === true) {
    localStorage.removeItem("userinfo");
    navigate("/");
    setLogout(false);
  }

  const ProfileModal = () => {
    return (
      <div className="modal-full">
        <div className="modal">
          <h5>{user.name}</h5>
          <img src={user.pic} alt="Error" className="modalpic" />
          <p>Email: {user.emial}</p>
          <button className="back" onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="navbar">
      <button className="search" onClick={() => setSearchbox(true)}>
        <i className="material-symbols-outlined">search</i>
        Search User
      </button>
      {searchbox && <Searchbox />}
      <h className="title">ChatZen</h>
      <div className="dropinclude">
        <div className="notify">
          <i className="material-symbols-outlined notification">
            Notifications
          </i>
          <button
            className="profile-pic"
            onClick={() => setDropdown(!dropdown)}
          >
            <img src={user.pic} alt="" className="pic" />
            <i
              className="material-symbols-outlined expand"
              onClick={() => setDropdown(!dropdown)}
            >
              expand_more
            </i>
          </button>
        </div>
        {dropdown && (
          <div className="profile-dropdown">
            <li className="item" onClick={() => setShowModal(true)}>
              My Profile
            </li>
            {showModal && <ProfileModal />}
            <li className="item" onClick={() => setLogout(true)}>
              Logout
            </li>
          </div>
        )}
      </div>
    </div>
  );
};
