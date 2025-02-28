import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser.jsx";
function RightSideBar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex item-center gap-2">
        <Link to={`/profile/${user?.user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.user?.profilePicture} />
            <AvatarFallback>{user?.user?.name[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?.user?._id}`}>{user?.user?.name}</Link>
          </h1>
          <span className="text-gray-600 text-sm">{user?.user?.bio || "Bio here..."}</span>
        </div>
      </div>
      <SuggestedUser/>
    </div>
  );
}

export default RightSideBar;
