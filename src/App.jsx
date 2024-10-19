import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MintCard from './components/MintCard'
import Hero from './components/Hero'

function App() {
 

  return (
    <>
    <div className='text-start'>
    
    <Hero/>
    <MintCard/>
    </div>
    </>
  )
}

export default App
