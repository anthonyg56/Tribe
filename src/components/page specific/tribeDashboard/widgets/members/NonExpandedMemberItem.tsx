"use client"

import { MemberStatus } from '@/@types/tribes';
import { TAvatar } from '@/@types/utils';
import ImagePreview from '@/components/reusables/ImagePreview';
import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import React, { useContext } from 'react'
import Image from 'next/image'
import Avatar from '@/components/reusables/Avatar';

interface Props {
  name: string;
  avatar?: TAvatar;
  status: MemberStatus;
}

export default function NonExpandedMemberItem(props: Props) {
  const { name, avatar, status } = props
  const { handleModal } = useContext(ModalContext) as TModalContext;

  const imgSrc = avatar ? avatar.url : '/default-avatar.png';

  const sanitizedName = name.replace(/\b(\w)/g, (s) => s.toUpperCase())

  const previewAvatar = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();

    handleModal(<ImagePreview src={imgSrc} alt='Avatar' />, true, "h-full w-full");
  }

  let statusStr;

  switch (status) {
    case 1:
      statusStr = "Admin";
      break;
    case 0:
      statusStr = "Owner";
      break;
    default:
      break;
  }

  return (
    <div className='flex flex-row items-center my-6'>
      <Avatar
        imgSrc={imgSrc}
        imgAlt="avatar"
        onClickFunc={(e: any) => previewAvatar(e)}
        width={64}
        height={64}
      />
      
      <h4 className='ml-3'>{sanitizedName}</h4>

      <p className='ml-auto'>{statusStr}</p>
    </div>
  );
}
