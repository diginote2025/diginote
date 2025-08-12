import React from 'react'
import AboutUs from './About'
import FAQ from '../components/FAQ'
import MissionVisionGoal from './Mission'
import HappyClientSection from '../components/CTA'
import Breadcrumb from './Breadcrumb'

export default function page() {
  return (
    <div>
      <Breadcrumb/>
      <AboutUs/>
      <MissionVisionGoal/>
      <HappyClientSection/>
      <FAQ/>
    </div>
  )
}
