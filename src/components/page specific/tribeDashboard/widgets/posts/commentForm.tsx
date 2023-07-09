"use client"

import Avatar from '@/components/reusables/Avatar';
import { uploadCommentReq } from '@/utils/api/comments';
import { AppContext, TAppContext } from '@/utils/contexts/App';
import { BaseUrl } from '@/utils/misc/constants';
import { Input } from '@material-tailwind/react';
import React, { useContext, useState } from 'react'
import { useSWRConfig } from 'swr';

interface Props {
  postId: string;
};

export default function commentForm(props: Props) {
  const [comment, setComment] = useState('');

  const { postId } = props
  const { user } = useContext(AppContext) as TAppContext
  const { mutate } = useSWRConfig()
  const disableBtn = comment === '' ? true : false;

  console.log(disableBtn)
  const handleChange = (e: any) => {
    e.preventDefault();

    setComment(e.currentTarget.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log("made it here")
    if (comment === '') return

    const response = await uploadCommentReq(postId, comment)

    if (!response) return

    const { parsedBody } = response

    if (parsedBody?.ok === false) {
      alert(parsedBody.message)
      return
    }

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    }

    mutate([`${BaseUrl}/comment/comments/${postId}`, options])

    setComment('');
  }

  return (
    <form onSubmit={e => handleSubmit(e)} className='flex flex-row pt-5'>
      <Avatar
        imgSrc={user?.avatar?.url}
        imgAlt={'user avatar'}
        expandAvatar={false}
        width={64}
        height={64}
        mouseHover={false}
      />

      <div className='pl-8 w-full pr-8 pt-3'>
        <Input
          className='border-b-2 border-b-black'
          variant='standard'
          placeholder='Comment on this post'
          type="text"
          name="comment"
          value={comment}
          id="commment-input"
          onChange={e => handleChange(e)}
        />  
      </div>



      <div className='flex'>
        <button className='rounded-[50px] my-auto px-8 py-2 text-white bg-primary font-semibold' disabled={disableBtn} type="submit">Share</button>
      </div>
    </form>
  );
}
