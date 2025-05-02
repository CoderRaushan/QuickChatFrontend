import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
function FileUpload({ fileData, setFileData }) {
  const [filePreview, setfilePreview] = useState(null);
  const [TextMsg, setTextMsg] = useState("");
  const dispatch = useDispatch();
  const { selectedUsers } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);
  const [loading, setloading] = useState(false);
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

  const sendMessageHandler = async (ReceiverId) => {
    try {
      const MainUri = import.meta.env.VITE_MainUri;
      setloading(true);
      const {fileUrl,fileType,fileName,fileSize} = await uploadFile(fileData);
      const res = await axios.post(
        `${MainUri}/user/message/file/send/${ReceiverId}`,
        { TextMsg, fileData: fileUrl,fileType,fileName,fileSize },
        {
          withCredentials: true,
        }
      );
      if (res.data.success ) {
        setloading(false);
        const newMessage = res.data.newMessage;
        if (
          selectedUsers &&
          (newMessage.senderId === selectedUsers._id ||
            newMessage.receiverId === selectedUsers._id)
        ) {
          dispatch(setMessages([...messages, newMessage]));
        }
        setTextMsg("");
        setFileData(null);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
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

        {filePreview && (
          <img
            src={filePreview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-md border"
          />
        )}

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
