import axios from 'axios';

const AxiosService = axios.create({
    baseURL: 'https://gmailcloneback-end.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
    },
});

AxiosService.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

AxiosService.interceptors.response.use(response => {
    console.log("Response Data:", response.data);
    return response.data;
}, error => {
    const { response } = error;
    console.error("Request Error:", {
        message: error.message,
        config: error.config,
        response: response ? response.data : null
    });

    if (response) {
        switch (response.status) {
            case 401:
                window.location.assign('/login');
                break;
            case 403:
                console.error("Access denied. You do not have permission.");
                break;
            case 404:
                console.error("Resource not found.");
                break;
            case 500:
                console.error("Internal server error. Please try again later.");
                break;
            default:
                console.error("An unexpected error occurred.");
                break;
        }
    } else {
        console.error("An unexpected error occurred.");
    }

    return Promise.reject(response ? response.data : error.message);
});

export default AxiosService;
