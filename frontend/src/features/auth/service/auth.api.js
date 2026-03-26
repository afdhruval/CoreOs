import axios from "axios"

const api = axios.create({
    baseURL: "", // relative URL to let Vite proxy handle it securely
    withCredentials: true
})


export async function register({ email, username, password }) {

    const response = await api.post("/api/auth/register", {
        email, username, password
    })

    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", {
        email, password
    })

    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/getme")

    return response.data
}

export async function verifyEmail(token) {
    const response = await api.get(`/api/auth/verify?token=${token}`)
    return response.data
}

export async function logoutApi() {
    const response = await api.get("/api/auth/logout")
    return response.data
}