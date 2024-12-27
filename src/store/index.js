import { configureStore } from '@reduxjs/toolkit'
import auth from './auth'
import booking from './booking'

export const store = configureStore({
    reducer:{
        auth,
        booking
    }
})