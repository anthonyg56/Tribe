"use client"
import { createContext } from 'react';
import useSwr from 'swr'

import { TribeMeta } from '@/@types/tribes';
import { IInvite, IUser } from '@/@types/user';

import { BaseUrl } from '../misc/constants';
import { CustomHttpRequest } from '../functions/HTTP';

export type TAppContext = {
  user: IUser;
  currentTribe: TribeMeta;
  invites: IInvite[] | null;
  tribes: TribeMeta[] | null;
}

interface ResponseBody {
  message: string;
  user: IUser;
}

interface Props {
  userId: string;
  children: React.ReactNode;
}

export const AppContext = createContext<Partial<TAppContext>>({})

const options: RequestInit = {
  method: 'GET',
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
}

/**
 * Wrapper component for the Provider of App Context, wrapper is there to fetch the users data and include it in the provider values,
 * it lives in the tribe page layout and provides the users data to every child component that uses AppContext
 * 
 * @param userId userId grabed from the router
 * @param children child components in
 * @returns 
 */
export default function AppProvider(props: Props) {
  const { children, userId } = props
  const { data, error } = useSwr([`${BaseUrl}/user/${userId}`, options], ([url, options]) => CustomHttpRequest<ResponseBody>(url, options))

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

  const { user } = data.parsedBody as ResponseBody

  return (
    <AppContext.Provider value={{
      user: user,
      currentTribe: user.tribes[0],
      tribes: user.tribes,
      invites: user.invites,
    }}>
      {children}
    </AppContext.Provider>
  )
}
