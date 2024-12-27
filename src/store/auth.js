import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../api/endpoint.js";
import { toast } from 'react-toastify';
import axios from '../components/axios.js'
import { errorHandler } from "../components/errorHandlers.js";

export const loginUser = createAsyncThunk('auth/loginUser', async (userCredentials) => {
    try {

        const response = await toast.promise(
            axios({
                url: API_ENDPOINTS.LOGIN,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: userCredentials,
            }),
            {
                pending: 'Logging in...',
                success: 'Login successful!',
                error: {
                    render({ data }) {
                        return errorHandler(data) || 'Login failed!';
                    }
                }
            }
        ).then(response=>response.data)
        return response

    } catch (error) {

    }
});


export const registerUser = createAsyncThunk('auth/registerUser', async (userCredentials) => {
    try {

        const response = toast.promise(
            axios({
                url: API_ENDPOINTS.REGISTER,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: userCredentials,
            }), {
            pending: 'Registering...',
            success: 'Registration successful!',
            error: {
                render({ data }) {
                    return errorHandler(data) || 'Registration failed!';
                }
            }
        }
        ).then(response=>response.data)
        return response

    } catch (error) {

    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        authUser: {}
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.authUser = action.payload.user || {}
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.authUser = action.payload.user || {}
            })
    }
})

export default authSlice.reducer