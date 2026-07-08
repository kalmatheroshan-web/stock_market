import toast from 'react-hot-toast';
import fetch_connector from './fetchConnector';
const signup = async (data, navigate) => {
    try {

        const response = await fetch_connector('POST', SIGN_UP_API, data);
        if (response.success) {
            toast.success('Welcome to TradeGo');
            return navigate('/', { state: { response } });
        }
        return response;
    }
    catch (err) {
        toast.error(err.message);
        console.log(err.message);
    }
}


const login = async () => {
    const response = await fetch_connector();

};



export { signup, login };