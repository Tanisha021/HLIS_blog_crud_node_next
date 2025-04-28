const checkValidatorRules = {


    createTask:{
        title: 'required|string',
        description: 'required|string',
        deadline: 'required|date'
    },
    deleteBlog:{
        blog_id: 'required|integer'
    },
    getBlogById:{
        blog_id: 'required|integer'
    },
        
    
};

module.exports = checkValidatorRules;

