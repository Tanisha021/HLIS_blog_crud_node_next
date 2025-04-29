import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {encrypt,decrypt} from "../../utilities/encdec"
import { secureFetch } from "@/app/utilities/secureFetch";
export const getBlogList = createAsyncThunk('blog/getBlogList', async () => {

    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/show-all-blogs";

    const response = await secureFetch(url, {},'POST', api_key);
    console.log("response",response)
    return response

//     const res = await fetch("http://localhost:3000/v1/user/show-all-blogs", {
//         method: 'POST',
//         headers: {
//             "api-key": "b6e9dd5755936ea772dbd0c652d1efa3",
//             "Content-Type": "text/plain",
//         }
// });
//     const encryptedData = await res.text();
//     const data_ = decrypt(encryptedData);
//     console.log("data1",data_.data);
//     return data_.data;
});
export const deleteBlog = createAsyncThunk('blog/deleteBlog', async (id) => {
    
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = "http://localhost:3000/v1/user/delete-blog";
    const data = {"blog_id": id}
    const response = await secureFetch(url,data,'POST',api_key)
    console.log("response",response)
    return response
    // const res = await fetch("http://localhost:3000/v1/user/delete-blog",{
    //     method: 'POST',
    //     headers: {
    //         "api-key": "b6e9dd5755936ea772dbd0c652d1efa3",
    //         "Content-Type": "text/plain",
    //     },
    //     body: encrypt(JSON.stringify({"blog_id": id})),
    // });
    // const encryptedData = await res.text();
    // const data_ = decrypt(encryptedData);
    // console.log("data- deleted-blog",data_);
    // return data_.data;
    
});
export const viewDetails = createAsyncThunk('blog/viewDetails', async (id) => {
    console.log("idd",id)
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/get-blog-details/${id}`;
    const data = {}
    const response = await secureFetch(url,data,'POST',api_key)
    console.log("response",response)
    return response

    // console.log("idd",id)
    // const res = await fetch(`http://localhost:3000/v1/user/get-blog-details/${id}`,{
    //     method: 'POST',
    //     headers: {
    //         "api-key": "b6e9dd5755936ea772dbd0c652d1efa3",
    //         "Content-Type": "text/plain",
    //     }
    // });
    // console.log("respp",res)
    // const encryptedData = await res.text();
    // const data_ = decrypt(encryptedData);
    // console.log("data-view-details",data_.data);
    // return data_.data;
});
export const createBlog = createAsyncThunk('blog/createBlog', async (blog) => {
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/create-blog`;
    const transformedBlog = {
        ...blog,
        tag_id: blog.tags 
      };
    const response = await secureFetch(url,transformedBlog,'POST',api_key)
    console.log("response",response)
    return response

    
    // const res = await fetch("http://localhost:3000/v1/user/create-blog", {
    //     method: 'POST',
    //     headers: {
    //         "api-key": "b6e9dd5755936ea772dbd0c652d1efa3",
    //         "Content-Type": "text/plain",
    //     },
    //     body: encrypt(JSON.stringify(transformedBlog))
    // });
    // const encryptedData = await res.text();
    // const data_ = decrypt(encryptedData);
    // console.log("data-view-details",data_.data);
    // return data_.data;
});
export const editBlog = createAsyncThunk('blog/editBlog',async(blog)=>{
    const { blog_id, title, content, status } = blog;
    const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/update-blog/${blog_id}`;
    const data={
        title, content, status
    }

    const response = await secureFetch(url,data,'POST',api_key)
    console.log("response",response)
    return {
        ...response,
        id: parseInt(blog_id) 
    };


    // console.log("blog1",blog)
    
    // const res = await fetch(`http://localhost:3000/v1/user/update-blog/${blog_id}`,{
    //     method: 'POST',
    //     headers: {
    //         "api-key": "b6e9dd5755936ea772dbd0c652d1efa3",
    //         "Content-Type": "text/plain",
    //     },
    //     body: encrypt(JSON.stringify({ title, content, status }))
    // });
    
    // const encryptedData = await res.text();
    // const data_ = decrypt(encryptedData);
    // console.log("data-edit-blog",data_.data);
    
})
export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
    try {
        const api_key = "b6e9dd5755936ea772dbd0c652d1efa3";
    const url = `http://localhost:3000/v1/user/get-tags`;
    const data = {}
    const response = await secureFetch(url,data,'POST',api_key)
    console.log("response",response)
    return response

        // const response = await fetch('http://localhost:3000/v1/user/get-tags', {
        //     method: 'POST',
        //     headers: {
        //         "api-key": "b6e9dd5755936ea772dbd0c652d1efa3",
        //         "Content-Type": "text/plain",
        //     }
        // });

        // const encryptedData = await response.text();
        // const data_ = decrypt(encryptedData);
        // console.log("data-tags",data_.data);
        return data_.data; 
    } catch (error) {
        console.error('Error fetching tags:', error);
        throw new Error('Failed to fetch tags');
    }
});

const initialState = {
    value:0,
    blog:[],
    blogDetails:null,
    create_blog:[],
    flag:false,
    loading: false,
    error: null,
    tags: [],
};

const BlogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {

    },
    extraReducers:(builder)=>{
        builder.addCase(getBlogList.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getBlogList.fulfilled,(state, action)=>{
            state.loading = false;
            state.blog = action.payload;
        })
        .addCase(getBlogList.rejected,(state, action)=>{
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(deleteBlog.pending, (state) => {
            state.loading = true;
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.blog = state.blog.filter((blog) => blog.id !== action.payload);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            })
        .addCase(viewDetails.pending, (state) => {
            state.loading = true;
        })
        .addCase(viewDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.blogDetails = action.payload;
        })
        .addCase(viewDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(createBlog.pending, (state) => {
            state.loading = true;
        })
        .addCase(createBlog.fulfilled, (state, action) => {
            state.loading = false;
            state.create_blog = [...state.blog, action.payload];
            // state.blog.push(action.payload);
        })
        .addCase(createBlog.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
            .addCase(editBlog.pending, (state) => {
                state.loading = true;
                })
            .addCase(editBlog.fulfilled,(state,action)=>{
                state.loading=false
                const index = state.blog.findIndex((blog) => blog.id === action.payload.id);
                console.log("---------11",action.payload)
                if (index !== -1) {
                    state.blog[index] = action.payload;
                    state.flag = true;
                }
            
                })
                .addCase(editBlog.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                    console.log("ERROR")
                    console.log(action.error.message)
                })
                .addCase(fetchTags.pending, (state) => {
                    state.loading = true;
                })
                .addCase(fetchTags.fulfilled, (state, action) => {
                    state.loading = false;
                    state.tags.push(action.payload);
                })
                .addCase(fetchTags.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.error.message;
                });
        
    }
});

export const { listBlog } = BlogSlice.actions;
export default BlogSlice.reducer;