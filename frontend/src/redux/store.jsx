import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import {persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig={
    key:'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, authSlice);

const store=configureStore({
    reducer:{
        authSlice:persistedReducer
    }
})


export const persistor = persistStore(store);
export default store