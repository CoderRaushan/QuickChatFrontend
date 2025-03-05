import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react'
import { useSelector } from 'react-redux';

function Conversation() {
    const { user, suggestedUsers } = useSelector(store => store.auth);
    const isOnline = false;
  return (
    <div className='flex ml-[16%] h-screen'>
      <section>
        <h1 className='font-bold mb-4 px-3 text-xl mt-6'>{user?.username}</h1>
        <hr className='mb-4 border-gray-300' />
        <div className='overflow-y-auto h-[80vh]'>
          {
            suggestedUsers.map((suggestedUser) => {
              return (
                <div className='flex gap-3 items-center p-5 hover:bg-gray-100 cursor-pointer max-w-[350px]'>
                  <Avatar>
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col pr-12'>
                    <span className='font-medium'>{suggestedUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                      {isOnline ? 'Online' : 'Offline'} 
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>
      </section>
    </div>
  )
}

export default Conversation;