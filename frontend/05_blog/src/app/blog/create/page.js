"use client";
import {  useState,useEffect } from "react";
import { useFormik,Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch,useSelector } from "react-redux";
import {createBlog,fetchTags} from "@/app/store/slices/BlogSlice";

export default function CreateBlogPostForm (){
    const [loading, setLoading] = useState(false);
    const  router = useRouter();    
    const dispatch = useDispatch();
  const blog = useSelector((state)=>state.blog.blog);
  const loadings = useSelector((state)=>state.blog.loading);
  const error = useSelector((state)=>state.blog.error);
  const tags = useSelector((state)=>state.blog.tags);
  console.log("tags",tags)
  // const tagsLoading = useSelector((state) => state.tags.loading);

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);
    const formik = useFormik({
        initialValues: {
            title: "",
            content: "",
            tags:[]
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("Title is required"),
            content: Yup.string().trim().required("Content is required")
        }),
        
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                setLoading(true);
                const data = {
                    title: values.title,
                    content: values.content,
                    status: values.status,
                    tags: values.tags.map((tag) => parseInt(tag, 10))
                }
                console.log(data)
                const result = await dispatch(createBlog(data));
            if (result.meta.requestStatus === "fulfilled") {
                resetForm();
                router.push("/");
            } else {
                console.error('Failed to create blog:', result.error.message);
            }
                // window.location.href = "/";
            } catch (err) {
                console.error(err);
                // toast.error("Failed to create blog post.");
            } finally {
                setLoading(false);
                setSubmitting(false);
            }
        },
    });

    

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">



            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Blog Post</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Title</label>
                    <input type="text" name="title" placeholder="Enter title"
                        className="text-black w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
  <label className="block text-gray-700 mb-2">Tags</label>
  {tags && tags.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {tags[0].map((tag, index) => (
        <label key={index} className="text-black flex items-center">
          <input
            type="checkbox"
            name={`tags`}
            value={tag.tag_id}
            checked={formik.values.tags.includes(tag.tag_id.toString())}
            onChange={() => {
              const currentTags = [...formik.values.tags];
              const tagId = tag.tag_id.toString();
              
              if (currentTags.includes(tagId)) {
                // Remove tag if already selected
                formik.setFieldValue(
                  "tags",
                  currentTags.filter(id => id !== tagId)
                );
              } else {
                // Add tag if not selected
                formik.setFieldValue("tags", [...currentTags, tagId]);
              }
            }}
          />
          <span className="ml-2">{tag.tag_name}</span>
        </label>
      ))}
    </div>
  ) : (
    <p>Loading tags...</p>
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

