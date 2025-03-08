import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

function FollowingDialog({ open, setOpen, list, type }) {
  const [search, setSearch] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="flex flex-col max-w-sm p-5 rounded-lg"
      >
        {/* Title */}
        <DialogTitle className="text-center text-lg font-semibold">
          {type === "following" ? "Following" : "Followers"}
        </DialogTitle>
        <hr className="border-t border-gray-300 " />
        <DialogDescription className="sr-only">
          View {type}...
        </DialogDescription>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-100 w-full p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />

        {/* List of Users */}
        <div className="flex flex-col gap-3 mt-3 max-h-60 overflow-y-auto">
          {list?.length > 0 ? (
            list
              .filter((user) =>
                user?.username?.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user?._id}
                  className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer transition duration-200"
                >
                  <Link to={`/profile/${user?._id}`} onClick={()=>setOpen(false)}>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback>
                          {user?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user?.username || "Username"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user?.name || "Name"}
                        </span>
                      </div> 
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    className="text-xs px-4 py-1 border-gray-300 hover:bg-gray-300"
                  >
                    {type === "following" ? "Following" : "followers"}
                  </Button>
                </div>
              ))
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No {type} users found
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FollowingDialog;
