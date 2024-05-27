import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"// it itnegrates with aod schems that is react hook form
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"

import {  UseSigninaccount} from "@/lib/react-query/queryandmutations"
import { useuserContext } from "@/context/authcontext"



const Signin = () => {
const {toast}=useToast()
  const navigate=useNavigate();
  const {checkAuthUser,isLoading:isUserloading}=useuserContext()

     const {mutateAsync:Signinaccount,isError}=UseSigninaccount()
  
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email:'',
      password:''

    },
  })

  

 
 async function onSubmit(user: z.infer<typeof SigninValidation>) {
     try {
       const newsession=await Signinaccount(user)
        if(!newsession){
         toast({title:'sign-in failed please try again'})
         return
       }
       const loogedin=await checkAuthUser();
       if(loogedin){
        form.reset()
        navigate('/')
       }else{
        toast({title:'not loged'})
        return
       }
  
     } catch (error) {
         console.log(error)
     }
    }

  return (
  
   <Form {...form}>
    <div className="sm:w-420 flex-center flex-col">
      <img  src="/assets/images/logo.svg"  alt="logo" />
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Loged in</h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back!Enter your Details </p>


    <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-5 w-full mt-4">
  <FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" className="shad-input" {...field} />
      </FormControl>
    
      <FormMessage />
    </FormItem>
  )}
/>
  <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input type="password" className="shad-input" {...field} />
      </FormControl>
    
      <FormMessage />
    </FormItem>
  )}
/>
<Button type="submit" className="shad-button_primary">
  { isError|| isUserloading ?( <div className="flex-center gap-2">
      <Loader></Loader>  Loading..
</div> ):("Sign In") } 
</Button>
<p className=" text-small-regular text-light-2 text-center mt-2"> To create an account 
<Link to="/signup" className="text-primary-500 text-small-semibold ml-1">Sign up </Link>
</p>
    </form>
        </div>
   </Form>

  )
}

export default Signin
