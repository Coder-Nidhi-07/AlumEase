import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { Outlet } from "react-router-dom";
import Footer from './components/Footer'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
      <ToastContainer position="top-right" autoClose={2000} />
    <Header />
    
    <Outlet />
    <Footer />
    </>
  )
}

export default App
