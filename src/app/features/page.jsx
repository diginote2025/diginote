import React from 'react'
import Breadcrumb from './Breadcrumb'
import StudyFeaturesSection from './StudyFeaturesSection'

export const metadata = {
  title: "Features to Study Smarter | AI Notes, MCQ Tests & More | DigiNote",
  description:
    "Discover DigiNote's suite of AI-powered study tools. From instant notes and MCQ practice to a custom test builder and curated videos, we have everything you need for academic success.",
  keywords:
    "AI study tools, learning features, educational platform, study smarter, AI note generator, MCQ practice, unit test builder, curated YouTube videos, online learning tools, student resources, exam preparation, academic tools.",
  
};

export default function page() {
  return (
    <div>
      <Breadcrumb/>
      <StudyFeaturesSection/>
    </div>
  )
}
