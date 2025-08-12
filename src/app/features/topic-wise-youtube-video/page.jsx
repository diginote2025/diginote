import CTA from '@/app/components/CTA'
import FAQ from '@/app/components/FAQ'
import React from 'react'
import Breadcrumb from './Breadcrumb'
import ServicesPage from './ServicesPage'


export const metadata = {
  title: "Topic-Wise Educational Videos | Visual Learning with DigiNote",
  description:
    "Enhance your studies with DigiNote's curated YouTube videos. Access topic-specific playlists from trusted educators to simplify complex concepts, improve retention, and make learning more engaging.",
  keywords:
    "Curated educational videos, topic-wise videos, YouTube learning, study videos, visual learning, educational playlists, student resources, video lectures, online learning, concept simplification, trusted educational content.",
  
};

export default function page() {
  return (
    <div>
      <Breadcrumb/>
      <ServicesPage/>
      <CTA/>
      <FAQ/>
    </div>
  )
}
