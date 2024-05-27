import { useuserContext } from "@/context/authcontext"
import { Models } from "appwrite"

import { Link } from "react-router-dom"
import Poststats from "./Poststats"



type GridPostsProps={
    posts:Models.Document[],
    showuser?:boolean,
    showstats?:boolean
}

const GridPostList = ({posts,showuser=true,showstats=true}:GridPostsProps) => {
    const {user}=useuserContext()
  return (
 <ul className="grid-container">
    {posts.map((post)=>(
        <li key={post.$id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img src={post.imageUrl} alt="post" className="h-full w-full object-cover" />
            </Link>
            <div className="grid-post_user">
                {showuser &&(
                    <div className="flex flex-1 gap-2 items-center justify-start">
                        <img src={post.creator.imageUrl} alt="creator" className="h-8 w-8 rounded-full" />
                        <p className="line-clamp-1">{post.creator.name}</p>
                    </div>
                )}
                {showstats && <Poststats post={post} userId={user.id}></Poststats>}
            </div>
        </li>
    ))}
 </ul>
  )
}

export default GridPostList
