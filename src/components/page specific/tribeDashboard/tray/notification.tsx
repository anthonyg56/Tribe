"use client"

import React, { useContext } from 'react'

import { NotificationContext, TNotificationContext } from '@/utils/contexts/Notification';

interface Props {
  tribeId: string;
}

/**
 * Notification for a tribeLink component, displays the numbers of notifications a user has within a Tribe
 * 
 * NOTE: Not implemented yet, will live in TribeLink.tsx
 * 
 * @param props 
 * @returns 
 */
export default function TrayNotification(props: Props) {
  const { newNotifications, newNotificationsAmount, notifications } = useContext(NotificationContext) as TNotificationContext
  console.log(notifications)
  const styles1: React.CSSProperties = {
    position: 'absolute',
    right: '0',
    backgroundColor: '#F2911B',
    padding: '2px 7px',
    borderRadius: '20px',
    top: '0'
  }
  const styles2: React.CSSProperties = {
    fontFamily: 'IBM Plex Sans',
    fontSize: '11px'
  }

  return (
    <div>
      {newNotifications ? <div style={styles1}>
        <div style={styles2}>
          {newNotificationsAmount}
        </div>
      </div> : null}
    </div >
  )
}
