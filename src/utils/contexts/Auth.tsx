"use client"

import React, { createContext, useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation'

import { logout } from "../api/authentication";
import { CustomHttpRequest } from "../functions/HTTP";
import { BaseUrl } from "../misc/constants";

export type TAuthContext = {
  homeTribe: string;
  userId: string;
  login: (id: string, homeTribe: string) => void;
  logout: () => void;
  validate: () => Promise<void>
}

export const AuthContext = createContext<Partial<TAuthContext>>({})

/**
 * Wrapper component for the Provider of Auth Context, wrapper is there to provide different methods/functiosn throughout the app to manipulate the authenticaton values,
 * it lives in the root page layout and provides the users data to every child component that uses AuthContext
 * 
 * @param children child components in the page layout
 * 
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{
    user_id: string;
    homeTribe: string;
    authenticated: boolean
  }>({
    user_id: '',
    homeTribe: '',
    authenticated: false
  })

  const router = useRouter()
  const pathName = usePathname()

  useEffect(() => {
    validate()
  }, [state])
  
  const login = (id: string, homeTribe: string) => {
    setState({
      user_id: id,
      homeTribe: homeTribe,
      authenticated: true,
    })
  }

  const logoutHook = async () => {
    const res = await logout()

    if(res.status === 200)
      setState({
        user_id: '',
        homeTribe: '',
        authenticated: false,
      })
  }

  const validate = async () => {
    const url = `${BaseUrl}/auth/validate`
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    }

    try {
      const response = await fetch(url, requestOptions)
      if (!response) return
  
      const data = await response.json()

      if (data.id && state.authenticated === false) {
        router.push(`/${data.id}/${data.homeTribe}`)
        login(data.id as string, data.homeTribe as string)
      } else if (!data.id) {
        router.push('/')
      }
    } catch (err) {
      console.log(err)
      if (pathName !== "/") {
        router.push("/")
      }
    }
  }
  
  return (
    <AuthContext.Provider value={{ 
      userId: state.user_id,
      homeTribe: state.homeTribe,
      login: login,
      logout: logoutHook,
      validate: validate
    }}>
      {children}
    </AuthContext.Provider>
  )
}