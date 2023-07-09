"use client"

import { useContext } from "react"

import TrayItem from "./trayItem"

import { AppContext, TAppContext } from "@/utils/contexts/App"

/**
 * Map of all the tribes a user is apart of
 * 
 */
export default function TribesMap() {
  const { tribes } = useContext(AppContext) as TAppContext

  return (
    <div id="tribes">{
      tribes ? tribes.map((data, index) => <TrayItem
        tribeId={data._id}
        avatar={data.avatar}
        name={data.name}
        key={index}
      />) : null
    }</div>
  )
}
{/* <hr className="bg-gray-200  border border-gray-200 rounded-full mx-2" /> */}