"use client"

import useSwr from 'swr'

/* Page Components */
import BoardWidget from '@/components/page specific/tribeDashboard/widgets/board';
import MembersWidget, { MembersProps } from '@/components/page specific/tribeDashboard/widgets/members';
import TimelineWidget from '@/components/page specific/tribeDashboard/widgets/posts';

/* Utils */
import { CustomHttpRequest } from '@/utils/functions/HTTP';
import { BaseUrl } from '@/utils/misc/constants';

/* Types */
 import { ITribe, ITribeRole } from '@/@types/tribes';
import { useContext, useEffect, useState } from 'react';
import { AppContext, TAppContext } from '@/utils/contexts/App';
import Toolbar from '@/components/page specific/tribeDashboard/toolbar';

/* Page props, only passes one prop which is the page slug */
interface Props {
  params: {
    slug: string
  }
}

/* Response body interface */
interface ResponseBody {
  message: string;
  tribe: ITribe;
  userId: string;
}

/* Complier wouldnt stop yelling at me unless i typed the obj */
const options: RequestInit = {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include"
}

// async function getData(tribeId: string): Promise<ResponseBody> {
//   const response = await fetch(`${BaseUrl}/tribe/${tribeId}`, {
//     credentials: "include"
//   })

//   console.log(await response.text())

//   return response.json()
// }

/**
 * Homepages/Dashboard of a Tribe
 * @param props contains the slug aka tribeId
 * @returns 
 */
const Page = (props: Props) => {
  // const data = await getData(props.params.slug)

  // console.log(data)
  const { params: { slug } } = props
  const { data, error } = useSwr([`${BaseUrl}/tribe/${slug}`, options], ([url, options]) => CustomHttpRequest<ResponseBody>(url, options))
  const { user } = useContext(AppContext) as TAppContext

  if (error) {
    return (
      <div>There was an error</div>
    )
  }

  if (!data) {
    return (
      <div>loading...</div>
    )
  }

  const { tribe } = data.parsedBody as ResponseBody

  const memberIndex = tribe.members.findIndex(({ _id }) => _id._id === user._id)

  return (
    <div className='h-view w-full'>
      <div className='h-full'>
        <Toolbar tribe={tribe} />
        <div className='h-full grid grid-cols-12 gap-y-4 lg:overflow-x-scroll'>
          <div className="col-span-2 max-h-[96%] px-7" id="board-widget-column">
            <BoardWidget
              permissions={{
                hasAgreed: tribe.members[memberIndex].aggreedToRules,
                status: tribe.members[memberIndex].status
              }}
              rules={tribe.rules}
              tribeId={tribe._id}
              avatar={tribe.avatar}
              description={tribe.description}
              name={tribe.name}
            />
          </div>
          <div className="col-span-6 max-h-[96%] px-7 overflow-y-hidden" id="post-widget-column">
            <TimelineWidget tribeId={tribe._id} />
          </div>
          <div className="col-span-4 max-h-[96%] px-7" id="members-widget-column">
            <MembersWidget members={tribe.members} roles={tribe.roles} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page