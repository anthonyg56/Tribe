"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { MemberStatus } from '@/@types/tribes';
import { TAvatar } from '@/@types/utils';
import Avatar from '@/components/reusables/Avatar';
import RulesList from './rulesList';
import EditRules from './editRules';


interface Props {
  name: string;
  avatar: TAvatar | undefined;
  tribeId: string;
  permissions: {
    hasAgreed?: boolean;
    status?: MemberStatus;
  };
  rules?: Array<{
    text: string;
  }> | null;
}

interface IInitalState {
  editMode: boolean;
  rules?: Array<{
    text: string;
  }> | null;
};

/**
 * Displays the rules of a tribe and allows the admins the ability to edit them
 *
 * @param {object} avatar - Tribe Avatar
 * @param {string} name - Tribe name
 * @param {array} rules - An array of rules for the tribe
 *
 * @returns the component, duh
 */
export default function Rules(props: Props) {
  const [state, setState] = useState<IInitalState>({
    editMode: false,
    rules: null
  })

  const { avatar, name, rules, tribeId, permissions } = props
  /**
   * When the component first mounts, the rules are set to null so we can check to see if its mounting for the first time
   * If it is null, set the rules for the component to use
   *
   */
  useEffect(() => {
    if (state.rules === null) {
      setState({
        ...state,
        rules: rules
      })
    }

  }, [])

  const switchViews = (e: any) => {
    e?.preventDefault()


    if (permissions?.status === MemberStatus.Member) {
      alert('Only admins can edit the rules')
      return
    }

    const { rules } = state

    if (rules) {
      for (let i = 0 ; i < rules.length ; i++) {
        if (rules[i].text === '') {
          rules.splice(i, 1)
        }
      }

      setState({
        rules,
        editMode: !state.editMode
      })
    }

    setState({
      ...state,
      editMode: !state.editMode
    })
  }

  const setRules = (rules: Array<{ text: string; }> | null) => {
    return setState({
      ...state,
      rules
    })
  }

  const saveAndSwitch = (rules: Array<{ text: string; }> | null) => {
    return setState({
      editMode: false,
      rules
    })
  }

  return (
    <div>
      <div style={{
        width: '100%',
        textAlign: 'center'
      }}>
        <Avatar
          expandAvatar={false}
          imgSrc={avatar ? avatar.url : undefined}
          imgAlt={'tribe avatar'}
          width={65}
          height={65}
          margin={'auto'}
          mouseHover={false}
        />
      </div>

      <div>
        <h2>Rules of {name} <Image src={!state.editMode ? '/edit-pencil.svg' : '/goBack.svg' } alt="edit rules svg" onClick={(e) => switchViews(e)} height={16} width={16} /></h2>
      </div>

      <div>
        {state.editMode === false && <RulesList
          rules={state.rules}
          tribeId={tribeId}
          hasAgreed={permissions.hasAgreed}
          />}
        {state.editMode && <EditRules
          tribeId={tribeId}
          status={permissions.status}
          rules={state.rules}
          setRules={(rules: Array<{ text: string; }> | null) => setRules(rules)}
          saveAndSwitch={(rules: Array<{ text: string; }> | null) => saveAndSwitch(rules)}
        />}
      </div>
    </div>
  )
        }
