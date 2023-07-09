"use client"

import { MemberStatus } from '@/@types/tribes';
import React from 'react'
import ExpandedMemberItem from './expandedMemberItem';

interface Props {
  members: {
    _id: {
      _id: string;
      name: string;
      avatar?: {
          url: string;
          publicId: string;
      };
    };
    status: MemberStatus;
    role?: string;
    aggreedToRules: boolean;
    memberSince: string;
  }[];
}

export default function ExpandedMembersList(props: Props) {
  const { members } = props

  const memberList = members.map((item, index) => {
    return <ExpandedMemberItem
      user={{
        avatar: item._id.avatar,
        id: item._id._id,
        name: item._id.name
      }}
      memberSince={item.memberSince}
      role={item.role}
      status={item.status}
    />
  });

  /**
   * TODO: Write out functions to sort the members list
   */
  return (
    <div>
      <div>
        <div>
          <div>
            <h4>Name</h4>
          </div>
          <div>
            <h4>Role</h4>
          </div>
          <div>
            <h4>Member Since</h4>
          </div>
        </div>
        <div>
          {memberList}
        </div>
      </div>
    </div>
  );
}
