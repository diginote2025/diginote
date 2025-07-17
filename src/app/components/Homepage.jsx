import React from 'react'
import Hero from './Hero'
import Features from './Features'
import About from './About'
import FAQ from './FAQ'
import WhoIsFor from './WhoIsFor'
import CTA from './CTA'

export default function Homepage() {
  return (
    <div>
      <Hero/>
      <About/>
      <WhoIsFor/>
      <Features/>
      <CTA/>
      <FAQ/>
    </div>
  )
}
