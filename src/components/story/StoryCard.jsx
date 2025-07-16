import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function StoryCard({ userId, username, profilePicture }) {
  return (
    <div className="flex flex-col w-[80px]">
      <Link to={`/story/${userId}`}>
        <div className="w-[80px] h-[80px]  from-blue-50 to-blue-950 rounded-full flex items-center justify-center">
          <div className="w-[70px] h-[70px] border-2  rounded-full cursor-pointer overflow-hidden">
            <img
              src={profilePicture}
              alt="User"
              className="w-full object-cover"
            />
          </div>
        </div>
      </Link>
      <div className="text-[14px] text-center truncate w-full font-semibold ">
        {username}
      </div>
    </div>
  );
}

export default StoryCard;
