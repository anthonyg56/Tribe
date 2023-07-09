"use client"

import useSwr from 'swr'
import { IComment } from '@/@types/posts';
import CommentCard from './commentCard';
import { CustomHttpRequest } from '@/utils/functions/HTTP';
import { BaseUrl } from '@/utils/misc/constants';

interface Props {
  postId: string
}

interface ResponseBody {
  error: any;
  message: string;
  comments: IComment[];
}

const options: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include"
}

export default function CommentList(props: Props) {
  const { postId } = props
  const { data, error } = useSwr([`${BaseUrl}/comment/comments/${postId}`, options], ([url, options]) => CustomHttpRequest<ResponseBody>(url, options))

  if (error) {
    return (
      <div>There was an error</div>
    )
  }

  if (!data) {
    return (
      <div>loading...</div>
    )
  }

  const { comments } = data.parsedBody as ResponseBody
  
  const createList = (comments: IComment[]) => {
    const map = comments.map((data, index) => <CommentCard
      key={data._id}
      postId={postId}
      likes={data.likes}
      commentId={data._id}
      content={data.content}
      timePosted={data.createdOn}
      userAvatar={data._userId.avatar}
      userId={data._userId._id}
      userName={data._userId.name}
    />)

    return map
  }

  /* TODO: Create comment component & Map out comments data */
  const commentsList = comments?.length ? createList(comments) : (<h4 className='mb-8'>No comments available</h4>)

  return (
    <div>
      {commentsList}
    </div>
  );
}
