"use client"
import { useContext } from "react";
import { useRouter } from 'next/navigation';

import { TAvatar } from "@/@types/utils";

import { ModalContext, TModalContext } from "@/utils/contexts/Modal";
import { acceptInviteReq, rejectInviteReq } from "@/utils/api/tribes";
import { BaseUrl } from "@/utils/misc/constants";
import { mutate } from "swr";
import { AppContext, TAppContext } from "@/utils/contexts/App";

interface Props {
  inviteId: string;
  tribeId: string;
  tribeName: string;
  tribeAvatar: TAvatar;
}

/**
 * Indiviual invite item, users can either accept or reject an invite through this
 * 
 * @param inviteId id of an invite to a tribe in the DB
 * @param tribeId id of a tribe
 * @param tribeAvatar avatar of a tribe
 * @param tribeName name of a tribe
 *
 */
const Invite = (props: Props) => {
  const { handleModal } = useContext(ModalContext) as TModalContext
  const { user } = useContext(AppContext) as TAppContext

  const router = useRouter()

  const rejectInvite = async (e: any) => {
    e.preventDefault()

    const response = await rejectInviteReq(props.inviteId)

    if (response){
      const { ok, message, userId } = response.parsedBody as {
        ok: boolean;
        message: string;
        userId: string | null;
      }

      if(!ok){
        alert(message)
      }
      
      const options: RequestInit = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }

      handleModal(null, false)
      mutate(`${BaseUrl}/user/${userId}`, options)
    }
  }

  const acceptInvite = async (e: any) => {
    e.preventDefault()

    const response = await acceptInviteReq(props.inviteId)

    if (response ) {
      const { ok, message, userId } = response.parsedBody as {
        ok: boolean;
        message: string;
        userId: string | null;
      }

      if(!ok || !userId){
        alert(message)
      }
      
      const options: RequestInit = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }

      handleModal(null, false)
      mutate(`${BaseUrl}/user/${userId}`, options)
      router.push(`/${userId}/${props.tribeId}`)
    }
  }

  const previewTribe = () => {

  }

  return (
    <div>
      <div>

      </div>
      <div>
        {/* <img src={tribeAvatar.url} alt='Tribe avatar'  />*/}
        <p>Click on the avatar to preview the tribe</p>
        <h4>{props.tribeName} has invited you to join their tribe</h4>
        <div>
          <button onClick={e => acceptInvite(e)}>Accept</button>
          <button onClick={e => rejectInvite(e)}>Reject</button>
        </div>
      </div>
    </div>
  )
}

export default Invite