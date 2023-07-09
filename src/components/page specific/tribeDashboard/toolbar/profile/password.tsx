import FormMessage from '@/components/reusables/FormMessage';
import { updatePassword } from '@/utils/api/user';
import { Button } from '@material-tailwind/react';
import React, { useState } from 'react'

interface Props {
  userId: string;
}

export default function UpdatePasswordForm(props: Props) {
  const { userId } = props
  type State = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };

  const [state, setState] = useState<State>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formMsg, setformMsg] = useState({
    message: "",
    color: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newPw = state.newPassword;
    const oldPw = state.oldPassword;

    if (state.confirmPassword && state.confirmPassword !== state.newPassword) {
      setformMsg({
        message: "Passwords do not match",
        color: "red",
      });

      return;
    }

    const response = await updatePassword(oldPw, newPw, userId);

    if(!response) return

    const data = await response.json()

    if (response.status === 404) {
      setformMsg({
        message: data.error,
        color: "red",
      });
      return;
    }

    setformMsg({
      message: "Password updated",
      color: "green",
    });
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    propId: keyof State
  ) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    setState({ ...state, [propId]: value });
  };

  return (
    <div className="flex flex-col item-center justify-center">
      <div className="text-center">
        <h2>Change Password</h2>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col items-center'>

        <div className="w-72">
          <div className="relative h-10 w-full min-w-[200px] my-2">
            <input
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              type="password"
              name="old password"
              placeholder=" "
              value={state.oldPassword || ""}
              onChange={(e) => handleInput(e, "oldPassword")}
              required
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Old Password
            </label>
          </div>
        </div>

        <div className="w-72">
          <div className="relative h-10 w-full min-w-[200px] my-2">
            <input
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              type="password"
              name="new password"
              placeholder=" "
              value={state.newPassword || ""}
              onChange={(e) => handleInput(e, "newPassword")}
              required
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              New Password
            </label>
          </div>
        </div>

        <div className="w-72">
          <div className="relative h-10 w-full min-w-[200px] my-2">
            <input
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              type="password"
              name="confirm password"
              placeholder=" "
              value={state.newPassword || ""}
              onChange={(e) => handleInput(e, "confirmPassword")}
              required
            />
            <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Confirm Password
            </label>
          </div>
        </div>

        <FormMessage message={formMsg.message} color={formMsg.color} />

        <Button className='bg-primary color-white py-2 px-7 my-4' ripple={true} type="submit">Save</Button>
      </form>
    </div>
  )
}
