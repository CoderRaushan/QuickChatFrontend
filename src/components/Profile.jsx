import React from "react";
import useGetUserProfile from "../Hooks/useGetUserProfile.jsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { UserProfile } = useSelector((state) => state.auth);
  console.log(UserProfile);
  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-36 h-36">
              <AvatarImage
                src={UserProfile?.profilePicture}
                alt="User Avatar"
              />
              <AvatarFallback>{UserProfile?.username[0] || CN}</AvatarFallback>
            </Avatar>
          </section>
          <section>
            
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
