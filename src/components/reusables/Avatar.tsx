"use client"

import React, { useContext } from 'react'
import Image from 'next/image'

import { ModalContext, TModalContext } from '@/utils/contexts/Modal';

interface Props {
  className?: string;
  imgSrc?: string;
  imgAlt?: string;
  width?: number;
  height?: number;
  margin?: string;
  expandAvatar?: boolean;
  onClickFunc?: any;
  mouseHover?: boolean;
};

/**
 * Reusable avatar component for users and tribes
 * 
 * Warning: If both properties 'expandAvatar' & 'onClickFunc' is passed, 'onClickFunc' will be the only one to execute
 * 
 * @param imgSrc source of an image, if this prop is not passed if will default to '/default-avatar.png'
 * @param imgAlt alt of an image, if this prop is not passed if will default to 'default avatar'
 * @param width set width of the image by px, this prop is optional
 * @param height  set height of the image by px, this prop is optional
 * @param margin set margin of the image by px, this prop is optional
 * @param expandAvatar boolean passed to determine if a user can expand the image, if onClick is not passed this will be the default function
 * @param onClickFunc a function passed to manipulate the onClick event on the component
 * @param mouseHover boolean to determine if the mouse will have the onHover css property
 * @param className option tailwind style to pass down to the component
 * 
 * @returns 
 */
export default function Avatar(props: Props) {
  const { handleModal } = useContext(ModalContext) as TModalContext;
  const { imgSrc, imgAlt, width, height, expandAvatar, margin, onClickFunc, mouseHover, className } = props
  
  /* If expandAvatar is passed in the props, this will be the default function that executes froms an onClick event */
  const expand = () => {
    return expandAvatar ? handleModal(<ImagePreview src={imgSrc ? imgSrc : '/default-avatar.png'} alt={imgAlt ? imgAlt : 'default avatar'}/>, true) : null
  };

  const handleClick = (e: any) => {
    e.preventDefault();

    if (onClickFunc) {
      onClickFunc(e)
      return
    } else {
      expand()
    };
  };

  const ImagePreview = (props: { src: string; alt: string; }) => {
    return (
      <div id="image-container">
        <Image
          className='object-cover'
          src={props.src}
          alt={props.alt}
          width={0}
          height={0}
          style={{
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    );
  };

  const AvatarContainer = ({ children, onClick }: {
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined
    children: React.ReactNode
  }) => {
    const styles = {
      height: `${height ? `${height}px` : '55px'}`,
      width: `${width ? `${width}px` : '55px'}`,
      margin: `${margin ? margin : 'none'}`,
    }

    return (
      <div className={`${className ? className : ''}`} style={styles} onClick={onClick}>
        {children}
      </div>
    )
  }

  const AvatarImg = () => {
    const styles: React.CSSProperties = {
      height: '100%',
      width: "100%",
      borderRadius: '50%',
      objectFit: "cover",
    }

    return (
      <div className='h-full w-full'>
        <Image
          className='shadow-lg'
          src={imgSrc ? imgSrc : '/default-avatar.png'}
          alt={imgAlt ? imgAlt : 'default avatar'}
          height={0}
          width={0}
          style={styles}
        />
      </div>
    )
  }

  return (
    <AvatarContainer onClick={e => handleClick(e)}>
      <AvatarImg />
    </AvatarContainer>
  )
}
