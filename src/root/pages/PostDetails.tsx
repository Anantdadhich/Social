import Loader from "@/components/shared/Loader";
import Poststats from "@/components/shared/Poststats";
import { Button } from "@/components/ui/button";
import { useuserContext } from "@/context/authcontext";
import { useGetpostbyid } from "@/lib/react-query/queryandmutations"
import {  multiFormatDateString } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";


const PostDetails = () => {
   const {id}=useParams()
  const {data:post,isPending}=useGetpostbyid(id ||'');
 const {user}=useuserContext();
  const handleclickdelete=()=>{

  }
 
  return (
    <div className="post_details-container">
      {isPending ? <Loader></Loader>:(
         <div className="post_details-card">
          <img src={post?.imageUrl} alt="post
          " className="post_details-img"/>
          <div className='post_details-info'>
            <div className="flex-between w-full">
               <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-8 h-8 lg:h-12 rounded-full lg:w-12"
            />
  
           <div className='flex flex-col gap-1'>
            <p className="base-medium lg:body-bold text-light-1">
            {post?.creator.name}
            </p> <div className='flex-center gap-2 text-light-3'>
            <p className='subtle-semibold lg:small-regular'>
              {multiFormatDateString(post?.$createdAt)}
            </p>
            .
            <p className='subtle-semibold lg:small-regular'>
              {post?.location}
            </p>
          </div> 
        </div>
           </Link>
           <div className="flex-center  ">
            <Link to={`/update-post/${post?.$id}`} className={`${user.id !==post?.creator.$id && 'hidden'}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24}/>
            </Link>
            <Button className={`ghost_details_delete_btn ${user.id !==post?.creator.$id && 'hidden'}`} variant="ghost" onClick={handleclickdelete}>
              <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24}   />
            </Button>
           </div>
            </div>
            <hr className="w-full border  border-dark-4/80"/>
            <div className='small-medium lg:base-regular flex flex-col flex-1 w-full  '>
        <p>{post?.caption}</p>
        <ul className='flex gap-1 mt-2'>
          {post?.tags.map((tag:string)=>{
            <li key={`${tag}`} className='text-light-3'> #{tag}</li>
          })}
        </ul>
      </div>
      <div className="w-full ">
        <Poststats post={post } userId={user.id}></Poststats>
      </div>
      </div>
      </div>
      )}
     
    </div>
  )
}

export default PostDetails
