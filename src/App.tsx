import Signin from './auth/forms/signin'
import './index.css'
import { Routes,Route } from 'react-router-dom'
import Home from './root/pages/Home'
import Signup from './auth/forms/Signup'
import Authlayout from './auth/Authlayout'
import Rootlayout from './root/Rootlayout'
import { Toaster } from "@/components/ui/toaster"

import Explore from './root/pages/Explore'
import Saved from './root/pages/saved'
import Allusers from './root/pages/Allusers'
import Createpost from './root/pages/Createpost'
import Editpost from './root/pages/Editpost'
import PostDetails from './root/pages/PostDetails'
import Profile from './root/pages/Profile'
import Updateprofile from './root/pages/Updateprofile'

const App = () => {
  return (
   <main className="h-screen flex">
      <Routes>
       {/*public routes     */}
       
       <Route element={<Authlayout></Authlayout>}>  
        <Route path='/signin' element={<Signin></Signin>}></Route>
          <Route path='/signup' element={<Signup></Signup>}></Route>
       </Route>
      {/* private route    */}

     <Route element={<Rootlayout></Rootlayout>}>
            <Route index element={<Home></Home>}></Route>
                      <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<Allusers />} />
          <Route path="/create-post" element={<Createpost />} />
          <Route path="/update-post/:id" element={<Editpost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<Updateprofile />} />
     
     </Route>    

      </Routes>
     <Toaster></Toaster>
   </main>
  )
}

export default App
