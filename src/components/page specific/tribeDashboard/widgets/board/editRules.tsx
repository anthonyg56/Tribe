"use client"

import { MemberStatus } from '@/@types/tribes';
import React from 'react'
import RuleInput from './ruleInput';
import { submitRulesReq } from '@/utils/api/tribes';

interface Props {
  tribeId: string;
  status?: MemberStatus;
  rules?: {
    text: string;
  }[] | null;
  setRules: (rules: Array<{
    text: string;
  }> | null) => void;
  saveAndSwitch: (rules: Array<{
    text: string;
  }> | null) => void;
}

export default function EditRules(props: Props) {
  const { rules, setRules, saveAndSwitch, status, tribeId } = props

   /**
   * Handles changes made to the input element for a rule
   *
   * @param e Event object
   * @param index Index of the rule
   * @returns Void
   */
   const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();

    if (rules) {
      const newRules = rules;
      newRules[index].text = e.currentTarget.value;

      setRules(newRules)

      return;
    }

    return;
  };

  /**
   * Keeps track of the length of a rule
   *
   * @param text The string being measured
   * @returns an object
   */
  const charactersUsed = (text: string) => {
    const length = text.length;
    const tooLong = text.length > 147

    return {
      string: `${length}/148 characters used`,
      length,
      tooLong
    };
  };


  /**
   * Pushes a new rule to the array
   *
   * @param e Mouse event
   * @returns void
   */
  const pushNewRule = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (rules) {
      const newRules = rules;
      newRules.push({ text: "" });

      setRules(newRules)

      return;
    }
  };

  /**
   * Removes a rule from an array and updates the rule array
   *
   * @param index index of the array
   * @returns void
   */
  const removeRule = (
    index: number
  ) => {

    if (rules) {
      const newRules = rules;
      newRules.splice(index, 1);

      setRules(newRules)

      return;
    }

    return;
  };

  const submitRules = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    /**
     * Before submitting a request to update the rules, check to see:
     * 1) If there are any rules to begin with
     * 2) if the rules are longer than 148 character
     * 3) if the user has permission,
     * 4) For empty strings incase the user doesnt throw away an empty rule
     */

    if (!rules || !rules.length) {
      return;
    }

    rules.forEach(({ text }) => {
      if (charactersUsed(text).tooLong) {
        return;
      }
    });

    if (status === MemberStatus.Member) {
      alert('Only admins can update the rules')
      return
    }

    for (let i = 0 ; i < rules.length ; i++) {
      if (rules[i].text === '') {
        rules.splice(i, 1)
      }
    }

    /* now push the request */
    const response = await submitRulesReq(tribeId,rules)

    if (!response) return

    const { parsedBody } = response

    if (parsedBody?.ok === true && parsedBody?.rules) {
      saveAndSwitch(parsedBody.rules)
      return
    }

    alert(parsedBody?.message)
    return
  };

  /**
   * TODO: Write a function for dragging rules to a different position
   */
  return (
    <div>
      <div>
        <div>
          {rules
            ? rules.map(({}, index) => {
                const value = rules ? rules[index].text : "";

                return <RuleInput
                  index={index}
                  value={value}
                  removeRule={(index: number) => removeRule(index)}
                  charactersUsed={(text: string) => charactersUsed(text)}
                  handleChange={(e: React.ChangeEvent<HTMLInputElement>, index: number) => handleChange(e, index)}
                />;
              })
            : null
          }
        </div>

        <div>
          <button onClick={(e) => pushNewRule(e)}>Add a new rule</button>
        </div>
      </div>

      <div>
        <button onClick={(e) => submitRules(e)}>Save</button>
      </div>
    </div>
  );
}
