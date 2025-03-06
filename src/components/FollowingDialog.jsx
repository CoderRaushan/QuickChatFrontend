import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
function FollowingDialog({ openFollowing, setopenFollowing, }) {
  const { user } = useSelector((store) => store.auth);
  const [search, setSearch] = useState("");

  const filteredUsers = user?.following?.filter((folUser) =>
    folUser?.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={openFollowing}>
      <DialogContent
        onInteractOutside={() => setopenFollowing(false)}
        className="flex flex-col max-w-sm p-5 rounded-lg"
      >
        {/* Title */}
        <DialogTitle className="text-center text-lg font-semibold">Following</DialogTitle>
        <hr className="border-t border-gray-300 " />
        <DialogDescription className="sr-only">View Following...</DialogDescription>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-100 w-full p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* Following List */}
        <div className="flex flex-col gap-3 mt-3 max-h-60 overflow-y-auto">
          {filteredUsers?.length > 0 ? (
            filteredUsers.map((folUser) => (
              <div
                key={folUser?._id}
                className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer transition duration-200"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={folUser?.profilePicture} />
                    <AvatarFallback>{folUser?.username?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{folUser?.username || "Username"}</span>
                    <span className="text-xs text-gray-500">{folUser?.name || "Name"}</span>
                  </div>
                </div>
                <Button variant="outline" className="text-xs px-4 py-1 border-gray-300">
                  Following
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">No following users found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FollowingDialog;

