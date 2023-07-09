"use client"
import { useContext, useState } from 'react';
import Image from 'next/image';

import FormMessage from '@/components/reusables/FormMessage';
import PasswordRequirements from './PasswordRequirements';
import Thanks from './thanks';

import { ModalContext, TModalContext } from '@/utils/contexts/Modal';
import { DefaultUserProps, HandleInput } from '@/@types/utils';
import { register } from '@/utils/api/authentication';

/**
 * Form for a user to register for an account with tribe 
 * 
 * @returns 
 */
export default function RegisterForm() {
  /* Form Error Message */
  const [formMsg, setFormMsg] = useState({
    message: "",
    color: "",
  });

  /* Track Input from the fourm */
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  /* Turns to true once a user starts typing their password */
  const [showPwRequirements, updatePwRequirements] = useState(false)

  const { handleModal } = useContext(ModalContext) as TModalContext;

  /* Object that tracks the validity of the form information */
  const formRequirements = {
    name: user.name ? true : false,
    email: user.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ? true : false,
    password: user.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/) ? true : false,
    password2: user.password2 === user.password && user.password ? true : false
  }

  /* Handles keyboard input */
  const handleInput: HandleInput<DefaultUserProps> = (e, propId) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    setUser({ ...user, [propId]: value });
  };

  /* Handles form submission */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRequirements.name) {
      setFormMsg({
        message: "Please enter a name",
        color: "red",
      });

      return;
    } else if (!formRequirements.email) {
      setFormMsg({
        message: "Please enter a valid email",
        color: "red",
      });

      return;
    } else if (!formRequirements.password) {
      setFormMsg({
        message: "Please enter a password",
        color: "red",
      });

      return;
    } else if (!user.password2) {
      setFormMsg({
        message: "Please confirm your password",
        color: "red",
      });

      return;
    } else if (!formRequirements.password2) {
      setFormMsg({
        message: "Passwords do not match",
        color: "red",
      });

      return;
    }

    console.log("made it here")

    const response = await register(user.name, user.email, user.password)

    console.log(response)
    if(!response) {
      return
    }

    const { parsedBody } = response
    
    if (response?.ok !== true) {
      setFormMsg({
        message: parsedBody?.message as string,
        color: "red",
      });

      return;
    }

    handleModal(<Thanks />, true);
  };
  
  return (
    <div>
      <div className="flex flex-col items-center pt-4 pr-11 pb-10 pl-11" >
      <div className="pb-9 text-center">
        <div>
          <h3 className="m-0 text-2xl">Join Tribe Today</h3> {/* TODO: IMPORT FONT */}
        </div>

        <div>
          <p className="m-0 text-tribeGrey text-sm">And keep the flame alive</p> {/* TODO: IMPORT FONT */}
        </div>
      </div>

      <div className='pb-10'>
        <Image 
          src="/Layer 1.svg"
          alt='hero image 2'
          width={100}
          height={100}
        />
      </div>

      <form id="register-form" onSubmit={(e) => handleSubmit(e)}>
        <FormMessage message={formMsg.message} color={formMsg.color} />

        <div className='pb-4'>
          <div className="input-labels"> {/* TODO: IMPORT FONT */}
            <input
              className='rounded-md p-2 my-1 mx-auto text-sm border-solid border-2 '
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={user.name || ""}
              onChange={(e) => handleInput(e, "name")}
              style={{
                borderColor: formRequirements.name ? '#006400' : '#EBEBEB'
              }}
              required
            />
          </div>

          <div className="input-labels" id="register-input-label">
            <input
              className='rounded-md p-2 my-1 mx-auto text-sm border-solid border-2 '
              type="email"
              name="email"
              placeholder="Email"
              id="email"
              value={user.email || ""}
              onChange={(e) => handleInput(e, "email")}
              style={{
                borderColor: formRequirements.email ? '#006400' : '#EBEBEB'
              }}
              required
            />
          </div>

          <div className="input-labels" id="register-input-label">
            <input
              className='rounded-md p-2 my-1 mx-auto text-sm border-solid border-2 '
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={user.password || ""}
              onChange={e => handleInput(e, "password")}
              onFocus={() => updatePwRequirements(true)}
              onBlur={() => updatePwRequirements(false)}
              style={{
                borderColor: formRequirements.password ? '#006400' : '#EBEBEB'
              }}
              required
            />

            { showPwRequirements ? <PasswordRequirements password={user.password}/> : null }
          </div>

          <div className="input-labels" id="confirm-password-input-label">
            <input
              className='rounded-md p-2 my-1 mx-auto text-sm border-solid border-2 '
              type="password"
              name="password2"
              placeholder="Confirm password"
              id="password2"
              value={user.password2 || ""}
              onChange={(e) => handleInput(e, "password2")}
              style={{
                borderColor: formRequirements.password2 ? '#006400' : '#EBEBEB'
              }}
              required
            />
          </div>
        </div>

        <div className="text-center pb-4">
          <button className="bg-primary border-2 border-solid border-white hover:cursor-pointer px-5 py-2 rounded-3xl text-white" type="submit">Sign Up</button>
        </div>

        <div className='text-sm text-center'>
          <p className='my-1 mx-0'>Already have an account?</p>
          <span
            className='border-b-2 border-solid border-tribeGrey pb-1 hover:cursor-pointer mt-2'
            onClick={(e) => {
              e.preventDefault();
              handleModal(null, false);
            }}
          >
            Click here to login.
          </span>
        </div>
      </form>
    </div>
    </div>
  )
}
