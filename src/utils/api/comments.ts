import { IComment } from "@/@types/posts";
import { CustomHttpRequest } from "../functions/HTTP";
import { BaseUrl } from "../misc/constants";

/* POST REQ */
export const uploadCommentReq = async (postId: string, comment: string) =>{
  interface IResponseBody {
    message: string;
    ok: boolean;
    newComment: IComment
  }
  
  try {
    const url = `${BaseUrl}/comment/`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        postId,
        content: comment
      })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (Err) {
    console.log(Err)
  }
}

/* PUT REQ */
export const likeCommentReq = async (commentId: string) =>{
  interface IResponseBody {
    message: string;
    ok: Boolean;
    comment: IComment
  }
  
  try {
    const url = `${BaseUrl}/comment/${commentId}/like`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (Err) {
    console.log(Err)
  }
}

export const removeComment = async (commentId: string) =>{
  interface IResponseBody {
    message: string;
    ok: Boolean;
  }
  
  try {
    const url = `${BaseUrl}/comment/${commentId}`
    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (Err) {
    console.log(Err)
  }
}