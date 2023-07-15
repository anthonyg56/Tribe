import CreateATribeBtn from './createATribe/createATribeBtn';
import TribesMap from './tribes/tribesMap';
import InviteMap from './invites/inviteMap';

/**
 * Component that will basically act as the nav menu between different tribes,
 * houses all tribes and invites
 * 
 */
export default function Tray() {
  return (
    <>
      <div className='h-screen overflow-y-auto overflow-x-hidden w-[75px] max-w-=[75px] bg-tribeGrey'>
        <div className='my-5 text-center'>
          <h2 className='text-primary text-2xl font-semibold'>Tribe</h2>
        </div>
        <InviteMap />
        <TribesMap />
        <CreateATribeBtn />
      </div>
    </>
  )
}
