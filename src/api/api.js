import axios from "axios";
const local = 'https://backendecommerc2e-production.up.railway.app'
const api = axios.create({
    baseURL : `${local}/api`
})

export default api