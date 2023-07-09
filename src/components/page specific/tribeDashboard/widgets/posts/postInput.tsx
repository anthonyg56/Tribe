"use client"

import { AppContext, TAppContext } from '@/utils/contexts/App';
import { AuthContext, TAuthContext } from '@/utils/contexts/Auth';
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { createPost } from '@/utils/api/posts';
import { useSWRConfig } from 'swr';
import { BaseUrl } from '@/utils/misc/constants';
import Avatar from '@/components/reusables/Avatar';

interface State {
  content: string;
  files: File | undefined;
}

interface Props {
  tribeId: string;
}

/* Required for SWR mutate function */
const options: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
}

export default function PostInput(props: Props) {
  const [state, setState] = useState<State>({
    content: "",
    files: undefined,
  });

  const { tribeId } = props

  const { userId } = useContext(AuthContext) as TAuthContext;
  const { user } = useContext(AppContext) as TAppContext
  const { mutate } = useSWRConfig()
  const uploadFiles = (e: any) => {
    e.preventDefault();

    setState({
      ...state,
      files: e.target.files ? e.target.files[0] : undefined,
    });
  };

  const uploadPost = async (e: any) => {
    e.preventDefault();

    if (!state.content && !state.files) {
      return;
    }

    let formData = new FormData();

    formData.append("_userId", userId);
    formData.append("_tribeId", tribeId);
    formData.append("content", state.content);

    if (state.files) {
      formData.append(`image`, state.files, state.files.name);
    }

    const response = await createPost(formData);

    if (!response) return

    if (response.status === 404) {
      alert(response.parsedBody?.message);
      return;
    }

    mutate([`${BaseUrl}/post/posts/${props.tribeId}`, options])

    setState({
      ...state,
      files: undefined,
      content: "",
    });
  };

  return (
    <div className='rounded-sm shadow-lg py-8 px-10 mt-5 mb-9'>
      <form onSubmit={(e) => uploadPost(e)}>
        <div className='flex'>
          <Avatar
            className='mr-4 '
            imgSrc={user?.avatar ? user.avatar.url : '/default-avatar.png'}
            imgAlt="user avatar"
            width={64}
            height={64}
          />

          <textarea
            className='w-full'
            name=""
            placeholder="What's on your mind?"
            id=""
            cols={30}
            rows={3}
            onChange={(e) => {
              e.preventDefault();

              setState({
                ...state,
                content: e.target.value,
              });
            }}
            value={state.content}
          ></textarea>
        </div>

        <div
          className=''
          style={{ display: state.files ? "block" : "none" }}
        >
          {state.files ? (
            <div className='max-w-[250px] max-h-[250px] my-6'>
              <Image
                className='h-full w-full rounded-lg'
                src={URL.createObjectURL(state.files)}
                alt="upload image"
                width={250}
                height={250}
              />
            </div>
          ) : null}
        </div>

        {/* Buttons */}
        <div className='flex mt-6'>
          <div className='flex hover:cursor-pointer rounded-[50px] bg-inputBgGrey px-4 py-2'>
            <label className="flex hover:cursor-pointer" htmlFor="files">
              <Image className="hover:text-primary" src='/addPhoto.svg' alt="file" width={18} height={18} />
              <p className='ml-2 text-inputTextGrey hover:cursor-pointer hover:text-primary font-semibold'>Photos</p>
            </label>
            <input
              className='w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute -z-10'
              type="file"
              name="files"
              id="files"
              onChange={(e) => uploadFiles(e)}
            />
          </div>

          <div className='ml-auto'>
            <button className='rounded-[50px] px-8 py-2 text-white bg-primary font-semibold' type="submit">Send</button>
          </div>
        </div>
      </form>
    </div>
  );
}
