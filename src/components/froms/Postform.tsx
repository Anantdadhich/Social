
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Textarea } from "../ui/textarea"
import Fileuploder from "../shared/Fileuploder"
import { Input } from "@/components/ui/input"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import {useuserContext} from '@/context/authcontext'
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreatePost, useupdatepost } from "@/lib/react-query/queryandmutations"


 
type PostFormProps={
post?: Models.Document;
 action:'Create' | 'Update'; 
};

const Postform = ({post,action}:PostFormProps) => {
   const {mutateAsync:createPost,isPending:isLoadingCreate}=useCreatePost();
   const {mutateAsync:updatePost,isPending:isLoadingUpdate}=useupdatepost();
  const {user}=useuserContext()
  const {toast}=useToast()
  const navigate=useNavigate()

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

 async function onSubmit(value: z.infer<typeof PostValidation>) {
    try {
      if(post && action==='Update'){
        const updatedpost=await updatePost({
          ...value,
          postId:post.$id,
          imageId:post?.imageId,
          imageUrl:post?.imageUrl,
        })
        if(!updatedpost){
          toast({title:"please try again"})
        }
        return navigate(`/posts/${post.$id}`)
      }

       const newpost=await createPost({
      ...value,
      userId:user.id 
     })
     if(!newpost){
      toast({
        title:"please try again"
      })

     }
        navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
  <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <Fileuploder
                  fieldchange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                 Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
     <div className="flex  gap-4 items-center justify-end ">
       <Button type="button" className="shad-button_dark_4"> Cancel</Button>
        <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate ||isLoadingUpdate}> {isLoadingCreate ||isLoadingUpdate && 'Submitting...' } {action}post </Button>
     </div>
      </form>
    </Form> 
  
  )
}
export default Postform

