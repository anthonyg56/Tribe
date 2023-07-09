"use client"

import React, { useEffect, useState } from 'react'

import UserList from './userList';

import { TAvatar } from '@/@types/utils';
import { AutocompleteReq } from '@/utils/api/tribes';

export type SearchResults = Array<{
  _id?: string;
  name?: string;
  email: string;
  avatar?: TAvatar;
}>;

interface Props {
  tribeId: string;
}

export default function inviteToTribe(props: Props) {
  const [searchTerm, updateSearchTerm] = useState("");
  const [searchResults, updateResults] = useState<SearchResults>([]);

  useEffect(() => {
    const getResults = async () => {

      if (!searchTerm) return;

      try {
        const response = await AutocompleteReq(searchTerm)

        if (!response) return

        const { parsedBody } = response

        if (!parsedBody || parsedBody?.users === null) {
          updateResults([])
          return 
        }

        updateResults(parsedBody.users as SearchResults)
      } catch (err) {
        console.log(err)
      }
    }

    getResults();
  }, [searchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    updateSearchTerm(e.currentTarget.value)
  };

  return (
    <div className='z-10 flex top-0 right-0 absolute flex-row justify-center bg-white rounded-md border-2 border-solid border-black w-[300px]'>
      <div className='flex-col justify-center'>
        <h3 className='text-center my-3'>
          Invite to Tribe {/* TODO: Add Font */}
        </h3>
        <div className='relative h-10 w-full min-w-[200px] my-2'>
          <input
            className='peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-white px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-primary focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"'
            id="email"
            type="email"
            required
            name="nameOrEmail"
            value={searchTerm}
            onChange={handleChange}
            placeholder=" "
          />
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-primary peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-primary peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
            Members Name or Email
          </label>
        </div>
        <UserList users={searchResults} searchTerm={searchTerm} tribeId={props.tribeId} />
        {/* <div>
        <input
          width="70%"
          style={{
            marginTop: '10px',
            marginBottom: '10px'
          }}
        />
        <button style={{ width: '25%'}}>
          <span>copy</span>
          <Image src='/copy.svg' alt='copy' width={0} height={0} style={{ marginLeft: '5px', width: '15px', marginBottom: '1px', height: "100%" }}/>
        </button>
      </div> */}
      </div>
    </div>
  );
}
