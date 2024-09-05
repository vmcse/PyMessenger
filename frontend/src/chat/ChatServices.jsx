import useWebSocket from "react-use-websocket";
import { useState } from "react";
import axios from "axios";
import { useAuthServiceContext } from "../auth/AuthContext";

const useChatWebSocket = (user1, user2) => {
  const roomName = "chat_" + [user1, user2].sort().join("_");

  const [messages, setMessages] = useState([]);

  const { user } = useAuthServiceContext();

  const { sendJsonMessage } = useWebSocket(
    `ws://localhost:8000/ws/chat/${user1}/${user2}/`,
    {
      onOpen: async (e) => {
        try {
          const token = user.tokens.access;

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(
            `http://localhost:8000/chatroom/messages/${roomName}/`,
            config
          );
          setMessages([]);
          setMessages(Array.isArray(response.data) ? response.data : []);
          console.log("opened", e);
        } catch (error) {
          console.log(error);
        }
      },
      onMessage: (e) => {
        const message = JSON.parse(e.data);
        setMessages((prev_msgs) => [...prev_msgs, message.new_message]);
      },
      onError: (e) => console.log("error", e),
      onClose: (e) => console.log("closed", e),
    }
  );

  return { sendJsonMessage, messages };
};

export default useChatWebSocket;
