import React, { useState, useEffect } from "react";
import { useAuthServiceContext } from "../auth/AuthContext";
import useChatWebSocket from "../chat/ChatServices";
import { useParams } from "react-router-dom";
import Header from "./pages/templates/Layout";
import Scroll from "./Scroll";
import Layout from "./pages/templates/Layout";

const ChatInterface = ({ user1, user2, userId }) => {
  const { sendJsonMessage, messages } = useChatWebSocket(user1, user2);
  const [message, setMessage] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendJsonMessage({
        message,
        sent_by: userId,
      });

      setMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendJsonMessage({
      message,
      sent_by: userId,
    });

    setMessage("");
  };

  return (
    <div style={{ height: "10px" }}>
      <Scroll>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`d-flex mb-3 ${
              msg.sender === user1
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={`card card-body ${
                msg.sender === user1 ? "bg-success" : "bg-secondary"
              }`}
              style={{
                maxWidth: "40%",
                overflowY: "auto",
              }}
            >
              <h5 className="card-title">{msg.sender}</h5>
              <p className="card-text" style={{ fontSize: "1.1em" }}>
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </Scroll>

      <div
        className="sticky-bottom"
        style={{ bottom: 0, width: "100%", margin: 0 }}
      >
        <form className="p-3" onSubmit={handleSubmit}>
          <div className="d-flex gap-3">
            <textarea
              className="form-control"
              value={message}
              rows={1}
              style={{ flexGrow: 1 }}
              onKeyDown={handleKeyDown}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ChatRoom = () => {
  const { user, getUserDetails } = useAuthServiceContext();
  const { user2: user2Param } = useParams();
  const user1 = user.username;
  const [user2, setUser2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = user.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getUserDetails(user2Param);
        setUser2(response);
      } catch (err) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [getUserDetails, user2Param]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <h1 className="text-center">Loading...</h1>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container">
          <h1 className="text-center">{error}</h1>
        </div>
      </>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="d-flex align-items-center justify-content-center gap-3">
          {
            <img
              src={user2.imageUrl}
              alt="Profile pic"
              className="rounded-circle"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            ></img>
          }
          <h1 className="text-center">{user2.username}</h1>
        </div>
        <ChatInterface user1={user1} user2={user2.username} userId={userId} />
      </div>
    </Layout>
  );
};

export default ChatRoom;
