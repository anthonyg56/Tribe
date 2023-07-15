"use client"

import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AuthContext, TAuthContext } from '@/utils/contexts/Auth';
import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import Avatar from '@/components/reusables/Avatar';
import { deleteTribeReq, updateTribe } from '@/utils/api/tribes';
import { mutate } from 'swr';
import { BaseUrl, capitalize } from '@/utils/misc/constants';
import { Textarea } from '@material-tailwind/react';

interface Props {
  tribeDescription: string;
  avatarUrl: string | undefined;
  tribeName: string;
  tribeId: string;
  owner: string;
}

interface InitalState {
  avatar: File | undefined;
  deleteTribeView: boolean;
  disableButton: boolean;
  deleteButton: boolean;
  description: string;
  name: string;
}

export default function TribeSettings(props: Props) {
  const [state, setState] = useState<InitalState>({
    name: "",
    description: "",
    avatar: undefined,
    deleteButton: false,
    disableButton: false,
    deleteTribeView: false,
  })

  const { userId, homeTribe } = useContext(AuthContext) as TAuthContext
  const { handleModal } = useContext(ModalContext) as TModalContext;

  const { avatarUrl, tribeDescription, tribeId, tribeName, owner } = props

  const router = useRouter()

  useEffect(() => {
    const name = capitalize(tribeName)
    const description = tribeDescription

    setState({
      ...state,
      name: name,
      description: description
    })
  }, [])

  /* When the component mounts and an image is upload, check the file size. It cant be bigger than 10mb */
  useEffect(() => {
    checkFile()
  }, [state.avatar])

  /* when a user uploads a file, if it failed the check clear tmpavatar and alert the user why */
  const fileCheckFailed = (message: string) => {
    alert(message) 
    setState({ ...state, avatar: undefined})
  }

  const checkFile = () => {
    if (!state.avatar) return

    state.avatar.size > 10000000 ? fileCheckFailed("File size too big") : null
    state.avatar.type !== ".jpg" ||  ".jpeg" || ".png"  ? fileCheckFailed("File type must be: .jpg, .jpeg, .png") : null
    state.avatar.length > 1 ? fileCheckFailed("Only one file at a time") : null
  }

  const btnRef = useRef<any>()

  const LeftButton = () => (
    <div>

    </div>
  )

  const RightButton = () => (
    <div>
      <button onClick={() => state.deleteTribeView ? deleteTribe() : saveChanges()} ref={btnRef}>{state.deleteTribeView ? "Yes" : "Save Changes"}</button>
    </div>
  )

  const deleteTribe = async () => {
    btnRef.current.setAttribute("disabled", "disabled")

    /* Check if a user has permission first */
    console.log(tribeId)
    console.log(homeTribe)
    if (tribeId === homeTribe) {
      alert('You cannot delete your home tribe')
      setState({
        ...state,
        deleteTribeView: false
      })
      return
    } else if (owner === userId) {
      const res = await deleteTribeReq(tribeId)

      /* Close Modal, alert the user the tribe was deleted, and redirect the user to their homepage */

      handleModal(null, false)

      router.push(`/${userId}/${homeTribe}`)

      alert('Tribe has been deleted')

      // removeTribeFromTray(tribeId)

      
    }

    /* Add logic for leaving a tribe Here */


  }

  const saveChanges = async () => {
    btnRef.current.setAttribute("disabled", "disabled")

    const formData = new FormData()

    if (state.name && state.name !== tribeName)
      formData.append("name", state.name);

    if (state.description && state.description !== tribeDescription)
      formData.append("description", state.description);

    if (state.avatar)
      formData.append("avatar", state.avatar, state.avatar.name);

    const res = await updateTribe(tribeId, formData);

    if (res && res.ok) {
      const options: RequestInit = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }

      alert('Tribe Settings successfully Updated!')
      mutate(`${BaseUrl}/tribe/${tribeId}`, options)
    }
  }

  const uploadNewAvatar = (e: any) => {
    let target;
    target = e.target.files ? e.target.files[0] : undefined;

    setState({
      ...state,
      avatar: target
    })
  }

  const imgSrc = () => {
    if (state.avatar) {
      return URL.createObjectURL(state.avatar)
    } else if (!state.avatar && avatarUrl) {
      return avatarUrl
    } else if (!state.avatar && !avatarUrl) {
      return undefined
    }
  }

  return (
    <div className='px-6 w-[425px]'>
      {/* Modal Header */}
      <div className='flex justify-center'>
        <h3 className='font-semibold text-xl'>Settings</h3>
      </div>

      {/* Tribe avatar */}
      <div>
        <div className='flex justify-center my-6'>
          <Avatar
            imgSrc={imgSrc()}
            imgAlt='Tribe Avatar'
            height={200}
            width={200}
          />
        </div>

        <div className='text-center py-4 font-semibold text-lg'>
          <label className="my-1" htmlFor="photo">Upload Tribe Avatar</label>
          <input
            className='w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute -z-10'
            type="file"
            name="photo"
            id="photo"
            onChange={(e) => uploadNewAvatar(e)}
          />
        </div>
      </div>

      {/* Edit Tribe Name */}
      <div className="w-full mb-7">
        <div className="relative h-10 w-full min-w-[200px] my-2">
          <input
            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
            type="text"
            name="name"
            placeholder=" "
            value={state.name || ""}
            onChange={(e) => {
              e.preventDefault();

              setState({
                ...state,
                name: e.currentTarget.value,
              });
            }}
            required
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Tribe Name
          </label>
        </div>
      </div>

      {/* Edit Tribe Description */}
      <div className="w-full  mb-7">
        <Textarea label="Tribe Description" value={state.description} cols={30} rows={5} onChange={(e) => {
          e.preventDefault();

          setState({
            ...state,
            description: e.currentTarget.value,
          });
        }} />
      </div>

      {/* Save Changes/Delete Tribe */}
      <div>
        <div>
          {state.deleteTribeView ? <p>Are you sure you want to delete this tribe? </p> : null}
        </div>

        <div className='flex flex-row py-4'>
          <button className={`px-8 py-2 text-white bg-red-600 rounded-xl`} onClick={() => setState({ ...state, deleteTribeView: !state.deleteTribeView })}>{state.deleteTribeView ? "No, Go Back" : "Delete tribe"}</button>
          <button className={`px-8 py-2 text-white ml-auto bg-green-500 rounded-xl`} onClick={() => state.deleteTribeView ? deleteTribe() : saveChanges()} ref={btnRef}>{state.deleteTribeView ? "Yes" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  )
}

