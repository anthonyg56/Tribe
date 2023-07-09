import { TAvatar } from "@/@types/utils"
import Avatar from "@/components/reusables/Avatar"
import { ModalContext, TModalContext } from "@/utils/contexts/Modal"
import { useContext } from "react"
import Invite from "./invite"

interface Props {
  inviteId: string;
  avatar: TAvatar| undefined;
  tribeId: string;
  name: string
};

/**
 * IF there is an inviteId, a TribeInvite component is returned. onClick opens a modal where a user can accept, reject, or preview a tribe
 * 
 * @param inviteId id of the invite in the DB
 * @param tribeId id of a tribe for the slug
 * @param avatar avatar of a tribe, acts as the link
 * @param name name of a tribe
 *
 */
const TribeInvite = (props: Props) => {
  const { handleModal } = useContext(ModalContext) as TModalContext

  const expand = (e: any) => {
    e.preventDefault()
    handleModal(<Invite inviteId={props.inviteId as string} tribeAvatar={props.avatar ? props.avatar : {url: '/default-avatar.png', publicId: ''}} tribeId={props.tribeId} tribeName={props.name}/>, true)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Avatar
        expandAvatar={false}
        height={54}
        width={54}
        imgSrc={props.avatar ? props.avatar.url : undefined}
        imgAlt={'tribe avatar'}
        onClickFunc={(e: any) => expand(e)}
        mouseHover={true}
      />
      {/* <NotificationDot /> */}
    </div>
  )
}

/**
 * If a notification is present, this dot is present to alert a user
 *
 */
const NotificationDot = () => (
  <div style={{
    position: 'absolute',
    right: '0',
    backgroundColor: 'red',
    padding: '2px 7px',
    borderRadius: '20px',
    top: '0',
  }}>
    <div style={{
      fontFamily: 'IBM Plex Sans',
      fontSize: '11px',
    }}>
      !
    </div>
  </div>
)

export default TribeInvite