import CTA from '@/app/components/CTA'
import FAQ from '@/app/components/FAQ'
import React from 'react'
import Breadcrumb from './Breadcrumb'
import ServicesPage from './ServicesPage'

export const metadata = {
  title: "AI MCQ Practice Tests | Create Custom Online Quizzes | DigiNote",
  description:
    "Master any subject with DigiNote's AI-powered MCQ practice tests. Get instant feedback, track performance, and create custom quizzes to identify weak areas and boost exam confidence.",
  keywords:
    "MCQ practice, AI MCQ test, online practice tests, custom quiz maker, exam preparation, topic-wise MCQs, student assessment, online quiz, adaptive testing, instant feedback, knowledge assessment, test generator.",
  
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
