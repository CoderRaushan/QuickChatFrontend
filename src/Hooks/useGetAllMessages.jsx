import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../ReduxStore/ChatSlice.js";

function GetAllMessages() {
  const { selectedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const MainUri = import.meta.env.VITE_MainUri;
        const response = await axios.get(
          `${MainUri}/user/message/all/${selectedUsers._id}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setMessages(response.data.messages));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchAllMessages();
  }, [selectedUsers]);
}

export default GetAllMessages;

