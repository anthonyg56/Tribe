"use client"
import { AgreeToRulesReq } from '@/utils/api/tribes';
import React from 'react'
import { mutate } from "swr";

interface Props {
  rules?: {
    text: string
  }[] | null;
  hasAgreed?: boolean;
  tribeId: string;
}

interface Response {
  message: string;
  ok: boolean
}

/**
 * A static map of all the rules for a tribe
 *
 * @returns An array of JSX elements or one if there are no rules set
 */
export default function RulesList(props: Props) {
  const { rules, hasAgreed, tribeId } = props

  const NoRules = () => (
    <div>
      <p>This tribe appears to be total anarchy</p>
    </div>
  );

  const agreeToRules = async (e: any) => {
    e.preventDefault();

    if (!hasAgreed) return

    const response = await AgreeToRulesReq(tribeId)

    if (!response) return

    const { parsedBody } = response

    if (parsedBody?.ok === false) {
      alert(parsedBody?.message)
      return
    }

    mutate(`http://localhost:5000/tribe/${tribeId}`);
  };

  const showAgreeBtn = () => {
    if (!rules || hasAgreed) return false
  }

  return (
    <div>
      <div>
        {rules?.length ? (
          rules.map((rule, index) => {
            return (
              <div>
                <p>
                  {index + 1}. {rule.text}
                </p>
              </div>
            );
          })
        ) : (
          <NoRules />
        )}
      </div>

      {showAgreeBtn() && <div>
        <button onClick={(e) => agreeToRules(e)}>Agree</button>
      </div>}
    </div>
  );
}
