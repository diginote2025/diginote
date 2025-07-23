import React from 'react'
import Hero from './Hero'
import Features from './Features'
import About from './About'
import FAQ from './FAQ'
import WhoIsFor from './WhoIsFor'
import CTA from './CTA'
import Navbar from './Navbar'

export default function Homepage() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <About/>
      <WhoIsFor/>
      <Features/>
      <CTA/>
      <FAQ/>
    </div>
  )
}
