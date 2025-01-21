import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "../../services/api";


// 로그인
export const login = createAsyncThunk("user/login", async (credentials, thunkAPI) => {
    try {
        const response = await loginUser(credentials); // api 호출
        if (response.data.success) {
            return response.data.user; // 로그인 성공시 사용자데이터 반환환
        } else {
            return thunkAPI.rejectWithValue(response.data.message); // 실패시 실패메시지
        }
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response?.data || "로그인실패")
    }
})

// 로그아웃
export const logout = createAsyncThunk("user/logout", async (__dirname, thunkAPI) => {
    try {
        const response = await logoutUser();
        if (response.data.success){
            return true;
        } else {
            return thunkAPI.rejectWithValue(response.data.message)
        }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || "로그아웃 실패")
    }
})

// 세션 유지 확인
export const checkSession = createAsyncThunk("user/checkSession" , async (_, thunkAPI) =>{
    try {
        const response = await checkSession();
        if(response.data.success) {
            return response.data.user;
        } else {
            return thunkAPI.rejectWithValue(response.data.message)
        }
    } catch(err) {
        return thunkAPI.rejectWithValue(err.response?.data || "세션 확인 실패")
    }
})

const userSlice = createSlice ({
    name : "user",
    initialState: {
        isAuthenticated : false,
        user : null,
        status : "idle",
        error : null
    },
    reducers : {},
    extraReducers : (builder) => {
        builder
        // 로그인
        .addCase(login.pending, (state) => {
            state.status = "loading";
            state.err = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.isAuthenticated = true;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state,action) => {
            state.status = "falied";
            state.error = action.payload;
            state.isAuthenticated = false;
            state.user = null
        })
        // 로그아웃 
        .addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.status = "idle";
        })
        .addCase (logout.rejected, (state, action) => {
            state.error = action.payload
        })
        // 세션 확인
        .addCase (checkSession.fulfilled, (state, action)=> {
            state.isAuthenticated = true;
            state.user = action.payload
        })
        .addCase(checkSession.rejected, (state) => {
            state.isAuthenticated = false;
            state.user = null
        })
    }
})

export default userSlice.reducer;