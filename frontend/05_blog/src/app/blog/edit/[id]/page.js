"use client";
import {  useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch,useSelector } from "react-redux";
import {editBlog,viewDetails} from "@/app/store/slices/BlogSlice";
import { useParams } from "next/navigation";
export default function EditBlogForm (){
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const  router = useRouter();    
    const dispatch = useDispatch();
    const blog = useSelector((state)=>state.blog.blog);
    const blogDetails = useSelector((state)=>state.blog.blogDetails);
    // console.log("blogDetails",blogDetails)
    // console.log("blogieiei",blog)
    const loadings = useSelector((state)=>state.blog.loading);
    const error = useSelector((state)=>state.blog.error);

  useEffect(()=>{
    if(id){
        dispatch(viewDetails(id));
    }
  },[id,dispatch])

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: blogDetails?.title || '',
            content: blogDetails?.content || '' ,
            status: blogDetails?.status || '',
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("Title is required"),
            content: Yup.string().trim().required("content is required"),
            status: Yup.boolean().required("Status is required"),
                
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setLoading(true);
                const data = {
                    blog_id: id,
                    title: values.title,
                    content: values.content,
                    status: values.status,
                }
                console.log("data1",data)
                const res = await dispatch(editBlog(data));
                console.log("ful",res.meta)
                if(res.meta.requestStatus ==="fulfilled"){
                    console.log("Blog Edited");
                    alert("Edited Successfully");
                    resetForm();
                    router.push("/");
                }       
            } catch (err) {
                console.error(err);
            } finally {
               setLoading(false);
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Blog Post</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Title</label>
                    <input type="text" name="title" placeholder="Enter title"
                        className=" text-black w-full border border-gray-900 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                    />
                    {formik.touched.title && formik.errors.title && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Content</label>
                    <textarea name="content" placeholder="Enter body content"
                        className="text-black w-full border border-gray-300 rounded px-3 py-2 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.content}
                    ></textarea>
                    {formik.touched.content && formik.errors.content && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.content}</div>
                    )}
                </div>
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Status</label>
                    <input
                        type="checkbox"
                        name="status"
                        checked={formik.values.status}
                        onChange={() => formik.setFieldValue("status", !formik.values.status)}  // Toggle status on checkbox change
                        className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    {formik.touched.status && formik.errors.status && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
                    )}
                </div>
                <button type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    {loading ? (
                        <p>Loading..</p>
                        
                    ) : "Submit"}
                </button>
            </form>
        </div>
    );
};

