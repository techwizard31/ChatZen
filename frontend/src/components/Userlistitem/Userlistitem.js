import React from 'react'
import './Userlistitem.css'

const Userlistitem = ({user, handleFunction}) => {

  return (
    <div className="usershort" onClick={handleFunction}>
    <img
      src={user.pic}
      alt="error"
      className="shortpic"
    />
    <div className="userdata">
      <h className="shortname">{user.name}</h>
      <span className="useremail"><b>Email:</b> {user.email}</span>
    </div>
  </div>
  )
}

export default Userlistitem