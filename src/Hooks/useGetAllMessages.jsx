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
          `${MainUri}/user/message/all/${selectedUsers?.conversationId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.data.success) {
          // console.log("res.data.messages",response.data.messages);
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

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setMessages } from "../ReduxStore/ChatSlice.js";

// function GetAllMessages() {
//   const { selectedUsers } = useSelector((store) => store.auth);
//   const dispatch = useDispatch();
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const limit = 20; // Adjust page size as needed

//   useEffect(() => {
//     // Reset when selected user changes
//     setPage(1);
//     setHasMore(true);
//   }, [selectedUsers]);

//   useEffect(() => {
//     if (!selectedUsers?.conversationId || !hasMore || loading) return;

//     const fetchMessages = async () => {
//       try {
//         setLoading(true);
//         const MainUri = import.meta.env.VITE_MainUri;

//         const response = await axios.get(
//           `${MainUri}/user/message/all/${selectedUsers.conversationId}?page=${page}&limit=${limit}`,
//           {
//             headers: { "Content-Type": "application/json" },
//             withCredentials: true,
//           }
//         );

//         if (response.data.success) {
//           const newMessages = response.data.messages;

//           // If it's the first page, replace; otherwise, append
//           dispatch((prev) => setMessages(page === 1 ? newMessages : [...prev, ...newMessages]));

//           // If returned messages are less than limit, no more messages
//           if (newMessages.length < limit) setHasMore(false);
//         }
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();
//   }, [page, selectedUsers]);

//   const loadMoreMessages = () => {
//     if (hasMore && !loading) setPage((prev) => prev + 1);
//   };

//   return { loadMoreMessages, loading, hasMore };
// }

// export default GetAllMessages;
