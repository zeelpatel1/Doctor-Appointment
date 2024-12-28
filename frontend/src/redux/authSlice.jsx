import { createSlice } from "@reduxjs/toolkit"

const initialState={
    user:null,
    loading:false,
    token:null,
    isAuthenticated:false,
    error:null,
    role:null,
    walletid:null,
    doct:null
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        user:(state,action)=>{
            state.user=action.payload
        },
        loading:(state)=>{
            state.loading=true
        },
        token:(state,action)=>{
            state.token=action.payload
        },
        role:(state,action)=>{
            state.role=action.payload
        },
        walletid:(state,action)=>{
            state.walletid=action.payload
        },
        logout:(state)=>{
            state.user=null
            state.token=null
            state.isAuthenticated=false
            state.role=null
            state.walletid=null
            state.loading=false
        },
        error:(state,action)=>{
            state.error=action.payload
        },
        isAuthenticated:(state)=>{
            state.isAuthenticated=true
        },
        doctid:(state,action)=>{
            state.doct=action.payload
        }
    }
})

export const {user,loading,token,role,logout,error,isAuthenticated,walletid,doctid}=authSlice.actions
export default authSlice.reducer