"use client"
import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import React, { useContext } from 'react'
import NewTribeForm from './newTribeForm';
import { AppContext, TAppContext } from '@/utils/contexts/App';

/**
 * Button to open a form to create a tribe
 *
 */
export default function CreateATribeBtn() {
  const { handleModal } = useContext(ModalContext) as TModalContext;
  const { user } = useContext(AppContext) as TAppContext

  console.log(user)
  const createATribe = (e: any) => {
    e.preventDefault()
    handleModal(<NewTribeForm user={user}/>, true, " ")
  }

  return (
    <div className='text-center text-white my-5' onClick={(e) => createATribe(e)}>
      {/* <div id="avatar">
        <img src="" alt="" />
      </div> */}
      <div className='mb-6 hover:cursor-pointer'>
        <p className='font-semibold'>Create a Tribe</p>
      </div>
    </div>
  )
}
