import React, { useState } from "react";
import useGetUserProfile from "../Hooks/useGetUserProfile.jsx";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IoLinkOutline } from "react-icons/io5";
import {
  FaRegUser,
  FaRegBookmark,
  FaRegAddressCard,
  FaAddressCard,
  FaBookmark,
  FaUser,
} from "react-icons/fa";
import { Heart, MessageCircle } from "lucide-react";
import CommentDialog from "./CommentDialog.jsx";
import { setSelectedPost } from "../ReduxStore/PostSlice.js";
function Profile() {
  const [ActiveTab, setActiveTab] = useState("POSTS");
  const [CommentOpen, setCommentOpen] = useState(false);
  const dispatch = useDispatch();
  const HandleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const IsFollowing = false;
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { UserProfile,user } = useSelector((state) => state.auth);
  const IsLogedinUserProfile = user?._id === UserProfile?._id;
  const DisplayData =
    ActiveTab === "POSTS"
      ? UserProfile?.posts
      : ActiveTab === "SAVED"
      ? UserProfile?.bookmarks
      : "";
  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-12 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-36 h-36">
              <AvatarImage
                src={UserProfile?.profilePicture}
                alt="User Avatar"
              />
              <AvatarFallback>{UserProfile?.username[0] || "CN"}</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-6 justify-between">
              <div className="flex justify-between items-center gap-7">
                <span className="text-lg">{UserProfile?.username}</span>
                <div className="flex gap-4">
                  {IsLogedinUserProfile ? (
                    <>
                      <Link to="/account/edit"><Button
                        variant="secondary"
                        className="cursor-pointer bg-gray-200 hover:bg-gray-300 py-0"
                      >
                        Edit profile
                      </Button></Link>
                      <Button
                        variant="secondary"
                        className="cursor-pointer bg-gray-200 hover:bg-gray-300"
                      >
                        View archieve
                      </Button>
                      <CiSettings className="text-4xl cursor-pointer" />
                    </>
                  ) : IsFollowing ? (
                    <>
                      <Button className="bg-[#0895F6] hover:bg-[#3192d2] h-8">
                        Unfollow
                      </Button>
                      <Button
                        variant="secondary"
                        className="h-8 bg-gray-200 hover:bg-gray-300"
                      >
                        Message
                      </Button>
                    </>
                  ) : (
                    <Button className="bg-[#0895F6] hover:bg-[#3192d2] h-8">
                      Follow
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p>
                  <span className="text-[#737373]">
                    <span className="text-black font-semibold">
                      {UserProfile?.posts?.length}
                    </span>{" "}
                    posts
                  </span>
                </p>
                <p>
                  <span className="text-[#737373]">
                    <span className="text-black font-semibold">
                      {UserProfile?.followers?.length}
                    </span>{" "}
                    followers
                  </span>
                </p>
                <p>
                  <span className="text-[#737373]">
                    <span className="text-black font-semibold">
                      {UserProfile?.following?.length}
                    </span>{" "}
                    following
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Raushan Kumar</span>
                <span>
                  <Badge
                    variant="secondary"
                    className="bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    <span className="text-sm">
                      <i
                        class="fa-brands fa-threads"
                        style={{ fontSize: "18px", color: "black" }}
                      ></i>{" "}
                      {UserProfile?.username}
                    </span>
                  </Badge>
                </span>
                <span>{UserProfile?.bio}</span>
                <span>
                  <div className="flex items-center gap-2 text-sm">
                    <IoLinkOutline className="-rotate-45 text-blue-900" />
                    <a
                      href={
                        UserProfile?.website ||
                        "https://rausnotes39.netlify.app"
                      }
                      className="text-blue-900 hover:underline cursor-pointer font-semibold"
                    >
                      {UserProfile?.website ||
                        "https://rausnotes39.netlify.app"}
                    </a>
                  </div>
                </span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200 mt-12">
          <div className="flex items-center justify-center gap-12 text-sm">
            <span
              className={`py-3 cursor-pointer flex gap-2 ${
                ActiveTab === "POSTS" && "font-bold"
              }`}
              onClick={() => HandleTabChange("POSTS")}
            >
              {" "}
              {ActiveTab === "POSTS" ? (
                <FaAddressCard className="text-xl" />
              ) : (
                <FaRegAddressCard className="text-xl" />
              )}
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer flex gap-2 ${
                ActiveTab === "SAVED" && "font-bold"
              }`}
              onClick={() => HandleTabChange("SAVED")}
            >
              {" "}
              {ActiveTab === "SAVED" ? (
                <FaBookmark className="text-xl" />
              ) : (
                <FaRegBookmark className="text-xl" />
              )}
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer flex gap-2 ${
                ActiveTab === "TAGGED" && "font-bold"
              }`}
              onClick={() => HandleTabChange("TAGGED")}
            >
              {ActiveTab === "TAGGED" ? (
                <FaUser className="text-xl" />
              ) : (
                <FaRegUser className="text-xl" />
              )}
              TAGGED
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {DisplayData?.map((post) => (
              <div
                className="relative group cursor-pointer"
                key={post._id}
                onClick={() => {
                  dispatch(setSelectedPost(post));
                  setCommentOpen(true);
                }}
              >
                <img
                  src={post.image}
                  className="rounded-sm my-2 object-cover w-full h-full aspect-square"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-1 ">
                    <button className="flex items-center gap-2 hover-text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CommentDialog
            CommentOpen={CommentOpen}
            setCommentOpen={setCommentOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
