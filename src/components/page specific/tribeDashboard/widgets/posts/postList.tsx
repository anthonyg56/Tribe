"use client"
import useSwr from 'swr'
import PostCard from './postCard';

import { CustomHttpRequest } from '@/utils/functions/HTTP';
import { BaseUrl } from '@/utils/misc/constants';

import { IPostResponse } from '@/@types/posts';

interface Props {
  tribeId: string;
};

const options: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
}

interface ResponseBody {
  error: any;
  message: string;
  posts: IPostResponse[];
}

export default function PostList(props: Props) {
  const { data, error } = useSwr([`${BaseUrl}/post/posts/${props.tribeId}`, options], ([url, options]) => CustomHttpRequest<ResponseBody>(url, options), { revalidateOnMount: true, })

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

  const { posts } = data.parsedBody as ResponseBody

  const postList = posts?.map(post => (
      <PostCard
        tribeId={props.tribeId}
        expand={true} 
        post={post}
        key={post._id}
      />
    )
  )

  const noPosts = (
    <div>
      <p>There appears to be nothing here</p>
    </div>
  );

  return (
    <div id="posts">
      { posts?.length ? postList : noPosts }
    </div>
  );
}
