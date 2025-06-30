import axios from "axios";
const local = 'https://backend-ecommerc2e.onrender.com'
const api = axios.create({
    baseURL : `${local}/api`
})
// https://backendecommerc2e-production.up.railway.app
export default api