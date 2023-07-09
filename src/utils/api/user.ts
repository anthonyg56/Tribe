import { CustomHttpRequest } from "../functions/HTTP";
import { BaseUrl } from "../misc/constants";

/* Put Requests */
export const updateEmail = async (
  newEmail: string,
  password: string,
  _userId: string
) => {

  try {
    const url = `${BaseUrl}/user/${_userId}/username`
    const requestOptions: RequestInit = {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newEmail, password: password })
    }

    return await CustomHttpRequest<{ message: string; ok: boolean }>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const updatePassword = async (
  oldPw: string,
  newPw: string,
  _userId: string
) => {

  try {
    const url = `${BaseUrl}/user/${_userId}/password`
    const requestOptions: RequestInit = {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ oldPassword: oldPw, newPassword: newPw })
    }

    return await CustomHttpRequest<{ message: string; ok: boolean }>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const updateUsername = async (
  name: string,
  password: string,
  _userId: string
) => {

  try {
    const url = `${BaseUrl}/user/${_userId}/name`
    const requestOptions: RequestInit = {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, password })
    }

    return await CustomHttpRequest<{ message: string; ok: boolean }>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const updateAvatar = async (id: string, formData: FormData) => {
  try {
    const url = `${BaseUrl}/user/${id}/avatar`
    const requestOptions: RequestInit = {
      method: "PUT",
      credentials: "include",
      body: formData,
    }

    return await CustomHttpRequest<{
      message: string;
      avatar?: {
        cloudinary_id: string;
        url: string;
      };
      error?: string;
    }>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}