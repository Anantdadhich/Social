import Postform from '@/components/froms/Postform'
import Loader from '@/components/shared/Loader'
import { useGetpostbyid } from '@/lib/react-query/queryandmutations'
import { useParams } from 'react-router-dom'


const Editpost = () => {
const {id}=useParams()
const {data:post,isPending}=useGetpostbyid(id||'') 
if(isPending) return <Loader></Loader>

  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='max-w-5xl flex-start gap-3 justify-start w-full '>
          <img src="/assets/icons/add-post.svg" alt="edit" 
          width={36}
          height={36}/>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Edit post</h2>
        </div>
         {isPending ? <Loader /> : <Postform action="Update" post={post} />}
      </div>
      
    </div>
  )
}

export default Editpost
