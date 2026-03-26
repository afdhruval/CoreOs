import { useDispatch } from "react-redux";
import { register, login, getMe, logoutApi } from "../service/auth.api";
import { setError, setLoading, setUser } from "../auth.slice";

export function useAuth() {

    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || "registration failed";
            dispatch(setError(errorMsg))
            throw err;
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin(email, password) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || "login failed";
            dispatch(setError(errorMsg))
            throw err;
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetme() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            if (err.response?.status !== 401) {
                dispatch(setError(err.response?.data?.message || "failed to fetch data"))
            }
            dispatch(setUser(null))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('freeChatsLeft');
            dispatch(setUser(null));
        }
    };

    return {
        handleRegister,
        handleLogin,
        handleGetme,
        handleLogout
    }
}