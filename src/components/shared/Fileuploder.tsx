import  {useCallback, useState} from 'react';
import {FileWithPath, useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
type FileUploderProps={
  fieldchange:(FILES:File[])=>void;
  mediaUrl:string;

}
//we made a function which handles the file uploads it takes array of file objects
const Fileuploder = ({fieldchange,mediaUrl}:FileUploderProps) => {
  const [file,setfile]=useState<File[]>([]) //we made an array of file objects represent the to dropped files
  const [previewUrl,setfileurl]=useState(mediaUrl)
  const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
     setfile(acceptedFiles);
     fieldchange(acceptedFiles);
     setfileurl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])
  const {getRootProps, getInputProps} = useDropzone({onDrop,accept:{
    'image/*':['.png','.jpeg','.svg','.jpg']
  }})
  return (
 <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
        previewUrl ?( <>
          <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
             <img src={previewUrl} alt="image"  className='file_uploader-img'/>
            
          </div>
           <p className='file_uploader-label'>Click or drag to photo replace</p>
          </>
        ):(
          <div className='file_uploader-box'>
         <img src="/assets/icons/file-upload.svg" alt="file-upload" width={96} height={77}  />
            <h3 className='base-medium text-light-2 mb-2 mt-6 '>Drag photo here</h3>
            <p className='text-light-4 small-regular mb-6'>SVG,PNG,JPG</p>
            <Button className='shad_button_dark_4'>select from device</Button>
          </div>
        )
      }
    </div>
  )
}

export default Fileuploder
