import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import NoChatSelected from '../Components/NoChatSelected';
import ChatContainer from '../Components/ChatContainer';
import Sidebar from '../Components/Sidebar';

const Home = () => {
const [selectedUser, setSelectedUser] = useState();

  return (
   <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;