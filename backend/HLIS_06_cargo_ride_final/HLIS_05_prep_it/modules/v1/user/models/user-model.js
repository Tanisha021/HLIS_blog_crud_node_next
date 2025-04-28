const database = require("../../../../config/database");
const common = require("../../../../utilities/common");
const response_code = require("../../../../utilities/response-error-code");
const { t } = require("localizify");

class UserModel {
    
    async createBlog(request_data) {
        try {
            const { title, content, tag_id } = request_data;

            const blogData = {title,content}
            const insertBlogQuery = `insert into tbl_blog set ?`
            const [blogResult] = await database.query(insertBlogQuery, [blogData]);
            const blog_id = blogResult.insertId;

            const tags = tag_id;
            const insertTagsQuery = `insert into tbl_rel_blog_tags (blog_id, tag_id) values ?`;

            const tagValues = tags.map(tag => [blog_id, tag]);
            if(tagValues.length > 0) {
                await database.query(insertTagsQuery, [tagValues]);
            }

            return{
                code: response_code.SUCCESS,
                message: t('task_created_successfully'),
                data: { blog_id, title, content, tag_ids: tags }
            }

        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async showAllBlogs(request_data) {
        try {
            const getBlogs = `SELECT b.blog_id, b.title, b.content, b.status, b.created_at, t.tag_name 
                              FROM tbl_blog AS b 
                              INNER JOIN tbl_rel_blog_tags rbt ON b.blog_id = rbt.blog_id
                              INNER JOIN tbl_tags AS t ON t.tag_id = rbt.tag_id where b.is_delete=0` ;
    
            const [blogs] = await database.query(getBlogs);
    
            if (blogs.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_tasks_found')
                };
            }
            
            const blogMap = {};
    
            for (const row of blogs) {
                if (!blogMap[row.blog_id]) {
                    blogMap[row.blog_id] = {
                        blog_id: row.blog_id,
                        title: row.title,
                        content: row.content,
                        status: row.status,
                        created_at: row.created_at,
                        tags: []
                    };
                }
                blogMap[row.blog_id].tags.push(row.tag_name);
            }
    
            // Convert object values to array
            const finalBlogs = Object.values(blogMap);
    
            return {
                code: response_code.SUCCESS,
                message: t('tasks_listed_successfully'),
                data: finalBlogs
            };
    
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async deleteBlog(request_data) {
        try {
            const { blog_id } = request_data;
            const deleteBlogQuery = `Update tbl_blog set is_delete=1 WHERE blog_id = ?`;
            const [result] = await database.query(deleteBlogQuery, [blog_id]);

            if (result.affectedRows === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('task_not_found')
                };
            }

            return {
                code: response_code.SUCCESS,
                message: t('task_deleted_successfully'),
                data:blog_id
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async getBlogById(id) {
        try{
            const blog_id = id;
            const getBlogQuery = `SELECT b.blog_id, b.title, b.content, b.status, b.created_at, t.tag_name 
                                  FROM tbl_blog AS b 
                                  INNER JOIN tbl_rel_blog_tags rbt ON b.blog_id = rbt.blog_id
                                  INNER JOIN tbl_tags AS t ON t.tag_id = rbt.tag_id 
                                  WHERE b.blog_id = ? and b.is_delete=0`;
            const [blogData] = await database.query(getBlogQuery, [blog_id]);

            if (blogData.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('task_not_found')
                };
            }
            const blog={
                blog_id: blogData[0].blog_id,
                title: blogData[0].title,
                content: blogData[0].content,
                status: blogData[0].status,
                created_at: blogData[0].created_at,
                tags: blogData.map(row => row.tag_name)
            }

            return {
                code: response_code.SUCCESS,
                message: t('task_found_successfully'),
                data: blog
            };
        }catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async updateBlog(request_data,id) {
        const blog_id = id;
        try {
            const { content, title, status } = request_data;
            console.log("request_data",typeof request_data)

            console.log("title", request_data.title)
            console.log("content",content)
            console.log("status",status)

            if(!blog_id) {
                return {
                    code: response_code.BAD_REQUEST,
                    message: t('blog_id_required')
                };
            }
            const blogData = await common.get_blog_by_id(blog_id);
            console.log("blogData1",blogData);
            if (blogData.code !== response_code.SUCCESS || !blogData.data) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('blog_not_found_or_deleted'),
                    data: null
                };
            }

            const update_data = {};

            if(title){
                update_data.title = title;
            }
            if(content){
                update_data.content = content;
            }
            if (status !== undefined && status !== null) { 
                update_data.status = status;
            }
            console.log("update_data",update_data)
            if(Object.keys(update_data).length === 0) {
                return {
                    code: response_code.BAD_REQUEST,
                    message: t('no_update_data_provided')
                };
            }

            await database.query('UPDATE tbl_blog SET ? WHERE blog_id = ?', [update_data, blog_id]);

            return {
                code: response_code.SUCCESS,
                message: t('task_updated_successfully'),
                data: { blog_id, ...update_data }
            };
        } catch (error) {
            console.error("Error in updateBlog:", error);
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }

    async getTags(request_data) {
        try {
            const getTagsQuery = `SELECT tag_id, tag_name FROM tbl_tags`;
            const [tags] = await database.query(getTagsQuery);

            if (tags.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('no_tags_found')
                };
            }

            return {
                code: response_code.SUCCESS,
                message: t('tags_listed_successfully'),
                data: tags
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    }
    

}
module.exports = new UserModel();
