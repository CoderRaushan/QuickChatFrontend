import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setMessages } from "../ReduxStore/ChatSlice.js";
import { toast } from "react-toastify";
import { useSocket } from "../SocketContext.js";
function FileUpload({ fileData, setFileData }) {
  const [filePreview, setfilePreview] = useState(null);
  const [TextMsg, setTextMsg] = useState("");
  const dispatch = useDispatch();
  const { selectedUsers, user } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);
  const [loading, setloading] = useState(false);
  const socket = useSocket();
  useEffect(() => {
    if (fileData) {
      const fileurl = URL.createObjectURL(fileData);
      setfilePreview(fileurl);
      return () => URL.revokeObjectURL(fileurl);
    }
  }, [fileData]);

  async function uploadFile(file) {
    try {
      const MainUri = import.meta.env.VITE_MainUri;
      const res = await axios.post(
        `${MainUri}/user/message/get-upload-url`,
        {
          fileType: file.type,
          originalName: file.name,
        },
        {
          withCredentials: true,
        }
      );
      const uploadUrl = res.data.uploadUrl || "";
      const fileUrl = res.data.fileUrl || "";
      if (res.data.success && uploadUrl && fileUrl) {
        const response = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
      } else {
        console.log("file not uploaded to aws s3");
      }
      return {
        fileUrl,
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
      };
    } catch (error) {
      console.log(error);
    }
  }

  // const sendMessageHandler = async (ReceiverId) => {
  //   try {
  //     setloading(true);
  //     const MainUri = import.meta.env.VITE_MainUri;
  //     const { fileUrl, fileType, fileName, fileSize } = await uploadFile(
  //       fileData
  //     );
  //     const res = await axios.post(
  //       `${MainUri}/user/message/file/send/${ReceiverId}`,
  //       { TextMsg,fileUrl,fileType,fileName,fileSize },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     if (res.data.success ) {
  //       setloading(false);
  //       const newMessage = res.data.newMessage;
  //       if (
  //         selectedUsers &&
  //         (newMessage.senderId === selectedUsers._id ||
  //           newMessage.receiverId === selectedUsers._id)
  //       ) {
  //         dispatch(setMessages([...messages, newMessage]));
  //       }
  //       setTextMsg("");
  //       setFileData(null);
  //       toast.success(res.data.message);
  //     } else {
  //       toast.error(res.data.message);
  //     }
  // } catch (error) {
  //   console.error("Error sending message:", error);
  //   setloading(false);
  // };
  // console.log("filePreview",filePreview);
  const sendMessageHandler = async (ReceiverId) => {
    try {
      setloading(true);
      const tempId = `temp-${uuidv4()}`;
      let fileDetails = {};
      if (fileData) {
        const { fileUrl, fileType, fileName, fileSize } = await uploadFile(
          fileData
        );
        fileDetails = { fileUrl, fileType, fileName, fileSize };
      }

      const optimisticMessage = {
        _id: tempId,
        senderId: user._id,
        receiverId: ReceiverId,
        messages: TextMsg,
        status: "sent",
        createdAt: new Date().toISOString(),
        ...fileDetails,
      };

      // Show optimistic message
      dispatch(setMessages([...messages, optimisticMessage]));
      setTextMsg("");
      setFileData(null);
      setloading(false);
      // toast.success(res.data.message);

      // Emit through socket with file + text
      socket.emit("send-message", {
        conversationId: selectedUsers?.conversationId,
        receiverId: ReceiverId,
        text: TextMsg,
        tempId,
        ...fileDetails,
      });
    } catch (error) {
      // toast.error(res.data.message);
      console.error("Error sending message:", error);
      setloading(false);
    }
  };
  const renderPreview = () => {
    if (!fileData || !filePreview) return null;

    const type = fileData.type;

    if (type.startsWith("image/")) {
      return (
        <img
          src={filePreview}
          alt="Image Preview"
          className="w-full h-64 object-cover rounded-md border"
        />
      );
    } else if (type.startsWith("video/")) {
      return (
        <video
          src={filePreview}
          controls
          className="w-full h-64 object-cover rounded-md border"
        />
      );
    } else if (type.startsWith("audio/")) {
      return (
        <audio controls className="w-full mt-2">
          <source src={filePreview} type={type} />
          Your browser does not support the audio element.
        </audio>
      );
    } else if (type === "application/pdf") {
      return (
        <iframe
          src={filePreview}
          className="w-full h-96 border rounded-md"
          title="PDF Preview"
        />
      );
    } else {
      return (
        <div className="mt-2 text-center">
          <p className="text-gray-700 mb-2">{fileData.name}</p>
          <a
            href={filePreview}
            download={fileData.name}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 underline"
          >
            Open / Download
          </a>
        </div>
      );
    }
  };

  return (
    <Dialog
      open={!!fileData}
      onOpenChange={(open) => !open && setFileData(null)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold">
            File Preview
          </DialogTitle>
        </DialogHeader>

        {filePreview && renderPreview()}

        <div className="flex items-center p-2 border-t border-gray-200 mt-4">
          <input
            autoFocus
            value={TextMsg}
            onKeyDown={(e) => {
              if (e.key === "Enter" && TextMsg.trim()) {
                sendMessageHandler(selectedUsers?._id);
              }
            }}
            onChange={(e) => setTextMsg(e.target.value)}
            type="text"
            className="flex-1 mr-2 bg-gray-100 p-2 rounded-md"
            placeholder="Type a message..."
          />

          {loading ? (
            <Button
              disabled
              className="flex items-center justify-center w-full"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending
            </Button>
          ) : (
            <Button onClick={() => sendMessageHandler(selectedUsers?._id)}>
              Send
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileUpload;
