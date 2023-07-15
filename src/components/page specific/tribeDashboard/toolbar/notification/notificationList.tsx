import { INotification } from '@/@types/notifications';
import Avatar from '@/components/reusables/Avatar';
import { monthNames } from '@/utils/misc/constants';
import React from 'react'

interface Props {
  notifications: INotification[] | null;
  userId: string;
  read?: boolean;
}

export default function NotificationList(props: Props) {
  const list = props.notifications?.map((data, index) => {
    const { read_by } = data
    const userIndex = read_by.findIndex(({ userId: id }) => id === props.userId)
    const date = new Date(data.createdOn)
    const postedOn = {
      month: monthNames[date.getMonth()],
      day: date.getDay(),
      year: date.getFullYear(),
    }

    return (
      <div key={data._id} className='bg-inputBgGrey py-5 px-5 rounded-xl shadow-md mb-5'>
        <div className='flex flex-row'>
          <Avatar
            expandAvatar={false}
            imgSrc={data.sender.avatar ? data.sender.avatar.url : undefined}
            imgAlt={`${data.sender.name}'s avatar`}
            height={48}
            width={48}
            mouseHover={false}
          />
          <p className='text-sm pl-3'>{data.message}</p>
        </div>
        <div className='w-full flex'>
          <p className='ml-auto text-xs'>{postedOn.month} {postedOn.day}, {postedOn.year}</p>
        </div>
      </div>
    )
  })

  return (
    <div>{list}</div>
  )
}
