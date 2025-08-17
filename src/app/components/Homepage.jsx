import React from 'react'
import Hero from './Hero'
import Features from './Features'
import About from './About'
import FAQ from './FAQ'
import WhoIsFor from './WhoIsFor'
import CTA from './CTA'
import Navbar from './Navbar'
import Signin from './Authentication/Signin'
import DigiNoteImage from './DigiNoteImage'
import Blog from './Blog'
import ExamPreparation from './ExamPreparation'

export default function Homepage() {
  return (
    <div>

      <Hero/>
      {/* <Signin/> */}
      {/* <DigiNoteImage/> */}
      <Features/>
      <About/>
      <WhoIsFor/>
      <ExamPreparation/>
      <CTA/>
      <Blog/>
      <FAQ/>
    </div>
  )
}
