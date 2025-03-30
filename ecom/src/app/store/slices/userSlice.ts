import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string;
    firstName: string;
    email: string;
}

const initialState: UserState = {

    id: '',
    firstName: '',
    email: ''
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload.id;
            state.firstName = action.payload.firstName;
            state.email = action.payload.email;
        },
        clearUser(state) {
            state.id = '';
            state.firstName = '';
            state.email = '';
        }
    }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;