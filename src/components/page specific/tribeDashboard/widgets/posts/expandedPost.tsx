import { IPostResponse } from '@/@types/posts';
import PostCard from './postCard';
import CommentForm from './commentForm';
import CommentList from './commentList';

interface Props {
  tribeId: string;
  post: IPostResponse;
};

export default function ExpandedPost(props: Props) {
  const { post, tribeId } = props
  
  return (
    <div className='py-5 px-7'>
      <PostCard
        expand={false}
        tribeId={tribeId}
        post={post}
      />
      <CommentList postId={post._id} />
      <CommentForm postId={post._id}/>
    </div>
  );
}
