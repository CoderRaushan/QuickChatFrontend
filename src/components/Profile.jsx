import React, { useCallback, useEffect, useState } from "react";
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
import { setAuthUser, setselectedUsers, setUserProfile } from "../ReduxStore/authSlice.js";
import { toast } from "react-toastify";
import axios from "axios";
import FollowingDialog from "./FollowingDialog.jsx";

function Profile() {
  const [ActiveTab, setActiveTab] = useState("POSTS");
  const [CommentOpen, setCommentOpen] = useState(false);
  const dispatch = useDispatch();
  const [openFollowing, setopenFollowing] = useState(false);
  const [openFollower, setopenFollower] = useState(false);
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  const { UserProfile, user } = useSelector((state) => state.auth);
  const [IsFollowing, setIsFollowing] = useState(
    user?.following?.some((item) => item?._id === UserProfile?._id)
  );
  const IsLogedinUserProfile = user?._id === UserProfile?._id;

  const DisplayData =
    ActiveTab === "POSTS"
      ? UserProfile?.posts
      : ActiveTab === "SAVED"
      ? UserProfile?.bookmarks
      : "";

  const handleFollwoAndUnfollow = useCallback(async () => {
    if (!UserProfile || !user) return;
    try {
      const MainUri = import.meta.env.VITE_MainUri;
      const response = await axios.post(
        `${MainUri}/user/followOrUnfollow/${UserProfile._id}`,
        {},
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        const updatedFollowing = IsFollowing
          ? user.following.filter((item) => item._id !== UserProfile._id)
          : [
              ...user.following,
              {
                _id: UserProfile?._id,
                username: UserProfile?.username,
                profilePicture: UserProfile?.profilePicture,
              },
            ];

        const updatedFollowers = IsFollowing
          ? UserProfile.followers.filter((id) => id !== user._id)
          : [...UserProfile.followers, user];

        setIsFollowing((prev) => !prev);
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        dispatch(setUserProfile({ ...UserProfile, followers: updatedFollowers }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  }, [IsFollowing, UserProfile, user, dispatch]);

  useEffect(() => {
    setIsFollowing(
      user?.following?.some((item) => item?._id === UserProfile?._id)
    );
  }, [UserProfile, user]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 ml-[60px] sm:ml-[100px] md:ml-[16%]">
      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <section className="flex justify-center">
            <Avatar className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36">
              <AvatarImage src={UserProfile?.profilePicture} alt="User Avatar" />
              <AvatarFallback>{UserProfile?.username?.[0] || "CN"}</AvatarFallback>
            </Avatar>
          </section>
          <section className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-lg font-semibold">{UserProfile?.username}</span>
              <div className="flex flex-wrap gap-3">
                {IsLogedinUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 py-0">
                        Edit profile
                      </Button>
                    </Link>
                    <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300">
                      View archive
                    </Button>
                    <CiSettings className="text-3xl cursor-pointer" />
                  </>
                ) : IsFollowing ? (
                  <>
                    <Button onClick={handleFollwoAndUnfollow} className="bg-blue-500 hover:bg-blue-600 h-8">
                      Unfollow
                    </Button>
                    <Link to={"/conversation"}>
                    <Button  variant="secondary" className="h-8 bg-gray-200 hover:bg-gray-300">
                      Message
                    </Button>
                    </Link>
                  </>
                ) : (
                  <Button onClick={handleFollwoAndUnfollow} className="bg-blue-500 hover:bg-blue-600 h-8">
                    Follow
                  </Button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <p>
                <span className="text-[#737373]">
                  <span className="text-black font-semibold">{UserProfile?.posts?.length}</span> posts
                </span>
              </p>
              <p className="cursor-pointer" onClick={() => setopenFollower(true)}>
                <span className="text-[#737373]">
                  <span className="text-black font-semibold">{UserProfile?.followers?.length}</span> followers
                </span>
              </p>
              <p className="cursor-pointer" onClick={() => setopenFollowing(true)}>
                <span className="text-[#737373]">
                  <span className="text-black font-semibold">{UserProfile?.following?.length}</span> following
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <span className="font-semibold">{UserProfile?.name}</span>
              <span>
                <Badge variant="secondary" className="bg-gray-200 hover:bg-gray-300 cursor-pointer">
                  <i className="fa-brands fa-threads text-black mr-1" style={{ fontSize: "16px" }}></i>
                  {UserProfile?.username}
                </Badge>
              </span>
              <span>{UserProfile?.bio}</span>
              <span>
                <div className="flex items-center gap-2 text-sm break-all">
                  <IoLinkOutline className="-rotate-45 text-blue-900" />
                  <a
                    href={UserProfile?.website || "https://rausnotes39.netlify.app"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-900 hover:underline font-semibold"
                  >
                    {UserProfile?.website || "https://rausnotes39.netlify.app"}
                  </a>
                </div>
              </span>
            </div>
          </section>
        </div>

        <div className="border-t border-gray-200 mt-6">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm mt-6">
            {["POSTS", "SAVED", "TAGGED"].map((tab) => {
              const isActive = ActiveTab === tab;
              const iconMap = {
                POSTS: isActive ? <FaAddressCard /> : <FaRegAddressCard />,
                SAVED: isActive ? <FaBookmark /> : <FaRegBookmark />,
                TAGGED: isActive ? <FaUser /> : <FaRegUser />,
              };
              return (
                <span
                  key={tab}
                  className={`py-2 px-4 flex items-center gap-2 cursor-pointer ${isActive && "font-bold"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {iconMap[tab]} {tab}
                </span>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {DisplayData?.map((post) => (
              <div
                key={post._id}
                className="relative group cursor-pointer"
                onClick={() => {
                  dispatch(setSelectedPost(post));
                  setCommentOpen(true);
                }}
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover aspect-square rounded-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white gap-4">
                    <span className="flex items-center gap-1">
                      <Heart size={18} />
                      {post?.likes?.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={18} />
                      {post?.comments?.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dialogs */}
        <CommentDialog CommentOpen={CommentOpen} setCommentOpen={setCommentOpen} />
        <FollowingDialog open={openFollowing} setOpen={setopenFollowing} list={UserProfile?.following} type="following" />
        <FollowingDialog open={openFollower} setOpen={setopenFollower} list={UserProfile?.followers} type="followers" />
      </div>
    </div>
  );
}

export default Profile;
