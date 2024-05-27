import Bottombar from "@/components/shared/Bottombar"
import Leftbar from "@/components/shared/Leftbar"
import Topbar from "@/components/shared/topbar"
import { Outlet } from "react-router-dom"


const Rootlayout = () => {
  return (
    <div className="w-full md:flex">
<Topbar></Topbar>
<Leftbar></Leftbar>
<section className="flex h-full flex-1">
  <Outlet></Outlet>
</section>
<Bottombar></Bottombar>
    </div>
  )
}

export default Rootlayout
