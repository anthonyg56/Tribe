"use client"

import React from 'react'
import Image from 'next/image'

interface Props {
  value: string;
  index: number;
  charactersUsed: (text: string) => {
    string: string;
    length: number;
    tooLong: boolean;
  };
  removeRule: (index: number) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}

export default function RuleInput(props: Props) {
  const { index, handleChange, value, charactersUsed, removeRule } = props

  return (
    <div>
      <div>
        <div>
          <div>
            <Image
              height={12}
              width={12}
              src='rules_draggable.svg'
              alt="dragable svg"
            />
          </div>

          <div>
            <input
              onChange={(e) => handleChange(e, index)}
              value={value}
              type="text"
              name={`rule-${index}`}
              id=""
              placeholder="Type here to add a rule"
              style={{ width: '100%'}}
            />
          </div>

          <div>
            <Image
              height={12}
              width={12}
              src='/delete_rule.svg'
              alt="delete rule svg"
              onClick={() => removeRule(index)}
            />
          </div>
        </div>

        <div>
          <p>{charactersUsed(value).string}</p>
        </div>
      </div>
    </div>
  )
}
