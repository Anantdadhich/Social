 
import { UseDeletepost, UseSavedpost, Uselikedpost, useGetCurrentUser } from '@/lib/react-query/queryandmutations';
import { checkIsLiked } from '@/lib/utils';
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react';
import Loader from './Loader';



type PostStatsProps={
post?:Models.Document;
userId:string;
}

const Poststats = ({post,userId}:PostStatsProps) => {
 const likelist=post?.likes.map((user:Models.Document)=>user.$id)
   const [likes,setlikes]=useState(likelist)
   const [saves,setsaves]=useState(false)

  const {mutate:likepost}=Uselikedpost();
  const {mutate:savepost,isPending:issavingpost}=UseSavedpost();
  const {mutate:deletepost,isPending:isdeletepost}=UseDeletepost();

  const {data:currentuser}=useGetCurrentUser()
   const savedpsotrecord=currentuser?.save.find((record:Models.Document)=>record.post.$id===post?.$id)

  useEffect(()=>{
   setsaves(!!savedpsotrecord)
  },[currentuser])
  const handlelikedpost=(e:React.MouseEvent)=>{
     e.stopPropagation();

     let newlikes=[...likes]
     const haslikes=newlikes.includes(userId)
     
      if(haslikes){
        newlikes=newlikes.filter((id)=>id!==userId)
      }
      else(
        newlikes.push(userId)
      )
      setlikes(newlikes)
      likepost({postId:post?.$id || '',likesArray:newlikes })
    }
    const handlesavedpost=(e:React.MouseEvent)=>{
       e.stopPropagation();

      
         
       if(savedpsotrecord){
        setsaves(false)
        deletepost(savedpsotrecord.$id)
       } else{
               savepost({postId:post?.$id ||'',userId})
       setsaves(true)
       }

    }
  


  return (
    <div className='flex justify-between items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <img src={`${checkIsLiked(likes,userId)?"/assets/icons/liked.svg":"/assets/icons/like.svg"}`} alt="like"
        width={20} height={20} className='cursor-pointer' onClick={handlelikedpost} />
     <p className='small-medium lg:base-medium' >{likes.length}</p>
      </div>
       <div className='flex gap-2 '>
      {issavingpost||isdeletepost ? <Loader></Loader> :  <img src={saves ? "/assets/icons/saved.svg" :"/assets/icons/save.svg"} alt="/saved"
        width={20} height={20} className='cursor-pointer' onClick={handlesavedpost} /> }
     <p className='small-medium lg:base-medium' ></p>
      </div>
    </div>
  )
}

export default Poststats
