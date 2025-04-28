"use client";
import { useDispatch,useSelector } from "react-redux";
import { getBlogList,deleteBlog} from "@/app/store/slices/BlogSlice";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const dispatch = useDispatch();
  const blog = useSelector((state)=>state.blog.blog);
  const create_blog = useSelector((state)=>state.blog.create_blog);
  const loading = useSelector((state)=>state.blog.loading);
  const flag = useSelector((state)=>state.blog.flag);
  const error = useSelector((state)=>state.blog.error);
  console.log("blogu",blog)
  useEffect(()=>{
    if(!flag){
      dispatch(getBlogList());
    }
    
  },[dispatch,flag]);

  const handle_delete=(id)=>{
    dispatch(deleteBlog(id))
    dispatch(getBlogList())
  }


  return (
  <div>
    <h1>Blog List</h1>
    
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="flex flex-col gap-2">
        <Link href="/blog/create" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
          Create Blog
        </Link>
        {blog.map((item) => (
          <div key={item.blog_id} className="border p-4 rounded bg-gray-200">
            <Link href={`/blog/${item.blog_id}`} className="font-medium text-lg hover:underline block mb-2 text-black">
              {item.title}
            </Link>
            <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>
            <div className="flex gap-2">
              <Link 
                href={`/blog/${item.blog_id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm inline-block"
              >
                View
              </Link>
              <Link 
                href={`/blog/edit/${item.blog_id}`}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm inline-block"
              >
                Edit
              </Link>
              <button 
                onClick={() => handle_delete(item.blog_id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

  </div>
  );
}
