
import { useuserContext } from '@/context/authcontext'
import { Outlet,Navigate } from 'react-router-dom'

const Authlayout = () => {
  const  {isAuthenticated}  = useuserContext();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

         
        </>
      )}
    </>
  )
}

export default Authlayout
