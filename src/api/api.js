import axios from "axios";
const local = 'https://backendecommerc2e-production.up.railway.app'
const api = axios.create({
    baseURL : `${local}/api`
})
// https://backendecommerc2e-production.up.railway.app
export default api