"use client"

import React, { useContext, useEffect } from 'react'
import { createPortal } from "react-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { ModalContext, TModalContext } from '@/utils/contexts/Modal';

interface Props {
  className?: string;
  scroll?: boolean;
}

/**
 * Reusable modal for the app.
 * 
 * @returns 
 */
const Modal = (props: Props) => {
  const { modal, handleModal, component, containerRef } = useContext(
    ModalContext
  ) as TModalContext;
 const { className, scroll } = props
  /* Close the modal */
  const closeModal = (e: any) => {
    e.preventDefault();
    handleModal(null, false, "", false);
  };

  /* JSX for the modal */
  const ModalHTML = () => (
    <div className="top-0 bottom-0 left-0 right-0 fixed">
      <div
        className='fixed top-0 bottom-0 left-0 right-0 z-[100] bg-black/80'
        onClick={(e) => closeModal(e)}
      ></div>
      <div className={`max-w-[90%] max-h-[90%] rounded-lg bg-white overflow-y-hidden z-[110] fixed top-1/2 left-1/2 pt-2.5 pr-2.5 pl-2.5 pb-4 -translate-y-1/2 -translate-x-1/2 ${className}`}>
        <div className="w-full flex">
          <button className="bg-transparent ml-auto border-none text-primary hover:cursor-pointer">
            <FontAwesomeIcon icon={faXmark} onClick={(e) => closeModal(e)}/>
          </button>
        </div>
        <div className="h-full w-full overflow-y-auto">{component}</div>
      </div>
    </div>
  )

  /* Once the components are mounted, set a ref to the modal-root container in the rootlayout */
  useEffect(() => {
    containerRef.current = document.querySelector("#modal-root")
  }, []);
  
  /* When there is a modal in the context and the coontainer ref is set from useEffect, create a portal to push the modal to the rootLayout, otherwise return nothing */
  if (modal && containerRef.current) {
    return createPortal(<ModalHTML />, containerRef.current);
  } else {
    return null;
  }
}

export default Modal