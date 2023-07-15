"use client"

import React, { useEffect, useState } from 'react'

import { BaseUrl } from '@/utils/misc/constants';
import { CustomHttpRequest } from '@/utils/functions/HTTP';

interface Props {
  tribeId: string;
  userId: string;
}

interface ResponseBody {
  ok: boolean;
  message: string;
  notifications: (string | undefined)[];
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
  const [notifications, setNotifications] = useState<(string | undefined)[]>([])

  useEffect(() => {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }

    /** Once the components loads, this fetches the unread notifications of a tribe */
    const retrieveData = async () => {
      const res = await CustomHttpRequest<ResponseBody>(`${BaseUrl}/notification/unread/${props.tribeId}/${props.userId}`, options)
      
      if (!res) {
        return
      } else if (res.ok && res.parsedBody?.notifications.length) {
        
        setNotifications(res.parsedBody.notifications)
      }
    }

    retrieveData()
  }, [])

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


  const newNotifications = notifications.length ? true : false
  const newNotificationsAmount = notifications.length

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
