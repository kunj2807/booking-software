import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../api/endpoint.js";
import { toast } from 'react-toastify';
import axios from '../components/axios.js'
import { errorHandler } from "../components/errorHandlers.js";

export const bookingList = createAsyncThunk('booking/list', async (userCredentials) => {
    return axios({
        url: API_ENDPOINTS.BOOKING_LIST,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        data: userCredentials,
    })
        .then(response => response.data)
        .catch(error => {
            toast.error(errorHandler(error))
        })
});
export const bookingStore = createAsyncThunk('booking/store', async (data) => {
    try {


        const response = await toast.promise(
            axios({
                url: API_ENDPOINTS.ADD_BOOKING,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data,
            }),
            {
                pending: 'Submitting',
                success: 'Successfully submited!',
                error: {
                    render({ data }) {
                        return errorHandler(data) || 'Failed!';
                    }
                }
            }
        ).then(response => response.data)

        return response
    } catch (error) {

    }

});


export const bookingUpdate = createAsyncThunk('booking/update', async (data) => {
    try {
        const response =await toast.promise(
            axios({
                url: `${API_ENDPOINTS.UPDATE_BOOKING}/${data.id}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                data,
            }), {
            pending: 'Updating...',
            success: 'Successfully updated!',
            error: {
                render({ data }) {
                    return errorHandler(data) || 'Failed!';
                }
            }
        }
        ).then(response => response.data)
        return response

    } catch (error) {

    }

});
export const bookingDelete = createAsyncThunk('booking/delete', async (id) => {
    try {

        const response = await toast.promise(
            axios({
                url: `${API_ENDPOINTS.DELETE_BOOKING}/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }), {
            pending: 'Deleting...',
            success: 'Successfully deleted',
            error: {
                render({ data }) {
                    return errorHandler(data) || 'Failed!';
                }
            }
        }
        ).then(response => response.data)
        return response

    } catch (error) {

    }

});

const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        bookingData: []
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(bookingList.fulfilled, (state, action) => {
                state.bookingData = action.payload?.data || []
            })
    }
})

export default bookingSlice.reducer