import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.user = action.payload
        },
        setError: (state, action) => {
            state.user = action.payload
        }
    }
})

export const { setUser, setLoading, setError } = authSlice

export default authSlice.reducer