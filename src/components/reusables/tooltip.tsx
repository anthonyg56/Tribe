"use client"

import React, { useState } from 'react'

interface Props {
  string: string;
  className?: string;
  children: React.ReactNode;
}

export default function Tooltip(props: Props) {
  const [show, setShow] = useState(false);

  // const handleMouseIn = (e: any) => {
  //   setShow(true)
  // }

  // const handleMouseOut = (e: any) => {
  //   setShow(false)
  // }

  // const display: React.CSSProperties = show ? { visibility: "hidden"} : { visibility: "visible" }

  return (
    <div className='group relative inline-block w-full'>
      {props.children}
      <span className='w-full inline-block overflow-visible z-[1000] absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-slate-900 text-white p-1 rounded top-1/3 ml-2 left-full'>{props.string}</span>
    </div>
  )
}
// className={`w-[120px] bg-slate-900 text-white rounded-md py-1 absolute z-10 bottom-[125%] left-[50%] -ml-16 opacity-0 ${props.className} after:absolute after:top-[100%] left-[50] margin-left[-5px]`}