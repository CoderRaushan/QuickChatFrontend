
import React from 'react'
import LeftSideBar from './LeftSideBar'
import Feed from './Feed.jsx'
import RightSideBar from './RightSideBar'
import useGetAllPosts from '../Hooks/useGetAllPosts.jsx';
import useGetAllSuggestedUsers from '../Hooks/useGetAllSuggestedUsers.jsx';
function Home() {
  useGetAllPosts();
  useGetAllSuggestedUsers();
  return (
    <div className='flex'>
      <LeftSideBar/>
      <Feed/>
      <RightSideBar/>
    </div>
  )
}

export default Home