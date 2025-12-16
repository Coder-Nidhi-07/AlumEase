import React from 'react'
import { Link } from 'react-router-dom';
import homeIcon from '../assets/homeIcon.png'
import userIcon from '../assets/userIcon.png'
import directoryIcon from '../assets/directoryIcon.png'
import eventsIcon from '../assets/eventsIcon.png'
import feedbackIcon from '../assets/feedbackIcon.png'
import galleryIcon from '../assets/galleryIcon.png' // Assuming you'll add a gallery icon
import announceIcon from '../assets/announcementIcon.png'

export function Component() {
  const role = localStorage.getItem("role");   // ⚠️ get logged-in user role

  // // 🔒 Hide sidebar if not admin
  if (role !== "admin") {
    return null;
  }

  return (
    <div className='p-1 min-w-64 h-relative min-h-screen border-r-1 sticky'>
      {role === 'admin' && (<Link className='flex content-center m-3' to={`/dashboard`}>
        <img src={homeIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl '>Dashboard</h3>
      </Link>)}
      
      {/* <Link className='flex content-center m-3' to="/profile">
        <img src={userIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl'>My Profile</h3>
      </Link> */}

      <Link className='flex content-center m-3' to={`/add-alumni`}>
        <img src={directoryIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl'>Add Alumni </h3>
      </Link>

      <Link className='flex content-center m-3' to={`/directory`}>
        <img src={directoryIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl'>Alumni Directory</h3>
      </Link>

      <Link className='flex content-center m-3' to={`/announcements`}>
        <img src={announceIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl'>Announcements</h3>
      </Link>

      <Link className='flex content-center m-3' to="/events">
        <img src={eventsIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl'>Events</h3>
      </Link>

      <Link className='flex content-center m-3' to="/feedback">
        <img src={feedbackIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl'>View Feedback</h3>
      </Link>

      <Link className='flex content-center m-3' to="/gallery">
        <img src={galleryIcon} alt="" className='h-5 m-2 mt-3' />
        <h3 className='m-2 text-xl'>Gallery</h3>
      </Link>
    </div>
  );
}

export default Component;
