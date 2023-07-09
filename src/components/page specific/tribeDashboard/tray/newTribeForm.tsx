"use client"

import React, { useContext, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { mutate } from 'swr'

import { ModalContext, TModalContext } from '@/utils/contexts/Modal';

import ImagePreview from '@/components/reusables/ImagePreview';
import { createTribe } from '@/utils/api/tribes';
import { BaseUrl } from '@/utils/misc/constants';
import { IUser } from '@/@types/user';
import Avatar from '@/components/reusables/Avatar';
import { Button, Textarea } from '@material-tailwind/react';


interface InitalState {
  disableButton: false;
  name: string;
  description: string;
  avatar: File | undefined;
}

interface Props {
  user: IUser
}

/**
 * The Control Center Basically when it comes to Creating a new Tribe. It Keeps
 * track of what step users are on, the other components collects data, & then
 * sends it to here to holds onto the data, and after everything is complete, This component
 * sends it to the sever
 * @param props
 */
export default function NewTribeForm(props: Props) {
  const [state, setState] = useState<InitalState>({
    disableButton: false,
    name: "",
    description: "",
    avatar: undefined,
  });

  const { handleModal } = useContext(ModalContext) as TModalContext;
  const { user } = props

  const router = useRouter()

  const btnRef = useRef<any>();

  const avatarSrc = !state.avatar ? '/default-avatar.png' : URL.createObjectURL(state.avatar)

  const saveInput = (
    prop: "avatar" | "description" | "name",
    e: any
  ) => {
    e.preventDefault();

    let target;

    switch (prop) {
      case "avatar":
        target = e.target.files ? e.target.files[0] : undefined;
        break;
      default:
        target = e.currentTarget.value;
        break;
    }

    setState({
      ...state,
      [prop]: target,
    });
  };

  const submitTribe = async (e: any) => {
    e.preventDefault();
    btnRef.current.setAttribute("disabled", "disabled");

    const formData = new FormData();

    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("_userId", user._id);

    if (state.avatar)
      formData.append("avatar", state.avatar, state.avatar.name);

    const res = await createTribe(formData);

    if (res && res.status === 404) {
      alert("There was an error creating the tribe");
      return;
    } else if (!res) {
      alert("There was an error creating the tribe");
      return;
    }

    handleModal(null, false);

    const options: RequestInit = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }

    mutate(`${BaseUrl}/user/${user._id}`, options)

    router.push(`/${user._id}/${res.parsedBody?.newTribe._id}`);
  };

  const handleAvatar = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();

    if (state.avatar) {
      handleModal(<ImagePreview src={URL.createObjectURL(state.avatar)} alt="your tribe avatar" />, true);
    } else {
      handleModal(<ImagePreview src='/default-avatar.png' alt='default avatar' />, true);
    }
  }

  return (
    <div id="create-a-tribe">
      <div className='flex flex-col items-center justify-center'>
        <form onSubmit={(e) => submitTribe(e)} >
          <div id="upload-avatar-container">

            <div className='flex justify-center'>
              <h3>Create a New Tribe</h3>
            </div>


            <div className='flex justify-center my-4'>
              <Avatar
                imgSrc={avatarSrc}
                imgAlt="tribe avatar"
                expandAvatar={false}
                mouseHover={false}
                height={200}
                width={200}
              />
            </div>

            <div className='text-center py-4'>
              <label className="my-1 hover:cursor-pointer" htmlFor="photo">
                {state.avatar ? "Change Avatar" : "Add Avatar"}
              </label>
              <input
                className='w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute -z-10'
                type="file"
                name="photo"
                id="photo"
                onChange={(e) => saveInput("avatar", e)}
              />
            </div>
          </div>

          <div className="w-72">
            <div className="relative h-10 w-full min-w-[200px] my-2">
              <input
                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                type="text"
                name="name"
                placeholder=" "
                value={state.name || ""}
                onChange={(e) => saveInput("name", e)}
                required
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Tribe Name
              </label>
            </div>
          </div>

          <div className="w-72">
            <Textarea label="Description" value={state.description} cols={30} onChange={(e) => {
                e.preventDefault();

                setState({
                  ...state,
                  description: e.currentTarget.value,
                });
              }}/>
          </div>

          <div className='w-full text-center my-3'>
            <Button ripple className='bg-primary text-white py-2 px-6 rounded' type="submit" ref={btnRef}>
              Finish
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
