import axios from 'axios';

const api = axios.create({
    baseURL: `https://identitytoolkit.googleapis.com/v1/`,
    params: {
        key: `${process.env.EXPO_PUBLIC_AUTH_API_KEY}`
    }
});

export default api