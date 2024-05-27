import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { useGetCurrentUser } from '@/lib/react-query/queryandmutations'


const LikedPosts = () => {
const {data:currentUser}=useGetCurrentUser()

if(!currentUser){
  return(
    <div className='flex-center w-full h-full'>
      <Loader></Loader>
    </div>
  )
}

  return (
    <div className=''>
      {currentUser.liked.length===0 &&(
        <p className='text-light-4'>no liked posts</p>
      )}

      <GridPostList posts={currentUser.liked} showstats={false}></GridPostList>
    </div>
  )
}

export default LikedPosts
