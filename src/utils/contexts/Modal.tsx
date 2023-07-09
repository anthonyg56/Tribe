"use client"

import { createContext, useRef, useState } from "react"

import Modal from "@/components/reusables/Modal";

export type TModalContext = {
  modal: boolean,
  component: any,
  handleModal: (component: any, isOpen: boolean, className?: string, scroll?: boolean) => void,
  containerRef: React.MutableRefObject<any>,
}

export const ModalContext = createContext<Partial<TModalContext>>({})

/**
 * Wrapper component that provides state and functionality for the modal context
 * 
 */
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  let [modalOpen, setModal] = useState(false);
  let [component, setComponent] = useState<JSX.Element | null>(null);
  let [className, setClassName] = useState('')
  let [scroll, setScroll] = useState(false);

  let containerRef = useRef<Element | null>(null)

  let handleModal = (newComponent: any, isOpen: boolean, className?: string, scroll?: boolean) => {
    setModal(isOpen);
    className ? setClassName(className) : null
    scroll ? setScroll(true) : null

    if (newComponent) {
      setComponent(newComponent);
    }
  };
  
  return (
    <ModalContext.Provider value={{ modal: modalOpen, component, containerRef, handleModal }}>
      <Modal className={className} scroll={scroll}/>
      {children}
    </ModalContext.Provider>
  );
};