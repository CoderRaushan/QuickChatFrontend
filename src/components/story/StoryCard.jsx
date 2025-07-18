// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useNavigate, useParams } from "react-router-dom";

// function StoryCard({ userId, username, profilePicture, story }) {
//   const user = useSelector((store) => store.auth.user);
//   const navigate = useNavigate();
//   const handleOpenStory = () => {
//     navigate(`/story/${userId}`, {
//       state: { stories: story }, // send story array for this user
//     });
//   };
//   return (
//     <div className="flex flex-col w-[80px]">
//       <div className="w-[80px] h-[80px]  from-blue-50 to-blue-950 rounded-full flex items-center justify-center">
//         <div className="flex w-[70px] h-[70px] border-2  rounded-full cursor-pointer overflow-hidden">
//           <img
//             src={profilePicture}
//             alt="User"
//             className="w-full object-cover"
//             onClick={handleOpenStory}
//           />
//           <span className=" text-center text-black text-xs">
//             {username}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StoryCard;


import React from "react";
import { useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";

function StoryCard({ data, userId, profilePicture, username }) {
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center w-[90px] cursor-pointer">
      {userId === user?._id ? (
        <>
          <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] rounded-full">
            {/* Inner white ring for separation */}
            <div className="bg-white p-[2px] rounded-full">
              {/* Actual image */}
              <Link to={`/story/${userId}`}>
                <img
                  src={profilePicture}
                  alt="User"
                  className="w-[64px] h-[64px] rounded-full object-cover"
                />
              </Link>
            </div>
          </div>
          {/* Username below */}
          <p className="text-xs text-center mt-2 truncate w-full">{username}</p>
        </>
      ) : (
        <>
          <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px] rounded-full">
            {/* Inner white ring for separation */}
            <div className="bg-white p-[2px] rounded-full">
              <Link to={`/story/${data?.author?._id}`}>
              <img
                src={data?.author?.profilePicture}
                alt="User"
                className="w-[64px] h-[64px] rounded-full object-cover"
              />
              </Link>
            </div>
          </div>
          {/* Username below */}
          <p className="text-xs text-center mt-2 truncate w-full">
            {data?.author?.username}
          </p>
        </>
      )}
    </div>
  );
}

export default StoryCard;
