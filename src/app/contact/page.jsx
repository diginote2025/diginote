import React from 'react'
import Contact from './Conatct'
import Breadcrumb from './Breadcrumb'

export const metadata = {
  title: "Contact DigiNote | Support & Inquiries",
  description:
    "Get in touch with the DigiNote team. Whether you have a question, need support, or want to provide feedback, find all our contact details here, including our address in Raipur.",
  keywords:
    "Contact us, contact DigiNote, DigiNote support, get in touch, customer service, help, inquiries, DigiNote address, DigiNote phone, DigiNote email.",
  
};

export default function page() {
  return (
    <div>
      <Breadcrumb/>
      <Contact/>
    </div>
  )
}
