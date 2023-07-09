"use client"

import { TAvatar } from '@/@types/utils';
import Avatar from '@/components/reusables/Avatar';
import { AuthContext, TAuthContext } from '@/utils/contexts/Auth';
import { BaseUrl, monthNames } from '@/utils/misc/constants';
import React, { useContext } from 'react'
import Image from 'next/image'
import { likeCommentReq, removeComment } from '@/utils/api/comments';
import { useSWRConfig } from 'swr';

interface Props {
  userId: string;
  commentId: string;
  userName: string;
  userAvatar: TAvatar;
  timePosted: string;
  content: string;
  likes: string[];
  postId: string;
}

export default function CommentCard(props: Props) {
  const {
    postId,
    commentId,
    content,
    timePosted,
    userAvatar,
    userId,
    userName,
    likes,
  } = props
  const { userId: currentUserId } = useContext(AuthContext) as TAuthContext;
  const { mutate } = useSWRConfig()
  
  const avatarUrl = userAvatar ? userAvatar.url : undefined;

  const santizedUserName = userName.replace(/\b(\w)/g, (s) => s.toUpperCase());

  const date = new Date(timePosted);

  const postedOn = {
    month: monthNames[date.getMonth()],
    day: date.getDay(),
    year: date.getFullYear(),
  };

  const isUserOp = userId === currentUserId

  const isLiked = likes?.findIndex(id => id === currentUserId)

  const likeComment = async (commentId: string) => {
    const response = await likeCommentReq(commentId)

    if (!response) {
      return
    }

    const { parsedBody } = response

    // if (parsedBody?.ok === true && parsedBody.comment) {
    //   const postIndex = comments.findIndex(commentData => commentData._id === commentId)

    //   let tmpComments = comments
    //   tmpComments[postIndex].likes?.push(currentUserId)

    //   updateComments(tmpComments)
    // }
  }

  const deleteComment = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, isUserOp: boolean, commentId: string) => {
    e.stopPropagation();

    if (!isUserOp) {
      alert('You do not have permission to delete this comment')

      return
    }

    const response = await removeComment(commentId)

    if (!response) return

    const { parsedBody } = response

    if (parsedBody?.ok === true) {

      /* Required for SWR mutate function */
      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
      }
      console.log("made it here")
      mutate([`${BaseUrl}/comment/comments/${postId}`, options])
    }

    return
  }

  return (
    <div className='px-10 mb-8'>

      {/* Comment Header */}
      <div className='flex'>
        <Avatar
          width={64}
          height={64}
          imgSrc={avatarUrl}
          imgAlt="image avatar"
          expandAvatar={false}
          mouseHover={false}
        />
        <div className="ml-5">
          <h4 className="text-lg semi-bold">{santizedUserName}</h4>
          <p className="text-inputTextGrey text-sm">{postedOn.month} {postedOn.day}, {postedOn.year}</p>
        </div>
      </div>

      {/* Comment Conent */}
      <div className="my-6">
        <p>{content}</p>
      </div>

      {/* Like a comment */}
      <div onClick={e => likeComment(commentId)} className='flex flex-row'>
        <div className="flex flex-row">
          <Image src={isLiked ? '/like-grey.svg' : '/like.svg'} alt={'like button'} width={18} height={18} />
          <p className="ml-2 text-inputTextGrey hover:cursor-pointer hover:text-primary font-semibold">{likes?.length ? likes.length : ""} Like{likes?.length ? "s" : ""}</p>
        </div>
        {isUserOp ? (<div className="flex flex-row ml-8" onClick={(e) => deleteComment(e, isUserOp, commentId)}>
            <Image
              className="hover:cursor-pointer hover:text-primary"
              src='/trash.svg'
              alt="share post"
              width={24}
              height={24}
            />
            <p className="ml-2 text-inputTextGrey hover:cursor-pointer hover:text-primary font-semibold">Delete</p>
          </div>) : undefined}

      </div>

    </div>
  )
}
