import axios from "axios";
const local = 'https://website-ecommercc-easy-shop.vercel.app/api'
const production = ''
const api = axios.create({
    baseURL : `${local}/api`
})

export default api