import WidgetCard from "@/components/reusables/WidgetCard";
import PostList from "./postList";
import PostInput from "./postInput";

interface Props {
  tribeId: string;
}

const TimelineWidget = (props: Props) => {
  const { tribeId } = props

  return (
    <WidgetCard name="Main Timeline" className="h-full">
      <div className="overflow-y-auto">
        <PostInput tribeId={tribeId} />
        <div id="posts-container">
          <PostList tribeId={tribeId} />
        </div>
      </div>
    </WidgetCard>
  )
}

export default TimelineWidget