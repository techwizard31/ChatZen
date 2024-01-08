import React from "react";
import { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState();
  const [error, setError] = useState(null);
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // window.addEventListener("keydown",end);
  // function end(e){
  //      if(e.keyCode===13){
  //       sumbithandler()
  //       setError(false)
  //      }
  // }

  const sumbithandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setError("Fill all credentials");
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "api/user/login",
        { email, password },
        config
      );
      setError("Login Successful");
      localStorage.setItem("userinfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
      alert("Login successful")
    } catch (error) {
      setError("Error Occured !");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card1">
        <h1 className="login">Log in</h1>
        <div className="inputBox">
          <input
            type="text"
            required="required"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="user">Email</span>
        </div>

        <div className="inputBox">
          <input
            type="password"
            value={password}
            required="required"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </div>
        <div className="forgot">Forgot Password ?</div>
        <button className="enter" onClick={sumbithandler} isloading={loading}>
          Enter
        </button>
        <button className="enter" onClick={()=>{
          setEmail("guest@example.com")
          setPassword("123456")
        }}>Guest</button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Login;
