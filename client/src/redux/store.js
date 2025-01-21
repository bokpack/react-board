import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    posts : postsReducer,
    user : userReducer
  },
});

export default store;
