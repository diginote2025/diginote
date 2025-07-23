"use client";

import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { FaSun } from "react-icons/fa";
import { IoIosMoon } from "react-icons/io";
import Image from "next/image";

export default function Navbar({ theme, themeHandle }) {
  return (
    <nav
      className={`w-full z-50 h-16  
 flex justify-center items-center`}
    >
      <div className="w-full max-w-[1200px] max-lg:w-[90%] flex justify-between items-center">
        <div className="flex gap-5">
          {/* <div className="">
            <FiMenu size={30} />
          </div> */}
          <a href="/" className="text-2xl">
            <Image src={'/images/homepage/navbar/logo.png'} alt="diginote logo" width={1000} height={1000} className="w-36"/>
          </a>
        </div>
        {/* <div className="hidden">
          <button onClick={themeHandle}>
            {" "}
            {theme ? <FaSun size={30} /> : <IoIosMoon size={30} />}
          </button>
        </div> */}
      </div>
    </nav>
  );
}
