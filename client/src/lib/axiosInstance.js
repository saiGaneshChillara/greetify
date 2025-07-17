import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://5001-firebase-greetify-1751898334967.cluster-44kx2eiocbhe2tyk3zoyo3ryuo.cloudworkstations.dev/api",
    withCredentials: true,
});