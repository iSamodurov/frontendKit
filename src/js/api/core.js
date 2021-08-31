import axios from 'axios';

const apiUrl = (process.env.NODE_ENV == 'production') ? '/api' : '//localhost:9001';


const axiosInstance = axios.create({
	baseURL: apiUrl,
	headers: {
		'Content-Type': 'application/json'
	}
});


axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => {
		console.log('Error');
		console.log(error);
	}
);


axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response.status === 401) {
			// err handler here
		}
	}
);


export const get = async (url) => await axiosInstance.get(url);
export const post = async (url, data) => await axiosInstance.post(url, data);
export default axiosInstance;
