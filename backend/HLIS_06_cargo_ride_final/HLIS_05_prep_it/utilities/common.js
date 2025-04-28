const database = require("../config/database");
// const cryptLib = require("cryptlib");
const crypto = require("crypto");
const constants = require("../config/constant");
const { default: localizify } = require('localizify');
const { t } = require("localizify");
const nodemailer = require("nodemailer");
const response_code = require("../utilities/response-error-code");
const key = Buffer.from(process.env.HASH_KEY, 'hex');
const iv = Buffer.from(process.env.HASH_IV, 'hex');

class Common {
    generateToken(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // async response(res, message) {
    //     return res.json(message);
    // }

    async response(res, message){
        const encrypted = this.encrypt(message);
        return res.status(200).send(encrypted);
    }

    async findExistingUser(email_id) {
        const findUserQuery = `SELECT * FROM tbl_user WHERE email_id = ? AND is_deleted = 0 AND is_active = 1`;
        const [existingUser] = await database.query(findUserQuery, [email_id]);
        return existingUser;
    }

    async getUserDetail(user_id, callback) {
        const selectUserQuery = "SELECT * FROM tbl_user WHERE user_id = ?";

        try {
            const [user] = await database.query(selectUserQuery, [user_id]);
            console.log(user);

            if (user.length > 0) {
                callback(null, user[0]);
            } else {
                callback("User not found", null);
            }
        } catch (error) {
            callback(error.message, null);
        }
    }

    async checkExistingUser(email) {
        try {
            const checkUser = `SELECT * FROM tbl_user WHERE email_id = ? and is_deleted = 0`;
            const [user] = await database.query(checkUser, [email]);
            return user.length > 0;
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }

    async updateUserInfo(user_id, user_data) {
        if (!user_id || Object.keys(user_data).length === 0) {
            throw new Error("Invalid update request: No data provided.");
        }

        let fields = Object.keys(user_data).map(field => `${field} = ?`).join(', ');
        let values = Object.values(user_data);
        values.push(user_id);

        const updateQuery = `UPDATE tbl_user SET ${fields} WHERE user_id = ?`;

        try {
            const [result] = await database.query(updateQuery, values);

            console.log("Update Result:", result);

            if (result.affectedRows === 0) {
                console.warn("No rows updated - Either user not found or no changes made");
                return null;
            }

            const selectUserQuery = `
                SELECT user_id, latitude, longitude, gender, current_weight_kg, target_weight_kg, 
                       current_height_cm, activity_level, is_profile_completed, goal_id, isstep_
                FROM tbl_user 
                WHERE user_id = ?
            `;

            const [updatedUser] = await database.query(selectUserQuery, [user_id]);

            console.log("Updated User Data:", updatedUser);

            return updatedUser.length > 0 ? updatedUser[0] : null;

        } catch (error) {
            console.error("Error in updateUserInfo:", error);
            throw error;
        }
    }

    async getUserDetailLogin(user_id) {
        console.log("User ID:", user_id);

        const selectUserQuery = "SELECT * FROM tbl_user WHERE user_id = ? ";

        try {
            const [user] = await database.query(selectUserQuery, [user_id]);
            console.log("User", user);

            if (user.length > 0) {

                return user[0];
            } else {
                return t('no_data_found');
            }
        } catch (error) {
            console.error("Error in getUserDetailLogin:", error);
            return error.message || error;
        }
    }


    async requestValidation(v) {
        if (v.fails()) {
            const Validator_errors = v.getErrors();
            const error = Object.values(Validator_errors)[0][0];
            return {
                code: true,
                message: error
            };
        }
        return {
            code: false,
            message: ""
        };
    }



    async get_blog_by_id(blog_id) {
        try {
            const getBlogQuery = `SELECT b.blog_id, b.title, b.content, b.status, b.created_at, t.tag_name 
                              FROM tbl_blog AS b
                              INNER JOIN tbl_rel_blog_tags rbt ON b.blog_id = rbt.blog_id
                              INNER JOIN tbl_tags AS t ON t.tag_id = rbt.tag_id
                              WHERE b.blog_id = ? AND b.is_delete = 0`;

            const [blogData] = await database.query(getBlogQuery, [blog_id]);

            if (blogData.length === 0) {
                return {
                    code: response_code.NOT_FOUND,
                    message: t('task_not_found'),
                    data: null
                };
            }

            const blog = {
                blog_id: blogData[0].blog_id,
                title: blogData[0].title,
                content: blogData[0].content,
                status: blogData[0].status,
                created_at: blogData[0].created_at,
                tags: blogData.map(row => row.tag_name)
            };

            return {
                code: response_code.SUCCESS,
                message: t('task_found_successfully'),
                data: blog
            };
        } catch (error) {
            return {
                code: response_code.OPERATION_FAILED,
                message: t('some_error_occurred'),
                data: error.message
            };
        }
    };
    async sendMail(subject, to_email, htmlContent) {
        try {
            if (!to_email || to_email.trim() === "") {
                throw new Error("Recipient email is empty or undefined!");
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: constants.mailer_email,
                    pass: constants.mailer_password
                }
            });

            const mailOptions = {
                from: constants.from_email,
                to: to_email,
                subject: subject,
                html: htmlContent,
                text: "Please enable HTML to view this email.",
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(info)
                ;
            return { success: true, info };
        } catch (error) {
            console.log(error);
            return { success: false, error };
        }
    }

    // async encrypt(data) {
    //     try {
    //         console.log(data, 'encry');

    //         return cryptLib.encrypt(JSON.stringify(data), constants.encryptionKey, constants.encryptionIV);
    //     } catch (error) {
    //         return error;
    //     }
    // }

    // decryptPlain(data) {
    //     console.log('data======c', data);

    //     const decData = cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
    //     return decData

    // }

    // decryptString(data) {
    //     console.log('data======c', data);
    //     try {

    //         if (data) {
    //             return cryptLib.decrypt(data, constants.encryptionKey, constants.encryptionIV);
    //         } else {
    //             return;
    //         }
    //     } catch (error) {
    //         return error;
    //     }
    // }
    // encrypt(data){
    //     return cryptolib.encrypt(JSON.stringify(data));
    // }

    encrypt(requestData) {
        try {
            if (!requestData) {
                return null;
            }
            const data = typeof requestData === "object" ? JSON.stringify(requestData) : requestData;
            const cipher = crypto.createCipheriv('AES-256-CBC', key, iv);
            let encrypted = cipher.update(data, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            return encrypted;
        } catch (error) {
            console.error("Encryption error:", error);
            return error;
        }
    }

    decrypt(requestData) {
        try {
            if (!requestData) {
                return {};
            }
            const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);
            let decrypted = decipher.update(requestData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            console.log("--------- DECRYPT: ", decrypted);
            return this.isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
        } catch (error) {
            console.log("Error in decrypting: ", error);
            return requestData;
        }
    }

    isJson(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
}


module.exports = new Common;
