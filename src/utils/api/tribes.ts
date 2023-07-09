import { INotification } from "@/@types/notifications";
import { BaseUrl } from "../misc/constants";
import { CustomHttpRequest } from "../functions/HTTP";
import { TribeMeta } from "@/@types/tribes";
import { SearchResults } from "@/components/page specific/tribeDashboard/toolbar/invite";

/* GET REQ */
export const getNotifications = async (tribeId: string) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
    notifications: INotification[];
  }

  try {
    const url = `${BaseUrl}/notification/${tribeId}`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const AutocompleteReq = async (searchTerm: string) => {
  interface IResponseBody { users: SearchResults }

  try {
    const url = `${BaseUrl}/user/autocomplete/?query=${searchTerm}`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

/* POST REQ */
export const sendInviteReq = async (body: {
  toUserId: any;
  fromUserId: string;
  tribeId: string;
}) => {
  interface IResponseBody { 
    message: string;
    ok: boolean;
  }

  try {
    const url = `${BaseUrl}/invite/invite`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const createTribe = async (formData: FormData) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
    newTribe: TribeMeta;
  }

  try {
    const url = `${BaseUrl}/tribe/new`
    const requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      body: formData
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

/* PUT REQ */
export const readNotificationsReq = async (userId: string, unreadNotifications: (string | undefined)[] | undefined) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
  }
  try {
    const url = `${BaseUrl}/notification/read`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ notificationId: unreadNotifications, userId })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const rejectInviteReq = async (inviteId: string) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
  }

  try {
    const url = `${BaseUrl}/invite/reject`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ inviteId })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const acceptInviteReq = async (inviteId: string) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
  }

  try {
    const url = `${BaseUrl}/invite/accept`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ inviteId })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}



export const updateTribe = async (tribeId: string, formData: FormData) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
  }

  try {
    const url = `${BaseUrl}/tribe/updateSettings/${tribeId}`
    const requestOptions: RequestInit = {
      method: "PUT",
      credentials: "include",
      body: formData
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const AgreeToRulesReq = async (tribeId: string) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
  }

  try {
    const url = `${BaseUrl}/tribe/agree`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ tribeId })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

export const submitRulesReq = async (tribeId: string, rules: { text: string; }[]) => {
  interface IResponseBody {
    rules?: [{
      text: string;
    }];
    message: string;
    ok: boolean;
  }

  try {
    const url = `${BaseUrl}/tribe/rules`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ tribeId, rules })
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}

/* DELETE REQ */
export const deleteTribeReq = async (tribeId: string) => {
  interface IResponseBody {
    ok: boolean;
    message: string;
  }

  try {
    const url = `${BaseUrl}/tribe/${tribeId}`
    const requestOptions: RequestInit = {
      mode: "cors",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    }

    return await CustomHttpRequest<IResponseBody>(url, requestOptions)
  } catch (err) {
    console.log(err)
  }
}