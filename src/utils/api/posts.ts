import { IPost } from "@/@types/posts";
import { BaseUrl } from "../misc/constants";
import { CustomHttpRequest } from "../functions/HTTP";

/* POST REQ */
export const createPost = async (data: FormData) => {
  interface IResponseBody {
    message?: string;
    error?: string;
    post: IPost;
  }
  
  try {
    const url = `${BaseUrl}/post/post`
    const requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      body: data
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (Err) {

  }
}

export const updateLike = async (postId: string, userId: string) =>{
  interface IResponseBody {
    message: string;
    error: any;
    post: IPost;
    ok: boolean;
  }
  
  try {
    const url = `${BaseUrl}/post/${postId}/like`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        postId,
        userId,
      })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (Err) {

  }
}

/* DELETE REQ */
export const removePost = async (postId: string, userId: string) =>{
  interface IResponseBody {
    message: string;
    error: any;
    post: IPost;
    ok: boolean;
  }
  
  try {
    const url = `${BaseUrl}/post/${postId}`
    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        postId,
        userId,
      })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (Err) {

  }
}

