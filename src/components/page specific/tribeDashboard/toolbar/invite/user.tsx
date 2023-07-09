"use client"

import React, { useContext } from 'react';
import Image from 'next/image';

import { AuthContext, TAuthContext } from '@/utils/contexts/Auth';
import { sendInviteReq } from '@/utils/api/tribes';
import { TAvatar } from '@/@types/utils';
import Avatar from '@/components/reusables/Avatar';
import { capitalize } from '@/utils/misc/constants';

interface Props {
  email: string;
  emptyUser?: boolean;
  avatar?: TAvatar;
  name?: string;
  tribeId: string;
  userId?: string;
}

/**
 * User card that is used to return a user found in the db when performing an autocomplete search
 * 
 * @param email user email
 * @param emptyUser if there is not a profile this will be true, we use this to determine whether or not to show send by email or directly within the app
 * @param avatar a users avatar
 * @param name a users name
 * @param userId userId of the user to recieve an invite
 * 
 */
export default function User(props: Props) {
  const { avatar, email, userId, emptyUser, name, tribeId } = props
  const { userId: currentUserId } = useContext(AuthContext) as TAuthContext

  const sendInvite = async (email: string, userId?: any) => {
    /* If there is a userId, send an invite in app that will notify the users device as well */
    if (userId) {
      const requestBody = {
        toUserId: userId,
        fromUserId: currentUserId,
        tribeId: tribeId
      }

      const response = await sendInviteReq(requestBody)

      if (!response) return

      const { parsedBody: data, status } = response

      if (status === 200) {
        alert(data?.message)
      }

      return
    }

    // Otherwise Send by email

    // const requestBody = {
    //   email,
    //   userId
    // }

    // const response = await axios.post(`${BaseURL}/invite/email`, requestBody);
  }

  const sendImage = emptyUser ? <Image
    className='ml-auto mr-3 relative cursor-pointer'
    src='/email-icon.svg'
    alt='send email invite'
    width={17}
    height={17}
    onClick={() => sendInvite(email)}
  /> : <Image
    className='ml-auto mr-3 relative cursor-pointer'
    src='/send-icon.svg'
    alt='send invite'
    width={18}
    height={18}
    onClick={() => sendInvite(email, userId)}
  />

  const nameLabel = emptyUser ? email : name

  return (
    <div className='flex w-full h-[50px] items-center'>
      <div>
        <Avatar
          expandAvatar={false}
          mouseHover={true}
          imgSrc={emptyUser ? '/default-avatar.png' : avatar ? avatar.url : '/default-avatar.png'}
          imgAlt='avatar'
          width={30}
          height={30}
        />
      </div>

      <div className='text-sm ml-2 relative items-center break-all break-words'>
        <p>{capitalize(nameLabel as string)}</p>
      </div>
      {sendImage}
    </div>
  );
};
