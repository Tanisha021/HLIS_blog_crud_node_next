import { createCipheriv, createDecipheriv } from 'crypto';

export function encrypt(request_data) {
    if ( ! request_data) return '';
    const iv = Buffer.from(process.env.NEXT_PUBLIC_HASH_IV, 'hex');
    const key = Buffer.from(process.env.NEXT_PUBLIC_HASH_KEY, 'hex');
    try {
        const data = typeof request_data === 'object' ? JSON.stringify(request_data) : request_data;
        const cipher = createCipheriv('AES-256-CBC', key, iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        console.error('Encryption Error:', error);
        return '';
    }
}

export function decrypt(request_data) {
    const iv = Buffer.from(process.env.NEXT_PUBLIC_HASH_IV, 'hex');
    console.log("before key")
    const key = Buffer.from(process.env.NEXT_PUBLIC_HASH_KEY, 'hex');
    console.log(request_data);
    try {
        if (!request_data) return {};
        console.log('Request Data to Decrypt:', request_data);
        const decipher = createDecipheriv('AES-256-CBC', key, iv);
        let decrypted = decipher.update(request_data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return isJson(decrypted) ? JSON.parse(decrypted) : decrypted;
    } catch (error) {
        console.error('Decryption Error:', error);
        return {};
    }
}

function isJson(request_data) {
    try {
        JSON.parse(request_data);
        return true;
    } catch (error) {
        return false;
    }
}

export default {encrypt, decrypt}