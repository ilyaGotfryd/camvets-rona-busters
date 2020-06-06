import axios from 'axios'

export const API_URL = "https://api.density.io/v2/"

const instance = axios.create({
    baseUrl: API_URL,
    timeout: 10000,
    headers: {'Authorization':`Bearer ${process.env.REACT_APP_API_TOKEN}`}
})

export default instance;