import React, { useEffect } from "react";
import { useState } from "react";
import "./Home.css";
import Login from "../components/Authentication/login/login";
import Signup from "../components/Authentication/signup/signup";
import { useNavigate } from "react-router-dom";

function Home() {
  const [need,setNeed]=useState(<Login />)
  const change = ()=>{
    setNeed(<Signup />)
  }
  const changeagain = ()=>{
    setNeed(<Login />)
  }

  const navigate = useNavigate();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"))
    
    if(user){navigate("/chat")}
  },[navigate])
  return (
    <div>
      <div className="total">
        <div className="name">ChatZen</div>
        <div className="options">
          <div className="buttonbox">
            <button className="buttons" onClick={()=>changeagain()}>Login</button>
            <button className="buttons" onClick={()=> change()}>Sign-up</button>
          </div>
          <div className="boxes">{need}</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
