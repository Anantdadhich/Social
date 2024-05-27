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
import { SignupValidation } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"

import {  UseCreateUseraccount, UseSigninaccount} from "@/lib/react-query/queryandmutations"
import { useuserContext } from "@/context/authcontext"



const Signup = () => {


  const {toast}=useToast()
  const navigate=useNavigate();
  const {checkAuthUser,isLoading: isUserLoading}=useuserContext()
  
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:'',
      username: '',
      email:'',
      password:''

    },
  })

   const {mutateAsync:createUserAccount,isPending:iscreatinguser}=UseCreateUseraccount()
   const {mutateAsync:Signinaccount,isPending:issigninaccount}=UseSigninaccount()
 

 async function onSubmit(user: z.infer<typeof SignupValidation>) {
     try {
      const newuser= await createUserAccount(user);
       if(!newuser){
        return toast({title:'sign-up failed please try again'})
       }
       const newsession=await Signinaccount({
        email:user.email,
        password:user.password,
       })
        if(!newsession){
         toast({title:'sign-in failed please try again'})
         navigate('/signin');
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
      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a New Account</h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">Enter your Details </p>


    <form onSubmit={form.handleSubmit(onSubmit)} className=" flex flex-col gap-5 w-full mt-4">
     <FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input type="text" className="shad-input" {...field} />
      </FormControl>
    
      <FormMessage />
    </FormItem>
  )}
/>
  <FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input type="text" className="shad-input" {...field} />
      </FormControl>
    
      <FormMessage />
    </FormItem>
  )}
/>
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
  {iscreatinguser||issigninaccount||  isUserLoading ?( <div className="flex-center gap-2">
      <Loader></Loader>  Loading..
</div> ):"Sign Up" } 
</Button>
<p className=" text-small-regular text-light-2 text-center mt-2"> Already have an account 
<Link to="/signin" className="text-primary-500 text-small-semibold ml-1"> Log in </Link>
</p>
    </form>
        </div>
   </Form>

  )
}

export default Signup
