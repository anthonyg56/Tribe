"use client"

import { ITribeRole, MemberStatus } from '@/@types/tribes';
import React, { useState } from 'react'
import Image from 'next/image'
import ExpandedMembersList from './expandedMembersList';

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
    role?: string | undefined;
    aggreedToRules: boolean;
    memberSince: string;
  }[];
  roles: ITribeRole[];
}

const initalState: {
  // view: Views | null;
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
    role?: string | undefined;
    aggreedToRules: boolean;
    memberSince: string;
  }[];
  roles: ITribeRole[];
} = {
  // view: null,
  members: [],
  roles: []
};

export default function ExpandedMembersWidget(props: Props) {
  const [state, setState] = useState(initalState);
  const { members, roles } = props

  // useEffect(() => {
  //   if (state.view === null)
  //     setState({
  //       ...state,
  //       view: Views.TribeMembers,
  //     });
  // });

  // const changeView = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,view: Views) => {
  //   e.preventDefault()

  //   setState({
  //     ...state,
  //     // view,
  //   });
  // }

  const ManageMembersButton = () => (
    <div /* onClick={e => changeView(e, Views.TribeMembers)} */>
      <Image src='/members.svg' alt={'Members'} height={undefined} width={undefined} />
      <p>Members</p>
    </div>
  )

  const MembersLength = () => (
    <div>
      <p>{members.length} Member{members.length >=2 ? 's' : ''}</p>
    </div>
  )

  const RolesAndPermissionsLength = () => (
    <div>
      <p>{roles.length} Role{roles.length >=2 ? 's' : ''}</p>
    </div>
  )

  const RolesAndPermissionsButton = () => (
    <div  /* onClick={e => changeView(e, Views.RolesAndPermissions)} */>
      <Image src='/rolesAndPermissions.svg' alt={'roles and permissions'} height={undefined} width={undefined}/>
      <p>Roles and Permissions</p>
    </div >
  );


  return (
    <div>
      <div>
        <div>
          <div>
            <h3>Tribe Members</h3>
          </div>
          <MembersLength />
          {/* state.view === Views.TribeMembers ? <RolesAndPermissionsButton /> : <ManageMembersButton /> */}
          {/* state.view === Views.TribeMembers ? <MembersLength /> : <RolesAndPermissionsLength /> */}
        </div>
        <div>
          <ExpandedMembersList members={members} />
          {/* state.view === Views.TribeMembers && <MembersList members={members} /> */}
          {/* state.view === Views.RolesAndPermissions && <EditRolesAndPermissions roles={roles} /> */}
        </div>
      </div>
    </div>
  );
}
