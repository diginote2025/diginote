import CTA from '@/app/components/CTA'
import FAQ from '@/app/components/FAQ'
import React from 'react'
import Breadcrumb from './Breadcrumb'
import ServicesPage from './ServicesPage'

export const metadata = {
  title: "AI Notebook Maker | Instant & Syllabus-Focused Notes by DigiNote",
  description:
    "Instantly generate accurate, syllabus-focused study notes with DigiNote's AI Notebook. Save time, enhance comprehension, and create customizable learning materials for any subject.",
  keywords:
    "AI note generator, AI notebook, smart study companion, syllabus-aligned notes, digital notes, online note taking, topic summarization, study tool for students, automated notes, custom notes",
  
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
