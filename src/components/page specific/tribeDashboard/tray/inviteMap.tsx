"use client"

import { useContext } from 'react'

import TrayItem from './trayItem'

import { AppContext, TAppContext } from '@/utils/contexts/App'

/**
 * Map of all invites to a tribe
 * 
 */
export default function InviteMap() {
  const { invites } = useContext(AppContext) as TAppContext
  const bar = invites?.length ? <hr className="bg-gray-200  border border-gray-200 rounded-full mx-2" /> : null
  return (
    <div>{
      invites?.length ? invites.map((data, index) => <TrayItem
      inviteId={data._id}
      tribeId={data.tribe._id}
      avatar={data.tribe.avatar}
      name={data.tribe.name}
      key={data.tribe._id}
    />) : null
    }</div>
  )
}
