import axios from "axios";

const  {REACT_APP_API_URL} = process.env

const instance = axios.create({
    baseURL: 'http://localhost:5000'
})


export default instance;