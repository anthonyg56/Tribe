import { SearchResults } from '.'
import User from './user'

interface Props {
  users: SearchResults;
  tribeId: string;
  searchTerm: string;
}

/**
* A list of users that were found performing autocomplete
*
* @param users - An array of user documents pulled from mongoDB
*
* @returns a map of JSX Components/Elements
*
*/
export default function UserList(props: Props) {
  const { tribeId, users, searchTerm } = props

  return (
    <div className='flex overflow-y-auto flex-col rounded-sm border-solid border-black w-[275px] h-[275px] mt-4 scrollbar-non'>
      {searchTerm &&
        (users.length === 0 ?
          <User
            tribeId={tribeId}
            email={searchTerm}
            emptyUser
          /> : users.map(({ _id: id, name, email, avatar }) => {
            return (
              <User
                userId={id as string}
                tribeId={tribeId}
                avatar={avatar}
                email={email}
                name={name}
                key={id}
              />
            )
          })
        )
      }
    </div>
  )
}
