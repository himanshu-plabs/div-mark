import Navbar from '@/components/EverythingComponents/Navbar'
import ScreenshotComponent from '@/components/EverythingComponents/ScreenshotComponent'
import React from 'react'
import { SignOutButton } from "@clerk/nextjs";


const Serendipity = () => {
  return (
      <div className='bg-[#14161e] min-h-screen px-[80px]'>
          <Navbar />
      <ScreenshotComponent />
      <SignOutButton />
    </div>
  )
}

export default Serendipity