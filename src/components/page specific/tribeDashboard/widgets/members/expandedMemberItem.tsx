"use client"

import { MemberStatus } from '@/@types/tribes';
import { TAvatar } from '@/@types/utils';
import Avatar from '@/components/reusables/Avatar';
import { monthNames } from '@/utils/misc/constants';
import React from 'react'

interface Props {
  user: {
    avatar?: TAvatar;
    name: string;
    id: string;
  };
  role?: string;
  status: MemberStatus;
  memberSince: string;
}

export default function ExpandedMemberItem(props: Props) {
  const { memberSince, role, user, status } = props
  const date = new Date(memberSince);
  const utc = {
    month: monthNames[date.getMonth()],
    day: date.getDay(),
    year: date.getFullYear(),
  };

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
    <div>
      <div>
        <div>
          <Avatar
            imgSrc={user.avatar?.url}
            imgAlt={'user avatar'}
            width={45}
            height={45}
            expandAvatar={false}
            mouseHover={false}
          />
          <p id="users-name">{user.name}</p>
        </div>
        <div>
          <p>{role ? role : statusStr}</p>
        </div>
        <div>
          <p>{utc.month} {utc.day}, {utc.year}</p>
        </div>
      </div>
    </div>
  )
}
