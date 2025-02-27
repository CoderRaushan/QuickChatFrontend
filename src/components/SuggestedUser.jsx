import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
function SuggestedUser() {
  const  suggestedUsers = useSelector((store) => store.auth);
//   console.log(suggestedUsers)
//   console.log(suggestedUsers.user.map((it)=>console.log(it)));
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold  text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.user.map((user) => {
        return (
          <div key={user._id}>
            <div className="flex item-center gap-2">
              <Link to={`/profile/${user?.user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.user?.profilePicture} />
                  <AvatarFallback>{user?.user?.name[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user?.user?._id}`}>
                    {user?.user?.name}
                  </Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUser;
