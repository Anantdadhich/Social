
import { ID, Query } from 'appwrite';
import { appwriteConfig, account, databases, storage, avatars } from './config';


import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types/types';



export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
      
        );

        if (!newAccount) {
            throw new Error("Failed to create account");
        }

        const avatarUrl = avatars.getInitials(user.name);
        const newUser = await saveToDb({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        });
        return newUser;
    } catch (error) {
        console.log("Error creating account:", error);
         return error
    }
}

export async function saveToDb(user: {
   accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUsers = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );
        return newUsers;
    } catch (error) {
        console.log("Error saving user to database:", error);
       
    }
}

export async function signInAccount(user: {
    email: string;
    password: string;
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.log("Error signing in:", error);
        
    }
}

export  function getAccount() {
    try {
        const currentAccount =  account.get();
        return currentAccount;
    } catch (error) {
        console.log("Error getting account:", error);
        
}}


export async function getCurrentUser() {
    try {
           console.log('Getting current account...');
        const currentAccount = await getAccount();
           console.log('Current account:', currentAccount);
        if (!currentAccount) throw  Error("No current account found");
        

   const currentUser = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
);
  
  
        if (!currentUser)   throw Error("No current user found");

        return currentUser.documents[0];
    } catch (error) {
        console.log("Error getting current user:", error);
        return null;
    }
}


export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log("Error signing out:", error)
        
    }
}

export async function CreatePost(post: INewPost) {
    try {
        const uploadedFile = await uploadFile(post.file[0]);
        if (!uploadedFile) {
            throw Error("Failed to upload file");
        }

        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw  Error("Failed to get file preview");
        }

          const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw  Error("Failed to create post");
        }
        return newPost;
    } catch (error) {
        console.log("Error creating post:", error);
        
    }
}

export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log("Error uploading file:", error);
       
    }
}

export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            'top',
            100
            
            
        );
     
        return fileUrl;
    } catch (error) {
        console.log("Error getting file preview:", error);
       
    }
}

export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
        return { status: "ok" };
    } catch (error) {
        console.log("Error deleting file:", error);
      
    }
}

export async function getRecentPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );
        if (!posts)   throw Error("No recent posts found");
        return posts;
    } catch (error) {
        console.log("Error getting recent posts:", error);
       
    }
}
export async function likePost(postId:string,likesArray:string[]){
    try {
        const updatepost=await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes:likesArray
            }
        )
        if(!updatepost) throw Error
        return updatepost
    } catch (error) {
        console.log(error)
    }
}

export async function SavePost(postId:string,userId:string){
    try {
        const updatepost=await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
             ID.unique(),
            {
                user:userId,
                post:postId
            }
        )
        if(!updatepost) throw Error
        return updatepost
    } catch (error) {
        console.log(error)
    }
}
export async function deleteSavePost(savedrecordid:string){
    try {
        const savessession=await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedrecordid
          
        )
        if(!savessession) throw Error
        return {status:"ok"}
    } catch (error) {
        console.log(error)
    }
}
export async function getPostById(postId:string){
    try {
        const post=await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        if(!post) throw Error
        return post
    } catch (error) {
         console.log(error)
    }
}

export async function updatePost(post: IUpdatePost) {
   const hasflieupdated=post.file.length>0
    try {
        let image={
            imageUrl:post.imageUrl,
            ImageId:post.imageId
        }
        if(hasflieupdated){
              const uploadedFile = await uploadFile(post.file[0]);
              if (!uploadedFile) {
            throw Error("Failed to upload file");
        }
        
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw  Error("Failed to get file preview");
        }
        image={...image,imageUrl:fileUrl,ImageId:uploadedFile.$id}
        }
        


          const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
              post.postId,
            {
         
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.ImageId,
        location: post.location,
        tags: tags,
      }
        );

        if (!updatedPost) {
            await deleteFile(post.imageId);
            throw  Error("Failed to create post");
        }
        return updatedPost;
    } catch (error) {
        console.log("Error creating post:", error);
        
    }
}
export async function deletepost(postId:string,imageId:string){
   if(!postId || !imageId) throw Error

   try {
    await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        postId

   )
   return {status:"ok"}
   } catch (error) {
    console.log(error)
   }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function SearchPostterm(Searchterm:string){
   
      
   
    try {
    const posts=await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.search('caption',Searchterm)]
    )
    if(!posts) throw Error
    return posts
    } catch (error) {
      console.log(error)  
    }
}

export  function GetUsers(limit?:number){
  const queries:any[]=[Query.orderDesc("$createdAt")]
  if(limit){
    queries.push(Query.limit(limit))
  }

  try {
    const users =databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        queries
    )
    if(!users) throw Error
    return users
  } catch (error) {
    console.log(error)
  }
}
export async function GetuserByid(userId:string) {
      try {
    const users =databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
    )
    if(!users) throw Error
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function Updateuser(user:IUpdateUser){
    const hasfiletoupdate=user.file.length >0
    try {
        let image={
            imageUrl:user.imageUrl,
            imageId:user.imageId
        }
        if(hasfiletoupdate){
            const updatedfile=await uploadFile(user.file[0])
            if(!updatedfile) throw Error

            const fileurl=getFilePreview(updatedfile.$id)
            if(!fileurl){
                await deleteFile(updatedfile.$id)
                throw Error
            }
               image = { ...image, imageUrl: fileurl, imageId: updatedfile.$id };
        }
        const updateduser=await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name:user.name,
                bio:user.bio,
                imageUrl:user.imageUrl,
                imageId:user.imageId
            }
        )
        if(!updateduser){
            if(hasfiletoupdate){
                await deleteFile(image.imageId)
            }
            throw Error
        }
        if(user.imageId && hasfiletoupdate){
            await deleteFile(user.imageId)
        }
        return updateduser
    } catch (error) {
      console.log(error)  
    }
}
