import axios from "axios";

async function fetch_connector(method, url, body = {}, headers = {}, signal = null) {
    const response = await axios({
        method,
        url,
        data: body,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        withCredentials: true,
        signal, 
    });

    return response.data;
}

export default fetch_connector; 