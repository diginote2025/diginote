import CTA from '@/app/components/CTA'
import FAQ from '@/app/components/FAQ'
import React from 'react'
import Breadcrumb from './Breadcrumb'
import ServicesPage from './ServicesPage'

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
