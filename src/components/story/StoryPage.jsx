// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function StoryPage() {
//   const [Story, setStory] = useState([]);
//   const MainUri = import.meta.env.VITE_MainUri;
//   const params = useParams();
//   const userId = params.id;

//   useEffect(() => {
//     const HandleFetchStory = async () => {
//       try {
//         console.log(userId);
//         const response = await axios.get(`${MainUri}/user/story/${userId}`, {
//           withCredentials: true,
//         });
//         if (response.data.success) {
//           setStory(response.data.story);
//           console.log(response.data);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     HandleFetchStory();
//   }, [userId]);
//   return <div>StoryPage</div>;
// }

// export default StoryPage;

// import axios from "axios";
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// function StoryPage() {
//   const [stories, setStories] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const intervalRef = useRef(null);
//   const params = useParams();
//   const userId = params.id;
//   const navigate = useNavigate();
//   const MainUri = import.meta.env.VITE_MainUri;

//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const response = await axios.get(`${MainUri}/user/story/${userId}`, {
//           withCredentials: true,
//         });
//         if (response.data.success) {
//           setStories(response.data.stories || []);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchStories();
//   }, [userId]);

//   useEffect(() => {
//     if (stories.length === 0) return;

//     setProgress(0);
//     clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           handleNext();
//           return 0;
//         }
//         return prev + 2;
//       });
//     }, 100);

//     return () => clearInterval(intervalRef.current);
//   }, [currentIndex, stories]);

//   const handleNext = () => {
//     if (currentIndex < stories.length - 1) {
//       setCurrentIndex((prev) => prev + 1);
//     } else {
//       handleClose();
//     }
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prev) => prev - 1);
//     }
//   };

//   const handleClose = () => {
//     navigate(-1);
//   };

//   if (stories.length === 0) {
//     return (
//       <div className="text-white text-center mt-10">No stories available.</div>
//     );
//   }

//   const currentStory = stories[currentIndex];

//   return (
//     <div
//       className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
//       onClick={handleClose} // ✅ clicking outside will close
//     >
//       {/* Close Button */}
//       <button
//         onClick={handleClose}
//         className="absolute top-5 right-5 text-white text-2xl font-bold z-50"
//       >
//         &times;
//       </button>

//       {/* Story Viewer Box */}
//       <div
//         className="relative w-[430px] h-[750px] bg-black rounded-lg overflow-hidden shadow-lg"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Progress bar */}
//         <div className="absolute top-2 left-2 right-2 flex space-x-1 z-30">
//           {stories.map((_, idx) => (
//             <div
//               key={idx}
//               className="flex-1 h-1 bg-gray-600 rounded"
//               style={{
//                 backgroundColor: idx < currentIndex ? "#fff" : "#555",
//                 overflow: "hidden",
//               }}
//             >
//               {idx === currentIndex && (
//                 <div
//                   className="h-full bg-white"
//                   style={{ width: `${progress}%`, transition: "width 0.1s" }}
//                 />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Media content */}
//         <div className="w-full h-full flex items-center justify-center">
//           {currentStory.mediaType === "image" ? (
//             <img
//               src={currentStory.mediaUrl}
//               alt="story"
//               className="max-w-full max-h-full object-contain"
//             />
//           ) : (
//             <video
//               src={currentStory.mediaUrl}
//               autoPlay
//               controls
//               className="max-w-full max-h-full object-contain"
//             />
//           )}
//         </div>

//         {/* Tap zones */}
//         <div
//           className="absolute top-0 left-0 h-full w-1/2"
//           onClick={(e) => {
//             e.stopPropagation();
//             handlePrev();
//           }}
//         />
//         <div
//           className="absolute top-0 right-0 h-full w-1/2"
//           onClick={(e) => {
//             e.stopPropagation();
//             handleNext();
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default StoryPage;

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaVolumeMute, FaPlay, FaHeart, FaRegHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaPause } from "react-icons/fa6";
function StoryPage() {
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef(null);
  const videoRef = useRef(null);
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [like,setlike] = useState(stories[currentIndex]?.likes?.includes(userId) || false);
  const MainUri = import.meta.env.VITE_MainUri;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Only fetch if not already fetched
        if (stories.length === 0) {
          const response = await axios.get(`${MainUri}/user/story/${userId}`, {
            withCredentials: true,
          });
          // Only set if new data is different
          if (
            JSON.stringify(stories) !== JSON.stringify(response.data.stories)
          ) {
            setStories(response.data.stories || []);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStories();
  }, [userId]);
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
      if (isPlaying) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [isMuted, isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (stories.length === 0) return;
    setProgress(0);
    clearInterval(timeoutRef.current);
    const current = stories[currentIndex];

    if (current.mediaType === "image") {
      const duration = 10000; // 10 seconds
      const start = Date.now();

      timeoutRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = (elapsed / duration) * 100;
        setProgress(Math.min(percent, 100));
        if (elapsed >= duration) {
          clearInterval(timeoutRef.current);
          handleNext();
        }
      }, 50); // update every 50ms for smoothness
    } else if (current.mediaType === "video") {
      const video = videoRef.current;
      const onLoadedMetadata = () => {
        const duration = video.duration * 1000;
        const start = Date.now();

        timeoutRef.current = setInterval(() => {
          const elapsed = Date.now() - start;
          const percent = (elapsed / duration) * 100;
          setProgress(Math.min(percent, 100));
          if (elapsed >= duration) {
            clearInterval(timeoutRef.current);
            handleNext();
          }
        }, 50);
      };

      if (video) {
        video.addEventListener("loadedmetadata", onLoadedMetadata);
      }

      return () => {
        if (video) {
          video.removeEventListener("loadedmetadata", onLoadedMetadata);
        }
      };
    }

    return () => clearInterval(timeoutRef.current);
  }, [currentIndex, stories]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };
  // console.log(stories);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (stories.length === 0) {
    return (
      <div className="text-white text-center mt-10">No stories available.</div>
    );
  }

  const currentStory = stories[currentIndex];
  const dummyUser = {
    username: "satishray_",
    profilePic: "/default-avatar.jpg", // replace with actual user pic
    song: "Kishore Kumar · Aa Chalke Tujhe - Door",
  };
  const getTimeAgo = (createdAt) => {
    const createdTime = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdTime;

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHrs = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHrs > 0) return `${diffHrs}h`;
    if (diffMin > 0) return `${diffMin}m`;
    return `${diffSec}s`;
  };
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Story Box */}
      <div
        className="relative w-[430px] h-[750px] bg-black rounded-lg overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="absolute top-2 left-2 right-2 flex space-x-1 z-30">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 bg-gray-600 rounded"
              style={{
                backgroundColor: idx < currentIndex ? "#fff" : "#555",
              }}
            >
              {idx === currentIndex && (
                <div
                  className="h-full bg-white"
                  style={{ width: `${progress}%`, transition: "width 0.1s" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Top Info Bar */}
        <div className="absolute top-4 left-4 z-40 flex items-center space-x-2 text-white">
          <img
            src={stories[currentIndex]?.author?.profilePicture}
            alt="profile"
            className="w-9 h-9 rounded-full border border-white"
          />
          <div className="text-sm">
            <div className="flex gap-2 items-center justify-between">
              <p className="font-semibold">
                {stories[currentIndex]?.author?.username}
              </p>
              <p className="text-xs opacity-80">
                {getTimeAgo(stories[currentIndex]?.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-xs opacity-80">
                {stories[currentIndex]?.song}
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Icons */}
        <div className="absolute top-6 right-4 z-40 flex items-center space-x-4 text-white">
          {/* Mute / Unmute toggle */}
          <button onClick={() => setIsMuted((prev) => !prev)}>
            {isMuted ? <FaVolumeMute size={20} /> : <HiSpeakerWave size={20} />}
          </button>

          {/* Play / Pause toggle */}
          <button onClick={() => setIsPlaying((prev) => !prev)}>
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>

          <BsThreeDots />
        </div>

        {/* Main Content */}
        <div className="w-full h-full flex items-center justify-center">
          {currentStory.mediaType === "image" ? (
            <img
              src={currentStory.mediaUrl}
              alt="story"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={currentStory.mediaUrl}
              autoPlay
              className="max-w-full max-h-full object-contain"
              ref={videoRef}
            />
          )}
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-5 left-4 right-4 z-40 flex items-center justify-between px-3">
          <input
            type="text"
            placeholder={`Reply to ${dummyUser.username}...`}
            className="bg-white/10 text-white placeholder:text-gray-300 rounded-full px-4 py-2 w-full mr-3 border border-white/20"
          />
          {
            like ? (
              <FaHeart
               size={24}
                className="text-red-500 text-xl cursor-pointer"
                onClick={() => setlike(false)}
              />
            ) : (
              <FaRegHeart
                size={24}
                className="text-red-500 text-xl cursor-pointer"
                onClick={() => setlike(true)}
              />
            )}
        </div>

        {/* Left/Right Tap Zones */}
        <div
          className="absolute top-0 left-0 h-full w-1/2"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        />
        <div
          className="absolute top-0 right-0 h-full w-1/2"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        />
      </div>
    </div>
  );
}

export default StoryPage;
