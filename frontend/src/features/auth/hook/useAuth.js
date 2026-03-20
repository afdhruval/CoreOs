import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";


export function useAuth() {

    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
        } catch (err) {
            dispatch(setError(error.response?.data?.message || "registration failed"))
        } finally {
            dispatch(setLoading(false))
        }

    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(error.response?.data?.message || "login failed"))
        } finally {
            dispatch(setLoading(true))
        }
    }

    async function handleGetme() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            dispatch(setError(error.response?.data?.message || "failed to fetched data"))
        } finally {
            dispatch(setLoading(false))
        }
    }
}