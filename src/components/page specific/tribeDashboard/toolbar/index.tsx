"use client"

import React, { useContext, useState } from 'react';
import Image from 'next/image'

import InviteToTribe from './invite';
import Notifications from './notification';
import TribeSettings from './settings';

import { AppContext, TAppContext } from '@/utils/contexts/App';
import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import { ITribe, MemberStatus } from '@/@types/tribes';
import Avatar from '@/components/reusables/Avatar';
import Profile from './profile';
import { capitalize } from '@/utils/misc/constants';

export enum ToolbarComponents {
  InviteToTribe,
  Notifications,
  Settings,
  Profile
}

interface Props {
  tribe: ITribe | undefined;
}

/**
 * The best way to manipulate a tribes core data is with the toolbar, users will be able to
 *  1) Invite other user
 *  2) View notifications of the tribe
 *  3) Change the settings
 *  4) Access their profile
 * 
 * @param tribe Tribe data
 *
 */
export default function Toolbar(props: Props) {
  const { tribe } = props
  const [isOpen, setOpen] = useState({
    inviteToTribe: false,
    notifications: false,
    tribeSettings: false,
    profile: false,
  });

  const { currentTribe, user } = useContext(AppContext) as TAppContext
  const { handleModal } = useContext(ModalContext) as TModalContext

  const handleOpen = (activeComponent: ToolbarComponents, e: any) => {
    e.preventDefault()
    if (activeComponent === ToolbarComponents.InviteToTribe) {
      const open = isOpen.inviteToTribe
      setOpen({
        inviteToTribe: !open,
        notifications: false,
        tribeSettings: false,
        profile: false,
      })
    } else if (activeComponent === ToolbarComponents.Notifications) {
      const open = isOpen.notifications
      setOpen({
        inviteToTribe: false,
        notifications: !open,
        tribeSettings: false,
        profile: false,
      })
    } else if (activeComponent === ToolbarComponents.Settings) {
      const open = isOpen.tribeSettings

      handleModal(<TribeSettings
        avatarUrl={tribe?.avatar ? tribe.avatar.url : undefined}
        tribeDescription={tribe?.description as string}
        tribeId={currentTribe?._id as string}
        tribeName={tribe?.name as string}
        owner={owner?._id._id as string}
      />, true, "h-auto")

      setOpen({
        inviteToTribe: false,
        notifications: false,
        tribeSettings: !open,
        profile: false,
      })
    } else if (activeComponent === ToolbarComponents.Profile) {
      const open = isOpen.profile

      handleModal(<Profile user={user} />, true, " ")

      setOpen({
        inviteToTribe: false,
        notifications: false,
        tribeSettings: false,
        profile: !open,
      })
    } 
  }

  const owner = tribe?.members.find((member) => member.status === MemberStatus.Owner)

  return (
    <div className='flex flex-row justify-end py-6'>
      {/* invite a User */}
      <div className='mx-3 flex items-center flex-col justify-center'>
        <Image
          className='hover:cursor-pointer'
          src='/add-user.svg'
          alt='Add a member to the Tibe'
          width={24}
          height={24}
          onClick={(e) => handleOpen(ToolbarComponents.InviteToTribe, e)}
        />
        <div className='relative'>
          {isOpen.inviteToTribe ? <InviteToTribe tribeId={currentTribe?._id as string} /> : null}
        </div>
      </div>

      {/* Notifications */}
      <div className='mx-3 flex items-center flex-col justify-center' id="toolbal-icon-invite">
        <Image
          className='hover:cursor-pointer'
          src='/notification.svg'
          alt='Notifications for this tribe'
          width={24}
          height={24}
          onClick={(e) => handleOpen(ToolbarComponents.Notifications, e)}
        />
        <div className='relative'>
          {isOpen.notifications ? <Notifications tribeId={currentTribe._id} /> : null}
        </div>
      </div>

      {/* Tribe Settings */}
      <div className='ml-3 mr-5 flex items-center' id="toolbal-icon-invite">
        <Image
          className='hover:cursor-pointer'
          src='/settings.svg'
          alt='Change the settings of this tribe'
          width={24}
          height={24}
          onClick={(e: any) => handleOpen(ToolbarComponents.Settings, e)}
        />
      </div>

      {/* Profile */}
      <div className='flex justify-center items-center ml-3 mr-7 hover:cursor-pointer' onClick={(e: any) => handleOpen(ToolbarComponents.Profile, e)}>
        <Avatar
          expandAvatar={false}
          mouseHover={false}
          height={48}
          width={48}
          imgAlt={'User avatar'}
          imgSrc={user.avatar ? user.avatar.url : undefined}
          margin="auto 12px auto 0px"
        />
        <div className='font-semibold text-lg'>
          <p>{capitalize(user.name)}</p>
        </div>
      </div>
    </div>
  );
};
