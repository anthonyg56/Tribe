import { BaseUrl } from "../misc/constants"
import { CustomHttpRequest } from "../functions/HTTP"

type  SetError = React.Dispatch<React.SetStateAction<{
  message: string;
  color: string;
}>>

/* Post Requests */
export const register = async (name: string, email: string, password: string) =>{
  interface IResponseBody {
    id: string;
    message: string;
    ok: boolean;
  }
  try {
    const url = `${BaseUrl}/auth/signup`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password
      })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (Err) {

  }
}

export const signin = async (email: string, password: string, setError: SetError) => {
  interface IResponseBody {
    message?: string;
    ok: boolean;
    error?: string;
    id: string;
  }

  try {
    const url = `${BaseUrl}/auth/login`
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password
      })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)

  } catch (err) {
    console.log(err)
    setError({
      message: "There was an error, please try again",
      color: "red"
    })
    return
  }
}
  
export const logout = async () => 
  await fetch(`${BaseUrl}/auth/logout`, {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  })

/* Get Requests */
export const validateToken = async () => {
  interface IResponseBody {
    id: string,
    homeTribe: string;
  }

  try {
    const url = `${BaseUrl}/auth/validate`
    const requestOptions: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    }
    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
    return
  }
}