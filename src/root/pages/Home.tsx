
import Loader from "@/components/shared/Loader";
import Postcard from "@/components/shared/Postcard";
import UserCard from "@/components/shared/UserCard";
import { useGetuser, userecentposts } from "@/lib/react-query/queryandmutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPosts } = userecentposts();
  const {data:creators,isLoading:isUserLoading,isError:isErrorcreators}=useGetuser(10);

   if( isErrorcreators){
    return (
        <div className="flex flex-1">
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    )
   }



  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading ? (
            <Loader></Loader>
          ) : isErrorPosts ? (
            <div>Error loading posts</div>
          ) : (
            <ul className="flex flex-1 flex-col gap-9">
              {posts?.documents.map((post: Models.Document) => (
                <Postcard post={post} key={post.caption}></Postcard>
              ))}
            </ul>
          )}
        </div>
      </div>

     <div className="home-creators">
      <h3 className="h3-bold text-light-1 "> Top creators</h3>
      {isUserLoading && !creators ?(
        <Loader></Loader>
      ):(
        <ul className="grid gpa-6 2xl:grid-cols-2">
       {creators?.documents.map((creator)=>(
        <li key={creator?.$id}>
          <UserCard user={creator}></UserCard>
        </li>
       ))}
        </ul>
      )}


     </div>

    </div>
  );
};

export default Home;