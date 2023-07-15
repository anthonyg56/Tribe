"use client"

import { IPostResponse } from "@/@types/posts";
import { AuthContext, TAuthContext } from "@/utils/contexts/Auth";
import Image from 'next/image'
import { BaseUrl, monthNames } from "@/utils/misc/constants";
import { useContext, useState } from "react";
import { removePost, updateLike } from "@/utils/api/posts";
import ExpandedPost from "./expandedPost";
import { ModalContext, TModalContext } from "@/utils/contexts/Modal";
import { useSWRConfig } from "swr";
import Avatar from "@/components/reusables/Avatar";

interface Props {
  expand: boolean;
  tribeId: string;
  post: IPostResponse;
}

const PostCard = (props: Props) => {
  const { post, expand, tribeId, } = props
  const [state, setState] = useState(post)
  const { userId: currentUserId } = useContext(AuthContext) as TAuthContext;
  const { handleModal, modal } = useContext(ModalContext) as TModalContext
  const { mutate } = useSWRConfig()

  const date = new Date(post.createdOn);

  const isUserOp = post._userId._id === currentUserId

  const isLiked = post.likes?.findIndex(
    (data) => data._id === currentUserId
  );

  const avatarSrc = post._userId.avatar
    ? post._userId.avatar.url
    : '/default-avatar.png';

  const capitalizedName = post._userId.name.replace(/\b(\w)/g, (s) =>
    s.toUpperCase()
  );

  const expandPost = (e: any) => {
    handleModal(
      <ExpandedPost
        tribeId={tribeId}
        post={post}
      />,
      true,
      "h-full",
      true
    );
  };

  const postedOn = {
    month: monthNames[date.getMonth()],
    day: date.getDate(),
    year: date.getFullYear(),
  };

  /* Used to update a post within the state */
  const likePost = async (e: any, postId: string) => {
    e.stopPropagation();

    const response = await updateLike(postId, currentUserId);

    if (!response) return

    const { parsedBody } = response

    if (parsedBody?.ok === true && parsedBody.post) {

      let tmpPost = state
      tmpPost.likes?.push({
        _id: currentUserId,
        dateLiked: new Date().toISOString()
      })

      setState(tmpPost)
    }
  };

  const deletePost = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>, isUserOp: boolean, postId: string) => {
    e.stopPropagation();

    if (!isUserOp) {
      alert('You do not have permission to delete this post')

      return
    }

    const response = await removePost(postId, currentUserId)

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

      mutate([`${BaseUrl}/post/posts/${props.tribeId}`, options])
      if (modal) handleModal(null, false, "h-full")
    }

    return
  }

  return (
    <div className='rounded-sm shadow-lg py-8 px-10 mt-5 mb-9'>
      <div
        className="min-w-[850px] "
        id="post-card"
        onClick={(e) => {
          e.preventDefault();

          if (expand) expandPost(state);
        }}
      >
        <div className='flex'>
          <Avatar
            imgSrc={avatarSrc}
            imgAlt="Avatar"
            width={64}
            height={64}
          />

          <div className="ml-5">
            <h4 className="text-xl semi-bold">{capitalizedName}</h4>
            <p className="text-inputTextGrey text-sm">{postedOn.month} {postedOn.day}, {postedOn.year}</p>
          </div>

          {/* <div>
            <img src="" alt="" />
          </div> */}
        </div>

        <div className="my-8">
          <div id="text-content">
            <p>{state.content}</p>
          </div>

          {state.image ? <div className="my-5-">
            <Image
              className="rounded-lg"
              src={state.image.url}
              alt="post media"
              width={250}
              height={250}
              style={{
                height: 'auto',
                width: 'auto'
              }}
            />
          </div> : null}
        </div>

        <div className="flex flex-row">
          <div className="flex flex-row">
            <Image
              className="hover:cursor-pointer hover:text-primary"
              src={isLiked ? '/like-grey.svg' : '/like.svg'}
              alt="like post"
              onClick={(e) => likePost(e, state._id)}
              width={24}
              height={24}
            />
            <p className="ml-2 text-inputTextGrey hover:cursor-pointer hover:text-primary font-semibold">{state.likes?.length ? state.likes.length : ""} Like</p>
          </div>

          <div className="flex flex-row ml-8">
            <Image
              className="hover:cursor-pointer hover:text-primary"
              src='/comment.svg'
              alt="leave a comment"
              width={24}
              height={24}
            />
            <p className="ml-2 text-inputTextGrey hover:cursor-pointer hover:text-primary font-semibold">{state.comments?.length ? state.comments.length : ""} Comments</p>
          </div>

          {isUserOp ? (<div className="flex flex-row ml-8" onClick={(e) => deletePost(e, isUserOp, state._id)}>
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
    </div>
  );
};

export default PostCard;