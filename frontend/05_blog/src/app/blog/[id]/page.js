"use client"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { viewDetails } from "@/app/store/slices/BlogSlice";
import { useParams } from "next/navigation";
import Link from "next/link";
export default function BlogDetails(){
    const { id } = useParams(); 
    const dispatch = useDispatch();
    const blogDetails = useSelector((state) => state.blog.blogDetails);
    console.log("--------")
    // console.log("blogDEtailas",blogDetails.tags)
    console.log("--------")
    const loading = useSelector((state) => state.blog.loading);
    const error = useSelector((state) => state.blog.error);
    console.log("id2", id)

    useEffect(() => {
        dispatch(viewDetails(id));
    }, [dispatch, id]);

    return (
        <div>
            <h1>Blog Details</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div className="border p-4 rounded bg-gray-200">
                <h2 className="font-medium text-lg text-black">{blogDetails?.title}</h2>
                <div >
                <p className="text-gray-600 mb-3">{blogDetails?.content}</p>
                <p className="text-gray-600 mb-3">Created at: {blogDetails?.created_at}</p>
                {Array.isArray(blogDetails?.tags) && blogDetails.tags.filter(tag => tag)?.length > 0 ? (
  <p className="text-gray-600 mb-3">Tags: {blogDetails.tags.filter(tag => tag).join(", ")}</p>
) : (
  <p className="text-gray-600 mb-3">No tags</p>
)}

                </div>
                <Link 
                href={`/`}
                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm inline-block"
              >
                Go back to list
              </Link>
            </div>
        </div>
    );
}