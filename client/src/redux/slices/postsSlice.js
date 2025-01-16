import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoardList, fetchBoardDetail } from '../../services/api';

// 게시글 목록 조회
export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => { // 비동기 API 요청을 통해 게시글 데이터를 가져옴
    const response = await fetchBoardList();
    return response.data;
})

// 게시글 상세 조회
export const fetchPostDetail = createAsyncThunk('post/fetchPostDetail', async (id) =>{
    const response = await fetchBoardDetail(id);
    return response.data;
})

const postsSlice = createSlice({
    name : 'posts',
    initialState : { // 초기화
        posts : [], // 게시글 리스트
        filteredPosts : [], // 필터링된 리스트
        postDetail : null ,  // 게시글 상세 정보
        status : 'idle', // 로딩상태
        error: null // 에러정보
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
        clearPostDetail: (state) => {
            state.postDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
        // 게시글 조회
        .addCase(fetchPosts.pending, (state) =>{ // 데이터 가져오는 중 
            state.status = 'loading';
        })
        .addCase(fetchPosts.fulfilled, (state, action) => { // 데이터 가져오기 성공 상태
            state.status = 'succeeded';
            state.posts = action.payload;
            state.filteredPosts = action.payload;
        })
        .addCase(fetchPosts.rejected, (state, action) => { // 데이터 가져오기 실패 상태
            state.status = 'falied'
            state.error = action.error.message;
        })
        // 게시글 상세 조회
        .addCase(fetchPostDetail.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchPostDetail.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.postDetail = action.payload
        })
        .addCase(fetchPostDetail.rejected, (state, action) => {
            state.status = 'falied';
            state.error = action.error.message;
        })
    }
})
export const {filterPosts, clearPostDetail} = postsSlice.actions;
export default postsSlice.reducer;