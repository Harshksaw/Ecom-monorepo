import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string;
    name: string;
    email: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    phone: string;
    isLoggedIn: boolean;
}

const initialState: UserState = {

    id: '',
    name: '',
    email: '',
    address:{},
    phone: '',
    isLoggedIn: false,


};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.address = action.payload.address;
            state.phone = action.payload.phone;
            state.isLoggedIn = action.payload.isLoggedIn;
            
        },
        clearUser(state) {
            state.id = '';
            state.name = '';
            state.email = '';
            state.address = {};
            state.phone = '';
            state.isLoggedIn = false;

        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;