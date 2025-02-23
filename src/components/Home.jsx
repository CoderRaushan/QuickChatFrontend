
import React from 'react'
import LeftSideBar from './LeftSideBar'
import Feed from './Feed'
import RightSideBar from './RightSideBar'
import useGetAllPosts from '../Hooks/useGetAllPosts.jsx';
function Home() {
  useGetAllPosts();
  return (
    <div className='flex'>
      Home
      <LeftSideBar/>
      <Feed/>
      <RightSideBar/>
    </div>
  )
}

export default Home