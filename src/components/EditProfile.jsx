import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthUser } from "../ReduxStore/authSlice.js";
import axios from "axios";

function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  console.log(user._id);
  const imageRef = useRef();
  const [Loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePicture: null,
    bio: user?.bio || "",
    gender: user?.gender || "male",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const FileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
    }
  };
  const SelectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };
  const EditProfileHandler = async () => {
    try {
      const URI=import.meta.env.VITE_EditUserProfile;
      setLoading(true);
      const formData = new FormData();
      formData.append("profilePicture", input.profilePicture);
      formData.append("bio", input.bio);
      formData.append("gender",input.gender);

      const response = await axios.put(URI, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        const updatedData={
          ...user,
          profilePicture:response.data.user.profilePicture,
          bio:response.data.user.bio,
          gender:response.data.user.gender,
        }
        dispatch(setAuthUser(updatedData));
        navigate(`/profile/${user._id}`);

        toast.success(response.data.message || "Profile Edited");
      } else {
        toast.error(response.data.message || "Profile Edit Failed");
      }
    } catch (error) {
      console.error("Error:", error.response.data.message || error.message);
      toast.error(error.response.data.message || "Profile Edited Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-xl pt-16">Edit Profile</h1>
        <div className="flex item-center gap-2 bg-gray-200 rounded-lg p-4 justify-between pr-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>cn</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.name || "Raushan kumar"}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <input
              name="profilePicture"
              onChange={FileChangeHandler}
              ref={imageRef}
              type="file"
              className="hidden"
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
            >
              Change Photo
            </Button>
          </div>
        </div>
        {/* bio */}
        <div>
          <h1 className="font-bold text-sm mb-3">Bio</h1>
          <textarea
            name="bio"
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            value={input.bio}
            className="focus:ring-0 focus:outline-none bg-gray-100 w-full p-4 h-16 rounded-lg"
          />
        </div>
        <div>
          <h1 className="font-bold text-sm mb-3">Gender</h1>
          <Select value={input.gender} onValueChange={SelectChangeHandler}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Your Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {Loading ? (
            <Button className="pl-32 pr-32 h-12 bg-[#0095F6] hover:bg-[#318bc7]">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button
              onClick={EditProfileHandler}
              className="pl-32 pr-32 h-12 bg-[#0095F6] hover:bg-[#318bc7]"
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
