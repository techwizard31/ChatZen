import React from "react";
import { useState } from "react";
import "./signup.css";
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

function Signup() {
  const [name,setName] = useState();
  const [error,setError] = useState(null);
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [pic,setPic] = useState();
  const [isloading,setIsloading] = useState(false);
  console.log(pic)

  const postDetails = (pic) =>{ 
    setIsloading(true)
    if(pic===undefined){
      setError("Please upload an Image")
      return;
    }
    if(pic.type === "image/jpeg" || pic.type === "image/png" || pic.type === "image/jpg"){
      const data = new FormData();
      data.append("file",pic)
      data.append("upload_preset","ChatZen");
      data.append("cloud_name","dirszb3rw")
      fetch("https://api.cloudinary.com/v1_1/dirszb3rw",{
        method:"post", body: data,
      }).then((res)=>res.json())
      .then((data)=>{
        setPic(data.url.toString())
        console.log(pic)
        isloading(false)
      }).catch((error)=>{
        console.log(error)
        setIsloading(false); 
      })
    }else{
      setError("Please select an image with valid format")
    }
  }
  const navigate = useNavigate();

  const sumbithandler= async ()=>{
    setIsloading(true);
    setError(null)
    if(!name || !email || !password ){
        setIsloading(false);
        setError("Fill all credentials")
        return;
      }
      try {
        const config = {
          headers:{
            'Content-type':'application/json',
          },
          body:JSON.stringify({name,email,password})
        }
        const { data } = await axios.post("/api/user",{name,email,password,pic},config);
        alert("Registration successful")
        console.log(pic)
        localStorage.setItem("userinfo",JSON.stringify(data));
        setIsloading(false)
        navigate("/chat");
      } catch (error) {
        setError("Error Occured !")
        setIsloading(false)
      }
  }
  
  return (
    <div className="container">
      <div className="card">
        <h2 className="singup">Sign Up</h2>
        <div className="inputBox">
          <input type="text" required="required" onChange={(e)=>setName(e.target.value)}/>
          <span>Name</span>
        </div>
        <div className="inputBox1">
          <input type="text" required="required" onChange={(e)=>setEmail(e.target.value)}/>
          <span className="user">Email</span>
        </div>

        <div className="inputBox">
          <input type="password" required="required" onChange={(e)=>setPassword(e.target.value)}/>
          <span>Password</span>
        </div>
        <div className="upload">
          <h3>Upload profile pic</h3>
          <input type="file" accept="image" onChange={(e)=>setPic(e.target.files[0].toString())}/>
        </div>
        <button className="enter1" onClick={sumbithandler} isloading={isloading}>Enter</button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default Signup;