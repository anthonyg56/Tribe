"use client"

import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { Button } from "@material-tailwind/react";

import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import { AuthContext, TAuthContext } from '@/utils/contexts/Auth';
import { signin } from '@/utils/api/authentication';
import { LoginCredentials } from '@/@types/utils';

import FormMessage from '@/components/reusables/FormMessage';
import RegisterForm from './RegisterForm';

/**
 * Form for a user to log into tribe 
 * @returns 
 */
export default function LoginForm() {
  /* Track Input from the fourm */
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  /* Form Error Message */
  const [formMsg, setFormMsg] = useState({
    message: "",
    color: "",
  });

  /* Functions to manipulate the authentication context */
  const { login, validate } = useContext(AuthContext) as TAuthContext;
  const { handleModal } = useContext(ModalContext) as TModalContext;

  /* Handles form submission */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const email = state.email;
    const password = state.password;

    const response = await signin(email, password, setFormMsg);

    if (!response) {
      return
    }

    const { parsedBody } = response

    if (!response.ok) {
      setFormMsg({
        message: parsedBody?.message as string,
        color: "red",
      });
      return;
    }

    validate()
  };

  /* Handles keyboard input */
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    propId: keyof LoginCredentials
  ) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    setState({ ...state, [propId]: value });
  };

  const openRegister = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    handleModal(<RegisterForm />, true);
  };

  return (
    <div className="fixed text-center -translate-y-32">
      <div>
        <div className='py-1.5'>
          <Image
            className='mx-auto'
            src="/Layer 1.svg"
            alt='hero image'
            width={100}
            height={100}
          />
        </div>

        <div className="py-1.5">
          <h3 className="font-semibold">Welcome to Tribe</h3> {/* TODO: IMPORT THE STYLES */}
        </div>
      </div>

      <form id="login-form" onSubmit={(e) => handleSubmit(e)}>
        <FormMessage message={formMsg.message} color={formMsg.color} />
        <div id="inputs-container">
          <div className="w-72">
            <div className="relative h-10 w-full min-w-[200px] my-2">
              <input
                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                type="email"
                name="email"
                placeholder=" "
                value={state.email || ""}
                onChange={(e) => handleInput(e, "email")}
                required
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Email
              </label>
            </div>
          </div>

          <div className="w-72">
            <div className="relative h-10 w-full min-w-[200px] my-2">
              <input
                className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                type="password"
                name="password"
                placeholder=" "
                id="password"
                value={state.password || ""}
                onChange={(e) => handleInput(e, "password")}
                required
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Password
              </label>
            </div>
          </div>
        </div>

        <Button variant="text" type="submit" className='my-2.5'>Login</Button>
      </form>

      <div id="register-text">
        <p>
          New user? <span onClick={openRegister} className='hover:cursor-pointer'>Click here to sign up</span>
        </p>
      </div>
    </div>
  )
}
