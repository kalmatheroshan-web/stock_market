import axios from "axios";

async function fetch_connector(method, url, body = {}, headers = {}) {
    try {
        const response = await axios({
            method,
            url,
            data: body,
            headers,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}


export default fetch_connector; 