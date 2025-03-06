import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
function SuggestedUser() {
  const {suggestedUsers,user} = useSelector((store) => store.auth);
  const suggestedUser = suggestedUsers.filter(
    (sugguser) =>  !user?.following?.some((followedUser) => followedUser?._id === sugguser?._id)
  );
  console.log("suggested users =>",suggestedUser);// user?.following?.some((item) => item?._id === UserProfile?._id)
  // const IsFollowing = user?.following?.includes(UserProfile?._id);
  return (
    <div className="my-12">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold  text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUser.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between my-2">
            <div className="flex items-center gap-2 pt-3">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>cn</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user?._id}`}>
                    {user?.username}
                  </Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <span className="text-[#3495d6] text-sm font-bold cursor-pointer hover:text-[#2776AB]">Follow</span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUser;
