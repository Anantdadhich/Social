import { convertFileToUrl } from "@/lib/utils"
import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"

type ProfileProps={
    fieldChange:(files:File[])=>void,
    mediaUrl:string
}

const ProfileUploader = ({fieldChange,mediaUrl}:ProfileProps) => {

     const[file,setfile]=useState<File[]>([])
     const[fileurl,setfileurl]=useState<string>(mediaUrl)

     const onDrop=useCallback((accepteffiles:FileWithPath[])=>{
      setfile(accepteffiles)
      fieldChange(accepteffiles)
      setfileurl(convertFileToUrl(accepteffiles[0]))
     },[file])
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg" ,".svg"],
    },
  });

  return (
    <div {...getRootProps()}>
        <input className="cursor-pointer" {...getInputProps()} />
        <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileurl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
        </div>
    </div>
  )
}

export default ProfileUploader
