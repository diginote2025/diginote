import Image from 'next/image'
import React from 'react'

export default function DigiNoteImage() {
  return (
    <div>
      <div className="">
       <Image src={"/images/homepage/hero/hero.png"} alt="" width={1000} height={1000} className=""/>
     </div>
    </div>
  )
}
