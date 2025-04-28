const User = require('../controller/user');  

const customerRoute = (app) => {

    app.post("/v1/user/create-blog", User.createBlog);
    app.post("/v1/user/show-all-blogs", User.showAllBlogs);
    app.post("/v1/user/delete-blog", User.deleteBlog);
    app.post("/v1/user/get-blog-details/:id", User.getBlogById);
    app.post("/v1/user/update-blog/:id", User.updateBlog);
    app.post("/v1/user/get-tags", User.getTags);
    

};
   

module.exports = customerRoute;



