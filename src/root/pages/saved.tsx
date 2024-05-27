
import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import { useGetCurrentUser } from "@/lib/react-query/queryandmutations"
import { Models } from "appwrite"


const Saved = () => {
  const {data:currentUser}=useGetCurrentUser()

  const savedposts=currentUser?.save.map((savePost:Models.Document)=>(
    {
      ...savePost.post,
      creator:{
        imageUrl:currentUser.imageUrl,
      }
    }
  ))
  .reverse()


  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img src="/assets/icons/save.svg" alt="edit" height={36} width={36} className="inver-white"/>
        <h2 className="h3-bold text-left w-full md:h2-bold">Saved Posts</h2>

      </div>
      {!currentUser ?(
        <Loader/>
      ):(
        <ul className="flex justify-center w-full gap-9 max-w-5xl">
          {savedposts.length===0 ?(
            <p className="text-light-4">No available Posts</p>
          ):(
            <GridPostList posts={savedposts} showstats={false}></GridPostList>
          )}
        </ul>
      )}

    </div>
  )
}

export default Saved
