import { TAvatar } from '@/@types/utils';
import TribeLink from './tribes/tribeLink';
import TribeInvite from './invites/tribeInvite';

interface Props {
  inviteId?: string;
  tribeId: string;
  avatar: TAvatar | undefined;
  name: string;
}

/**
 * Indiviual tray item, act as a link to boths tribes and invites
 * 
 * @param inviteId id of an invite to a tribe in the DB, if one is present the invite component will always be returned
 * @param tribeId id of a tribe
 * @param avatar avatar of a tribe
 * @param name name of a tribe
 *
 */
export default function TrayItem(props: Props) {
  const { tribeId, avatar, name, inviteId } = props

  return (
    <div className='py-2 hover:cursor-pointer'>
      { inviteId ? <TribeInvite avatar={avatar} inviteId={inviteId} name={name} tribeId={tribeId} /> : <TribeLink name={name} avatar={avatar}  tribeId={tribeId} /> }
    </div>

  )
}


