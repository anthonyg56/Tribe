"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { INotification } from "@/@types/notifications"

import { AuthContext, TAuthContext } from "./Auth"
import { getNotifications, readNotificationsReq } from "../api/tribes"

export type TNotificationContext = {
  isLoading: boolean;
  notifications: INotification[] | null;
  readNotifications: () => Promise<void>;
  newNotificationsAmount: number | undefined;
  unreadNotificationsId: (string | undefined)[] | undefined;
  newNotifications: boolean;
}

export const NotificationContext = createContext<Partial<TNotificationContext>>({})

interface Props {
  tribeId: string;
  children: React.ReactNode;
}

/* All the tools and utilities we need for handling the notifications within a tribe */
export default function NotificationProvider(props: Props) {
  // const { data, error } = useSwr(`${BaseURL}/notification/${tribeId}`, () => getNotifications(tribeId))
  const [notifications, setNotifications] = useState<INotification[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(null)
  const { userId } = useContext(AuthContext) as TAuthContext

  useEffect(() => {
    setIsLoading(true)

    const retrieveData = async () => {
      const res = await getNotifications(props.tribeId)

      if (!res) return

      if (!res) {
        return
      } else if (res.ok && res.parsedBody?.notifications.length) {
        setNotifications(res.parsedBody?.notifications)
        setIsLoading(false)
      } else if (res.ok && !res.parsedBody?.notifications.length) {
        setNotifications([])
        setIsLoading(false)
      }
    }

    retrieveData()
  }, [])

  const unreadNotifications = notifications?.map(notification => {
    const { read_by } = notification
    const userIndex = read_by.findIndex(({ userId: id }) => id === userId)

    if (userIndex === -1) {
      return notification._id
    }

    return
  })

  const newNotificationsAvailable = unreadNotifications?.length ? true : false
  const newNotificationsAmount = unreadNotifications?.length

  const readNotifications = async () => {
    if (notifications === null) return
    const res = await readNotificationsReq(userId, unreadNotifications)

    if (res && res.ok) {
      const tempNotifications = notifications?.map(notification => {
        const { read_by } = notification
        const userIndex = read_by.findIndex(({ userId: id }) => id === userId)

        if (userIndex !== -1) {
          return notification
        }

        notification.read_by.push({
          userId,
          dateRead: Date(),
        })

        return notification
      })

      setNotifications(tempNotifications)
    }
  }

  return (
    <NotificationContext.Provider value={{
      isLoading,
      notifications,
      readNotifications,
      newNotificationsAmount,
      unreadNotificationsId: unreadNotifications,
      newNotifications: newNotificationsAvailable,
    }}>
      {props.children}
    </NotificationContext.Provider>
  )
}
