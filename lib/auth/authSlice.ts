import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { UserRole } from "../user/userApi";

interface AuthState {
    role?: UserRole;
    userId?: string;
}

const initialState: AuthState = {
    role: undefined,
    userId: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setRole: (state, action: PayloadAction<AuthState['role']>) => {
            state.role = action.payload;
        },
        setUserId: (state, action: PayloadAction<AuthState['userId']>) => {
            state.userId = action.payload;
        }
    }
})

export const authSliceReducer = authSlice.reducer;