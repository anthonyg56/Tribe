"use client"

import { createContext, useContext } from "react"
import useSwr, { KeyedMutator } from 'swr'

import { INotification } from "@/@types/notifications"

import { AuthContext, TAuthContext } from "./Auth"
import { readNotificationsReq } from "../api/tribes"
import { BaseUrl } from "../misc/constants"
import { CustomHttpRequest, HttpResponse } from "../functions/HTTP"

// export type TNotificationContext = {
//   isLoading: boolean;
//   notifications: INotification[] | null;
//   readNotifications: () => Promise<void>;
//   newNotificationsAmount: number | undefined;
//   unreadNotificationsId: (string | undefined)[] | undefined;
//   newNotifications: boolean;
// }

// export const NotificationContext = createContext<Partial<TNotificationContext>>({})

/* All the tools and utilities we need for handling the notifications within a tribe */
// export default function NotificationProvider(props: Props) {
  // const { data, error } = useSwr(`${BaseURL}/notification/${tribeId}`, () => getNotifications(tribeId))
//   const [notifications, setReadNotifications] = useState<INotification[] | null>(null)
//   const [unreadNotifications, setUnreadNotifications] = useState<INotification[] | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isError, setIsError] = useState(null)
//   const { userId } = useContext(AuthContext) as TAuthContext

//   useEffect(() => {
//     setIsLoading(true)

//     const retrieveData = async () => {
//       const res = await getNotifications(props.tribeId)

//       if (!res) {
//         return
//       } else if (res.ok && res.parsedBody?.notifications.length) {
//         /*Seperate the unread and read notification */
//         const unreadNotifications = res.parsedBody.notifications.map(notification => {
//           const { read_by } = notification
//           const userIndex = read_by.findIndex(({ userId: id }) => id === userId)
      
//           if (userIndex === -1) {
//             return notification
//           }
      
//           return
//         })

//         const readNotifications = res.parsedBody.notifications.map(notification => {
//           const { read_by } = notification
//           const userIndex = read_by.findIndex(({ userId: id }) => id === userId)
      
//           if (userIndex === 1) {
//             return notification
//           }
      
//           return
//         })

//         setUnreadNotifications(unreadNotifications as INotification[])
//         setReadNotifications(readNotifications as INotification[])
//         setIsLoading(false)
//       } else if (res.ok && !res.parsedBody?.notifications.length) {
//         setReadNotifications([])
//         setUnreadNotifications([])
//         setIsLoading(false)
//       }
//     }

//     retrieveData()
//   }, [])

//   const newNotificationsAvailable = unreadNotifications?.length ? true : false

//   const newNotificationsAmount = unreadNotifications?.length

//   const readNotifications = async () => {
//     console.log(unreadNotifications)
//     if (notifications === null) return

//     const notificationIds = unreadNotifications?.map(notification => notification._id)

//     const res = await readNotificationsReq(userId, notificationIds)

//     if (res && res.ok) {
//       const tempNotifications = notifications?.map(notification => {
//         const { read_by } = notification
//         const userIndex = read_by.findIndex(({ userId: id }) => id === userId)

//         if (userIndex !== -1) {
//           return notification
//         }

//         notification.read_by.push({
//           userId,
//           dateRead: Date(),
//         })

//         return notification
//       })

//       setReadNotifications(tempNotifications)
//     }
//   }

//   return (
//     <NotificationContext.Provider value={{
//       isLoading,
//       notifications,
//       readNotifications,
//       newNotificationsAmount,
//       unreadNotificationsId: unreadNotifications,
//       newNotifications: newNotificationsAvailable,
//     }}>
//       {props.children}
//     </NotificationContext.Provider>
//   )
// }

/* Fetch Options */
const requestOptions: RequestInit = {
  mode: "cors",
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
}

/* Response type for swr */
interface ResponseBody {
  ok: boolean;                                        // Variable that informs if the request did what it was supposed to
  message: string;                                    // Message that states what the request does
  notifications: INotification[];                     // An array of all the notifications of a tribe
}

export type TNotificationContext = {
  refresh: KeyedMutator<HttpResponse<ResponseBody>>   // SWR Mutator to revalidate the data
  newNotificationsAmount: number,                     // Number of notifications available
  readNotifications: INotification[],                 // An array of unread notifications
  unreadNotifications: INotification[],               // An array of unread notifications
  readUnreadNotifications: () => Promise<void>,       // A function to read all the unread notifications
}

export const NotificationContext = createContext<Partial<TNotificationContext>>({})

interface Props {
  tribeId: string;
  children: React.ReactNode;
}

/**
 * Provider for the notifications of a Tribe
 * 
 * @param tribeId     Id of the tribe to fetch notifications for
 * @param children    Page
 *
 */
const NotificationProvider = (props: Props) => {
  const { data, error, mutate } = useSwr([`${BaseUrl}/notification/${props.tribeId}`, requestOptions], ([url, options]) => CustomHttpRequest<ResponseBody>(url, options))
  const { userId } = useContext(AuthContext) as TAuthContext

  if (error) {
    return (
      <div>There was an error</div>
    )
  }

  if (!data) {
    return (
      <div>loading...</div>
    )
  }

  const { notifications } = data.parsedBody as ResponseBody

  const newNotificationsAmount = notifications.length

  /** Seperate the read and unread notifications, as well as sort them from newest to oldest */
  const sortNotification = () => {
    const unreadNotifications: INotification[] = []
    const readNotifications: INotification[] = []

    notifications.forEach(notification => {
      /* Grab all the users ids that read the notification and check to see if the current userId matches any */
      const { read_by } = notification
      const userIndex = read_by.findIndex(({ userId: id }) => id === userId)

      /* if the userId doesnt match, push the notification to read else puse to unread */
      userIndex === 1 ? readNotifications.push(notification) : unreadNotifications.push(notification)
    })

    /* Reverse the array so the data is sorted by newest first to oldest */
    unreadNotifications.length > 1 ? unreadNotifications.reverse() : null
    readNotifications.length > 1 ? readNotifications.reverse() : null

    return {
      unreadNotifications,
      readNotifications,
    }
  }

  /** extract the objects so we can pass it to the provider */
  const { readNotifications, unreadNotifications } = sortNotification()

  /** A function to read all the notifications of a tribe */
  const readUnreadNotifications = async () => {
    if (!unreadNotifications.length) return

    const notificationIds = unreadNotifications.map(notification => notification._id)

    const res = await readNotificationsReq(userId, notificationIds)

    if (res && res.ok) {
      mutate()
    }
  }

  
  return (
    <NotificationContext.Provider value={{
      refresh: mutate,
      readNotifications,
      unreadNotifications,
      newNotificationsAmount,
      readUnreadNotifications,
    }}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider