import React from 'react'
import Sidebar from '../components/Sidebar'
import Container from '../components/Container'
import MainPage from './MainPage'
import Directory from './Directory'
import Events from './Events'
import Feedback from './Feedback'

function Home() {
  return (
    <>
      <Container>
          <Sidebar />
        <div >
        
          <MainPage />
        </div>
        {/* <div>
          <MainPage />
          <Directory/>
          <Events/>
          <Feedback/>
        </div> */}
      </Container>

    </>
  )
}

export default Home
