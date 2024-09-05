import React, { useState, useEffect } from "react";
import { useAuthServiceContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const ChatsInterface = () => {
  const { getAllUsers } = useAuthServiceContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await getAllUsers();
      setUsers(response);
    };
    fetchAllUsers();
  }, []);

  return (
    <>
      <h1 className="text-center">Chats</h1>

      <div className="d-flex flex-column">
        {users.map((user) => (
          <div
            key={user.id}
            className="card card-body mb-3"
            style={{ cursor: "pointer", height: "auto" }}
          >
            <div
              className="d-flex justify-content-between"
              onClick={() => navigate(`/chat-room/${user.id}`)}
            >
              <img
                className="rounded-circle me-3"
                src={user.imageUrl}
                alt="user profile pic"
                style={{ height: "40px", width: "40px", objectFit: "cover" }}
              ></img>
              <div className="text-muted text-right">{user.username}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChatsInterface;
