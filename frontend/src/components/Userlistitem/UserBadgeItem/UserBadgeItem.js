import React from "react";
import "./UserBadgeItem.css";

const UserBadgeItem = ({ user, handleFuction }) => {
  return (
    <div className="tagbox">
      <div className="username">{user.name}</div>
      <span
        className="material-symbols-outlined"
        id="deleteuser"
        onClick={handleFuction}
      >
        close
      </span>
    </div>
  );
};

export default UserBadgeItem;
