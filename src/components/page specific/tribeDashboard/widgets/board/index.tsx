"use client"

import { useContext } from "react";

import Avatar from "@/components/reusables/Avatar";
import WidgetCard from "@/components/reusables/WidgetCard";

import { ModalContext, TModalContext } from "@/utils/contexts/Modal";
import { MemberStatus } from "@/@types/tribes";
import { TAvatar } from "@/@types/utils";
import Rules from "./rules";
import { capitalize } from "@/utils/misc/constants";
// import { Button } from "@material-tailwind/react";

interface Props {
  permissions: {
    hasAgreed?: boolean;
    status?: MemberStatus;
  };
  tribeId: string;
  rules?: {
    text: string;
  }[];
  description: string;
  name: string;
  avatar: TAvatar | undefined;
}

const BoardWidget = (props: Props) => {
  const { avatar, description, name, rules, tribeId, permissions } = props
  const { handleModal } = useContext(ModalContext) as TModalContext;

  const openRules = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()

    handleModal(<Rules avatar={avatar} name={name} rules={rules} tribeId={tribeId} permissions={permissions} />, true)
  }

  return (
    <WidgetCard name="Board">
      <div className="flex flex-col items-center w-full">
        <Avatar
          className="my-4"
          imgSrc={avatar ? avatar.url : undefined}
          imgAlt={'tribe avatar'}
          height={128}
          width={128}
          expandAvatar={true}
          mouseHover={true}
        />
        <h4 className="mt-2 mb-3 text-xl">{capitalize(name)}</h4>
        <p className="mb-3">{description}</p>
        {/* <button className="rounded-[50px] px-8 py-2 font-semibold border-primary shadow-primary shadow-md my-4" onClick={e => openRules(e)}>Rules</button> */}
      </div>
    </WidgetCard>
  );
}

export default BoardWidget