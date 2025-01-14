import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoardList } from '../../services/api';

export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await fetchBoardList();
    return response.data;
})

const postsSlice = createSlice({
    name : 'posts',
    initialState : {
        posts : [],
        filteredPosts : [],
        status : 'idle',
        error: null
    },
    reducers : {
        filterPosts : (state , action) => {
            const {searchQuery, searchField} = action.payload;
            if(!searchQuery || !searchField) {
                state.filterPosts = state.posts;
                return;
            }
            state.filteredPosts = state.posts.filter((post) => {
                if(searchField === 'title') return post.title.includes(searchQuery);
                if(searchField === 'content') return post.content.includes(searchQuery);
                if(searchField === 'writer') return post.writer.includes(searchQuery);
                return false
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, (state) =>{
            state.status = 'loading';
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.posts = action.payload;
            state.filteredPosts = action.payload;
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'falied'
            state.error = action.error.message;
        })
    }
})
export const {filterPosts} = postsSlice.actions;
export default postsSlice.reducer;