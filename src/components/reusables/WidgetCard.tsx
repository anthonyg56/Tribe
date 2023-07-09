"use client"

import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import { Card, CardHeader } from '@material-tailwind/react';
import React, { useContext } from 'react'
import Image from 'next/image'
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  // width?: number;
  // height?: number;
  // flex?: boolean;
  // grid?: boolean;
  name: string;
  children?: React.ReactNode;
  expandedComponent?: React.ReactElement;
  eclipse?: boolean;
  className?: string;
}

/**
 * All widgets come with their own unique needs, the widget card basically enables custom functionality for different widgets
 * 
 * @param name name of the widget
 * @param children mini version of a widget
 * @param expandedComponent If a widget has more to offer besides what is shown on the dashboard, pass an expandedComponent to expand the widget
 * @returns 
 */
export default function WidgetCard(props: Props) {
  const { handleModal } = useContext(ModalContext) as TModalContext;
  const { children, name, expandedComponent, eclipse, className } = props

  const openExpandedWidget = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()

    if (expandedComponent) {
      handleModal(expandedComponent, true)
    }

    return
  }

  return (
    <Card className={`shadow-xl rounded-xl py-5 px-7 ${className}`}>
      <div className='flex' onClick={e => openExpandedWidget(e)}>
        <h3 className='text-2xl font-semibold'>{name}</h3>
        {eclipse ? <FontAwesomeIcon className="ml-auto" icon={faEllipsis} /> : null }
      </div>
      {children}
    </Card>
  );
}
