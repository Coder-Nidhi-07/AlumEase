import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Sidebar from './components/Sidebar.jsx'
import Directory from './pages/Directory.jsx'
import Feedback from './pages/Feedback.jsx'
import Events from './pages/Events.jsx'
import Profile from './pages/Profile.jsx'
import Search from './pages/Search.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Announcements from './pages/Announcements.jsx'
import Gallery from './pages/Gallery.jsx'
import AddAlumni from './pages/AddAlumni.jsx'
import AlumniDetail from './components/AlumniDetail.jsx'
import TermsAndConditions from './pages/TermsAndConditions.jsx'
import PrivacyPolicy from './pages/PrivacyPolicies.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children : [
      {
        path : '/',
        element : <Home />
      },
      {
        path:'/add-alumni',
        element:<AddAlumni/>
      },
      {
        path : '/directory',
        element : <Directory />
      },{
        path:'/alumni/:id',
        element:<AlumniDetail/>
      },
      {
        path : '/feedback',
        element : <Feedback />
      },
      {
        path : '/events',
        element : <Events />
      },
      {
        path : '/profile',
        element : <Profile />
      },
      {
        path : '/search',
        element : <Search />
      },
      {
        path : '/login',
        element : <Login />
      },
      {
        path: "/admin/login",
        element: <AdminLogin/>
      },
      {
        path : '/signup',
        element : <Signup />
      },
      {
        path : '/admin',
        element : <AdminLogin />
      },
      {
        path : '/dashboard',
        element : <Dashboard />
      },

      {
        path:'/announcements',
        element:<Announcements/>
      },
      {
        path: '/gallery',
        element: <Gallery />
      },
      {
        path: '/policies',
        element: <PrivacyPolicy />
      },
      {
        path: '/conditions',
        element: <TermsAndConditions />
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
