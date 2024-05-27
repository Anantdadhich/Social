import React from "react"
import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import SearchResults from "@/components/shared/SearchResults"
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce"
import {  useGetposts, useSearchPosts } from "@/lib/react-query/queryandmutations"
import { useEffect, useState } from "react" 
import { useInView } from "react-intersection-observer"

const Explore = () => {
  const {ref,inView}=useInView()
  const [searchvalue, setsearchvalue] = useState(""); // Initial state is empty string
 const { data: posts, hasNextPage,fetchNextPage  } = useGetposts();;
  const debouncedSearchValue = useDebounce(searchvalue.trim(), 500); // Consider lower debounce time
  const { data: searchedPosts, isFetching:isSearchFetching } = useSearchPosts(debouncedSearchValue);
  
  
   useEffect(()=>{
    if(inView && !searchvalue) {
      fetchNextPage()
    }
   },[inView,searchvalue])
  
  
  if(!posts){
      return <div className="flex-center h-full w-full">
        <Loader></Loader>
      </div>
    }
  const showSearchResults = searchvalue.trim() !== ""
  const shouldshowposts=!showSearchResults && posts?.pages.every((item)=>item?.documents.length===0)
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full ">Search Posts</h2>
        <div className="flex gap-1 rounded-lg w-full px-4 bg-dark-4">
          <img src="/assets/icons/search.svg" alt="search" width={24}height={24} />
          <Input type="text" placeholder="Search" className="explore-search" value={searchvalue}
          onChange={(e)=>setsearchvalue(e.target.value)}></Input>
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
          <h3 className="body-bold md:h3-bold ">Popular Today</h3>
          <div className="flex-center rounded-xl bg-dark-3 px-4 py-2 cursor-pointer">
            <p className="small-medium md:base-medium text-light-2">All</p>
            <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
          </div>
      </div>
      
   
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {showSearchResults ? (
          <SearchResults
   isSearchFetching ={isSearchFetching} 
   searchedPosts={searchedPosts}
          />
        ) : shouldshowposts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
             <React.Fragment key={`page-${index}`}>
    {item && <GridPostList key={`page-${index}`} posts={item.documents} />}
  </React.Fragment>
          ))
        )}
      </div>
      {hasNextPage && !searchvalue &&(
        <div ref={ref} className="mt-10">
          <Loader></Loader>
        </div>
      )}
    </div>
  )
}

export default Explore
