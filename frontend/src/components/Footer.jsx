import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'
import '../App.css'; // Ensure your Tailwind setup is active
import logo2 from "../assets/logo2.png";

function Footer() {
  // Define brand colors for reuse
  const ACCENT_TEXT = 'text-[#FFF1D3]';
  const LINK_HOVER = 'hover:text-[#FFF1D3]/80'; // Darker shade of brown for hover

  return (
    // 1. Footer Container with Gradient
    <footer className='border-t border-[#FFF1D3] bg-[#0E2346] shadow-inner'>
      
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <img src={logo2} alt="" className='h-10' />
        {/* 2. Main Content Grid (Logo/Quote + Links) */}
        <div className='flex flex-col md:flex-row justify-between'>
          
          {/* Left Section: Logo and Quote */}
          <div className='w-full md:w-1/3 mb-6 md:mb-0'>
            <p className={`text-base ${ACCENT_TEXT} max-w-sm`}>
              <b>AlumEase</b> is a platform designed to connect alumni with their institutions, making communication and engagement easier.It goes far
              beyond maintaining records — it strengthens community, promotes
              collaboration, and supports growth for both students and alumni.
            </p>
          </div>
          
          {/* Right Section: Navigation Links */}
          <div className='flex w-full md:w-1/3 justify-start md:justify-end gap-10 lg:gap-20 text-base font-medium'>
            
            {/* Column 1 */}
            <ul className={`${ACCENT_TEXT} space-y-2`}>
              <li className='font-bold text-lg mb-2'>Quick Links</li>
              <li className={`cursor-pointer ${LINK_HOVER}`}>
                <Link to={`/`}>Home</Link>
              </li>
              <li className={`cursor-pointer ${LINK_HOVER}`}>
                <Link to={`/directory`}>Directory</Link>
              </li>
              <li className={`cursor-pointer ${LINK_HOVER}`}>
                <Link to={`/feedback`}>Feedback</Link>
              </li>
              <li className={`cursor-pointer ${LINK_HOVER}`}>
                <Link to={`/admin/login`}>Admin Panel</Link>
              </li>
            </ul>
            
            {/* Column 2 */}
            <ul className={`${ACCENT_TEXT} space-y-2`}>
              <li className='font-bold text-lg mb-2'>Resources</li>
              <li className={`cursor-pointer ${LINK_HOVER}`}>
                <Link to={`/events`}>Events</Link>
              </li>
              <li className={`cursor-pointer ${LINK_HOVER}`}>
                {/* Note: Policies and T&C links are placeholders, adjust routes if needed */}
                <Link to={`/policies`}>Privacy Policies</Link>
              </li>
              <li className={`cursor-pointer ${LINK_HOVER}`}>
                <Link to={`/conditions`}>Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 3. Copyright Bar */}
        <div className='text-center border-t border-[#FFF1D3]/30 pt-4 mt-8'>
          <p className={`text-sm ${ACCENT_TEXT} opacity-80`}>
            © 2025 AlumEase. All rights reserved. Designed for IKGPTU Alumni.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer