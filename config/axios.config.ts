import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/v1/api',
    headers: {
        // 'Content-Type': 'application/json'
    }
})

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { method, url } = config;

    const token = window.localStorage.getItem('token')
    const userJson = window.localStorage.getItem('user')
    const userParse = JSON.parse(userJson!)

    if (url !== '/auth/login' && url !== '/auth/signup') {
        if (config && config.headers) {
            config.headers['authorization'] = token
            config.headers['x-client-id'] = userParse._id
        }
    }

    if (method === "get") {
        config.timeout = 15000;
    }
    return config;
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    const { method, url } = response.config;
    const { status } = response;

    return response;
};

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
    if (axios.isAxiosError(error)) {
        const { message } = error;
        const { method, url } = error.config as AxiosRequestConfig;
        const { statusText, status } = error.response as AxiosResponse ?? {};

        switch (status) {
            case 401: {
                break;
            }
            case 403: {
                // "Permission denied"
                break;
            }
            case 404: {
                // "Invalid request"
                break;
            }
            case 500: {
                // "Server error"
                break;
            }
            default: {
                // "Unknown error occurred"
                break;
            }
        }

        if (status === 401) {
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('user')
            window.location.href = '/auth'
        }
    } else {
    }

    return Promise.reject(error);
};


axiosInstance.interceptors.request.use(onRequest, onErrorResponse);
axiosInstance.interceptors.response.use(onResponse, onErrorResponse);
