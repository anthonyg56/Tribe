"use client"

import { AppContext, TAppContext } from '@/utils/contexts/App';
import { AuthContext, TAuthContext } from '@/utils/contexts/Auth';
import { BaseUrl, capitalize } from '@/utils/misc/constants';
import React, { Fragment, useContext, useState } from 'react'
import { mutate } from 'swr';
import UpdateEmailForm from './email';
import UpdateUserNameForm from './userName';
import UpdatePasswordForm from './password';
import { updateAvatar } from '@/utils/api/user';
import { IUser } from '@/@types/user';
import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import Avatar from '@/components/reusables/Avatar';
import { Accordion, AccordionHeader, AccordionBody, Button } from '@material-tailwind/react';

enum FourmViews {
  UpdateName,
  UpdatePassword,
  UpdateEmail,
}

interface Props {
  user: IUser
}

function Icon({ id, open }: { id: FourmViews; open: string | FourmViews | null }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${id === open ? "rotate-180" : ""
        } h-5 w-5 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function Profile(props: Props) {
  const [currentFourm, setState] = useState<FourmViews | string | null>(null);
  const [tmpAvatar, setAvatar] = useState<File | undefined>();

  const { logout, userId } = useContext(AuthContext) as TAuthContext;
  const { handleModal } = useContext(ModalContext) as TModalContext
  const { user } = props

  const showFourm = (
    formView: FourmViews,
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (e) e.preventDefault();

    currentFourm !== formView ? setState(formView) : setState(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (tmpAvatar) {
      let formData = new FormData();
      formData.append("avatar", tmpAvatar, tmpAvatar.name);

      const response = await updateAvatar(userId, formData);

      if (!response) {
        alert(
          "There was an error saving your profile avatar, please try again"
        );
        return
      }
      const data = await response.json()

      if (response.status === 404) {
        alert(
          "There was an error saving your profile avatar, please try again"
        );
      } else if (data.avatar) {
        const options: RequestInit = {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }

        setAvatar(undefined);
        mutate(`${BaseUrl}/user/${userId}`, options);
      }

      return;
    }
  };

  const uploadNewAvatar = (e: any) => {
    let target;
    target = e.target.files ? e.target.files[0] : undefined;

    setAvatar(target)
  }

  const determineAvatar = () => {
    // if (!user.avatar) {
    //   return '/default-avatar.png'
    // }
    // return tmpAvatar ? URL.createObjectURL(tmpAvatar) : user.avatar?.url;
    if (tmpAvatar) {
      return URL.createObjectURL(tmpAvatar)
    } else if (!tmpAvatar && user.avatar) {
      return user.avatar.url
    } else if (!tmpAvatar && !user.avatar) {
      return '/default-avatar.png'
    }
  };

  const userAvatar = determineAvatar();
  return (
    <div className='w-full px-6'>
      <div className='flex flex-col items-center justify-center'>
        <div id="user-info">

          {/* Tribe avatar */}
          <form onSubmit={handleSubmit}>
            <div className='flex justify-center'>
              <h3 className='font-semibold text-xl'>{capitalize(user.name)}'s Profile Settings</h3>
            </div>

            <div className='flex justify-center my-4'>
              <Avatar imgSrc={userAvatar} imgAlt="Your Avatar" height={200} width={200} />
            </div>

            <div className='text-center py-4 font-semibold text-lg'>
              <label className="my-1" htmlFor="photo">Upload Avatar</label>
              <input
                className='w-[0.1px] h-[0.1px] opacity-0 overflow-hidden absolute -z-10'
                type="file"
                name="photo"
                id="photo"
                onChange={(e) => uploadNewAvatar(e)}
              />
            </div>

            {tmpAvatar && (
              <div id="save-btn-container">
                <button className="font-semibold text-lg text-center py-4" type="submit">Save</button>
              </div>
            )}
          </form>

        </div>
      </div>

      {/* Accordion */}
      <Fragment>

        {/* Change Name */}
        <Accordion open={currentFourm === FourmViews.UpdateName} icon={<Icon id={FourmViews.UpdateName} open={currentFourm} />}>
          <AccordionHeader onClick={() => showFourm(FourmViews.UpdateName)}>
            <p>Click here to change your name: {capitalize(user.name)}</p>
          </AccordionHeader>
          <AccordionBody>
            <UpdateUserNameForm userId={userId} />
          </AccordionBody>
        </Accordion>

        {/* EChange Email */}
        <Accordion open={currentFourm === FourmViews.UpdateEmail} icon={<Icon id={FourmViews.UpdateEmail} open={currentFourm} />}>
          <AccordionHeader onClick={() => showFourm(FourmViews.UpdateEmail)}>
            <p>Click here to change your email: {capitalize(user.email)}</p>
          </AccordionHeader>
          <AccordionBody>
            <UpdateEmailForm userId={userId} />
          </AccordionBody>
        </Accordion>

        {/* Change Password */}
        <Accordion open={currentFourm === FourmViews.UpdatePassword} icon={<Icon id={FourmViews.UpdatePassword} open={currentFourm} />}>
          <AccordionHeader onClick={() => showFourm(FourmViews.UpdatePassword)}>
            <p>Click here to Change your password</p>
          </AccordionHeader>
          <AccordionBody>
            <UpdatePasswordForm userId={userId} />
          </AccordionBody>
        </Accordion>

      </Fragment>


      <div className='text-center'>
        <button
          className='px-8 py-2 text-white bg-red-600 rounded-xl font-semibold text-base my-5'
          onClick={(e) => {
            e.preventDefault();
            handleModal(null, false, "")
            logout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
