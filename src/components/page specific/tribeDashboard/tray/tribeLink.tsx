"use client"
import { TAvatar } from "@/@types/utils"
import Avatar from "@/components/reusables/Avatar"
import Tooltip from "@/components/reusables/tooltip";
import { AppContext, TAppContext } from "@/utils/contexts/App";
import { capitalize } from "@/utils/misc/constants";
import { useRouter } from "next/navigation"
import { useContext } from "react";
import TrayNotification from "./notification";

interface Props {
  avatar: TAvatar | undefined;
  tribeId: string;
  name: string;
}

/**
 * IF there is is no inviteId, a TribeLink component is returned. onClick takes a user to their tribe homepage
 * 
 * @param tribeId id of a tribe, needed for the slug
 * @param avatar avatar of a tribe, acts as the link
 *
 */
const TribeLink = (props: Props) => {
  const router = useRouter()
  const { user: { _id: userId } } = useContext(AppContext) as TAppContext
  return (
    <div className="flex justify-center items-center relative hover:text-primary" onClick={() => router.push(`/${userId}/${props.tribeId}`)}>
      <Tooltip string={capitalize(props.name)} >
        <div className="mr-auto ml-2">
          <Avatar
            expandAvatar={false}
            height={54}
            width={54}
            imgSrc={props.avatar ? props.avatar.url : undefined}
            imgAlt={'tribe avatar'}
            mouseHover={true}
          />
        </div>
      </Tooltip>


      {/* <div className="mr-auto text-white hover:text-primary">
        <p className="m-0">{capitalize(props.name)}</p>
      </div> */}
      <TrayNotification tribeId={props.tribeId} />
    </div>
  )
}

export default TribeLink