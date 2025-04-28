const response_code = require("../../../../utilities/response-error-code");
const constant = require("../../../../config/constant");
const common = require("../../../../utilities/common");
const userModel = require("../models/user-model");
const { default: localizify } = require('localizify');
const validationRules = require('../../../validation_rules');
const middleware = require("../../../../middleware/validators");
const { t } = require("localizify");


class User {
    async showAllBlogs(req, res) {
        const requested_data = req.body;
        try {
            
                const request_data = common.decrypt(requested_data);

            const rules = validationRules.showAllBlogs;

            const valid = middleware.checkValidationRules(req, res, request_data, rules)
            console.log("Valid", valid);
            if (!valid) return;
            const responseData = await userModel.showAllBlogs(request_data);
            return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async createBlog(req, res) {
        let requested_data = req.body;
        try { 
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.createBlog

            let message = {
                required: req.language.required,
                required: t('required'),
                title: t('title'),
                content: t('content'),
            }

            let keywords = {
                title: t('title'),
                content: t('content'),
            }

            const valid = middleware.checkValidationRules(req, res, request_data, rules, message, keywords);

            if (!valid) return;

            const responseData = await userModel.createBlog(request_data);

            // Send response
            return common.response(res, responseData);
        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async deleteBlog(req, res) {
        let requested_data = req.body;
        try { 
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.deleteBlog

            const valid = middleware.checkValidationRules(req, res, request_data, rules)
            if (!valid) return;
            const responseData = await userModel.deleteBlog(request_data);
            return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async getBlogById(req, res) {
        // let requested_data = req.body;
        const { id } = req.params
        if (!id) {
            return common.response(res, {
                code: response_code.BAD_REQUEST,
                message: t('blog_id_required')
            });
        }
        try { 
            const responseData = await userModel.getBlogById(id);  
        return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async updateBlog(req, res) {
        const { id } = req.params
        const requested_data = req.body;
        if (!id) {
            return common.response(res, {
                code: response_code.BAD_REQUEST,
                message: t('blog_id_required')
            });
        }
        try { 
            const request_data = common.decrypt(requested_data);

            const rules = validationRules.updateBlog;

            const valid = middleware.checkValidationRules(req, res, request_data, rules)
            console.log("Valid", valid);
            if (!valid) return;
            const responseData = await userModel.updateBlog(request_data,id);
            return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

    async getTags(req, res) {
        let requested_data = req.body;
        try { 
            const request_data = common.decrypt(requested_data);
            const rules = validationRules.getTags

            const valid = middleware.checkValidationRules(req, res, request_data, rules)
            if (!valid) return;
            const responseData = await userModel.getTags(request_data);
            return common.response(res, responseData);

        } catch (error) {
            return common.response(res, {
                code: response_code.OPERATION_FAILED,
                message: t('rest_keywords_something_went_wrong') + error
            });
        }
    }

};
module.exports = new User();
