import axios from 'axios';


/**
* @name Api Client
* @role Connent with the main api endpoint
* @param withCredentials need for sanctum
* @return connectd api client
*
*/
const apiClient = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
});

export default apiClient;

