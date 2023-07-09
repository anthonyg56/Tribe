import { ITribeRole, MemberStatus } from "@/@types/tribes";
import WidgetCard from "@/components/reusables/WidgetCard";
import NonExpandedMemberItem from "./NonExpandedMemberItem";
// import ExpandedMembersWidget from "./expandedMembersWidget";

export interface MembersProps {
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
};

interface Props {
  members: MembersProps[];
  roles: ITribeRole[];
}

const MembersWidget = (props: Props) => {
  const { members, roles } = props;

  const membersList = members.map((data, index) => (
      <NonExpandedMemberItem name={data._id.name} avatar={data._id.avatar} status={data.status} key={index}/>
    )
  );

  return (
    <WidgetCard name="Members" >{/* expandedComponent={<ExpandedMembersWidget members={members} roles={roles} />} */}
      <div id="members-widget-container">
        {membersList}
      </div>
    </WidgetCard>
  );
};

export default MembersWidget