import Loader from '@/components/shared/Loader'
import UserCard from '@/components/shared/UserCard'
import { useToast } from '@/components/ui/use-toast'
import { useGetuser } from '@/lib/react-query/queryandmutations'


const Allusers = () => {
  const {toast}=useToast()
  const {data:creators,isLoading,isError:isErrorCreators}=useGetuser()

  if(isErrorCreators){
    toast({title:"something went wrong"})
    return 
  }
  return (
    <div className='common-container'>
      <div className='user-container'>
        <h2 className='h3-bold md:h2-bold text-left w-full '>All Users</h2>
        {isLoading && !creators ?(
          <Loader></Loader>
        ):(
          <ul className='user-grid'>
            {creators?.documents.map((creator)=>(
              <li key={creator?.$id} className='flex-1 min-w-[200px] w-full'>
                <UserCard user={creator}></UserCard>
              </li>
            ))}
          </ul>
        ) }
      </div>
    </div>
  )
}

export default Allusers
