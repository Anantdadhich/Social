
import Loader from "./Loader"
import GridPostList from "./GridPostList"

type SearchResultsProps={
  isSearchFetching:boolean,
  searchedPosts:any
}

const SearchResults = ({isSearchFetching,searchedPosts}:SearchResultsProps) => {
   if(isSearchFetching) return <Loader></Loader>

    if (searchedPosts && searchedPosts.documents.length >0) {
      return (
        <GridPostList posts={searchedPosts.documents}></GridPostList>
      )
    }
  return (
   <p className="text-light-4 mt-10 text-center w-full " >No results</p>
  )
}

export default SearchResults
