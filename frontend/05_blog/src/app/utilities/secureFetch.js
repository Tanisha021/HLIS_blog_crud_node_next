import {encrypt, decrypt} from "./encdec";

export async function secureFetch(url, request_data = {}, method='POST', api_key){
    try{
        const req = request_data ?? {};
        const encData = encrypt(JSON.stringify(req));

        const headers = {
            "api-key": api_key,
            "Content-Type": "text/plain",
        }

        const resp = await fetch(url, {
            method,
            headers,
            body: encData
        });

        const result = await resp.text();
        const data_ = decrypt(result);

        return data_.data;

    } catch(error){
        console.log(error);
        return error;
    }
}