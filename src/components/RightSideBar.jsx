// import React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import SuggestedUser from "./SuggestedUser.jsx";
// function RightSideBar() {
//   const { user } = useSelector((store) => store.auth);
//   return (
//     <div className="w-fit my-10 pr-32">
//       <div className="flex item-center gap-2">
//         <Link to={`/profile/${user?._id}`}>
//           <Avatar>
//             <AvatarImage src={user?.profilePicture} />
//             <AvatarFallback>{user?.username[0]}</AvatarFallback>
//           </Avatar>
//         </Link>
//         <div>
//           <h1 className="font-semibold text-sm">
//             <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
//           </h1>
//           <span className="text-gray-600 text-sm">{user?.bio || "Bio here..."}</span>
//         </div>
//       </div>
//       <SuggestedUser/>
//     </div>
//   );
// }

// export default RightSideBar;
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser.jsx";

function RightSideBar() {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="hidden lg:block w-full max-w-xs px-4 lg:px-0 lg:pr-8 mt-10">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600 text-xs">{user?.bio || "Bio here..."}</span>
        </div>
      </div>

      {/* Suggested users will also be responsive */}
      <div className="mt-6">
        <SuggestedUser />
      </div>
    </div>
  );
}

export default RightSideBar;
