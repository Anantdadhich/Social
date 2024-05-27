import { useMutation, useQuery, useQueryClient,useInfiniteQuery} from "@tanstack/react-query"
import { CreatePost,    GetUsers,   GetuserByid,   SavePost,   SearchPostterm,   Updateuser,   createUserAccount,  deleteSavePost,  deletepost,  getCurrentUser,  getInfinitePosts,  getPostById,  getRecentPosts, likePost, signInAccount, signOutAccount, updatePost, } from "../appwrite/api"
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types/types"
import { QUERY_KEYS } from "@/lib/react-query/keys"





export const UseCreateUseraccount=()=>{
    return useMutation({
        mutationFn:(user:INewUser)=>createUserAccount(user)
    })
    
}
export const UseSigninaccount=()=>{
    return useMutation({
        mutationFn:(user:{email:string,
            password:string
        })=>signInAccount(user)
    })
    
}
export const UseSignoutaccount=()=>{
    return useMutation({
        mutationFn:signOutAccount
    })
    
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => CreatePost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};


export const userecentposts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const UseSavedpost=()=>{
  const queryClient=useQueryClient();  //state managnet libraary uses 
  return useMutation({
    mutationFn:({postId,userId}:{postId:string,userId:string})=>SavePost(postId,userId),
    onSuccess:() =>{
     
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
      })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
    },
  })
}

export const Uselikedpost=()=>{
  const queryClient=useQueryClient();  //state managnet libraary uses 
  return useMutation({
    mutationFn:({postId,likesArray}:{postId:string,likesArray:string[]})=>likePost(postId,likesArray),
    onSuccess:(data) =>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
      }) 
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
      })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
    },
  })
}

export const UseDeletepost=()=>{
  const queryClient=useQueryClient();  //state managnet libraary uses 
  return useMutation({
    mutationFn:(savedrecordid:string)=>deleteSavePost(savedrecordid),
    onSuccess:() =>{
     
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
      })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
    },
  })
}

export const useGetCurrentUser=()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_CURRENT_USER],
    queryFn:getCurrentUser
  })
}
export const useGetpostbyid=(postId:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
    queryFn:()=>getPostById(postId),
    enabled:!!postId
  })
}
export const useupdatepost=()=>{
  
  const queryClient=useQueryClient()
  return useMutation({

    mutationFn:(post:IUpdatePost)=>updatePost(post),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
      })
    }

  })
}
export const usedeletepost=()=>{
  
  const queryClient=useQueryClient()
  return useMutation({

    mutationFn:({postId,imageId}:{  postId:string,imageId:string })=>deletepost(postId,imageId),
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
      })
    }

  })
}
export const useGetposts=()=>{
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts  ,
     //@ts-ignore
        getNextPageParam: (lastPage) => {
        
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

  
      const lastId = lastPage?.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
}


export const useSearchPosts=(Searchterm:string)=>{
return useQuery({
  queryKey:[QUERY_KEYS.SEARCH_POSTS,Searchterm],
  queryFn:()=>SearchPostterm(Searchterm),
  enabled:!!Searchterm
})
}

export const useGetuser=(limit?:number)=>{
return useQuery({
  queryKey:[QUERY_KEYS.GET_USERS],
  queryFn:()=>GetUsers(limit)
})
}

export const useGetuserbyid=(userId:string)=>{
 return useQuery({
  queryKey:[QUERY_KEYS.GET_USER_BY_ID,userId],
  queryFn:()=>GetuserByid(userId),
  enabled:!!userId
 })
}
export const useUpdateuser=()=>{
  const queryClient=useQueryClient()
  return useMutation({
    mutationFn:(user:IUpdateUser)=>Updateuser(user),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
      })
      queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_USER_BY_ID,data?.$id]
      })
    }

  })
}
