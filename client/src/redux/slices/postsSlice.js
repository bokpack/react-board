import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBoardList, fetchBoardDetail } from '../../services/api';

// 게시글 목록 조회
export const fetchPosts = createAsyncThunk('post/fetchPosts', async () => {
    const response = await fetchBoardList();
    return response.data;
});

// 게시글 상세 조회
export const fetchPostDetail = createAsyncThunk('post/fetchPostDetail', async (id) => {
    const response = await fetchBoardDetail(id);
    return response.data;
});

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],          // 전체 게시글
        filteredPosts: [],  // 검색된 게시글 목록
        postDetail: null,   // 상세 게시글
        currentPage: 1,     // 현재 페이지
        postsPerPage: 10,   // 한 페이지당 게시글 수
        status: 'idle',     // 로딩 상태
        error: null,        // 에러 상태
    },
    reducers: {
        setFilteredPosts: (state, action) => {
            state.filteredPosts = action.payload;
        },
        clearFilteredPosts: (state) => {
            state.filteredPosts = state.posts;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        clearPostDetail: (state) => {
            state.postDetail = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
                state.filteredPosts = action.payload; // 기본적으로 전체 게시글로 설정
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchPostDetail.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPostDetail.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.postDetail = action.payload;
            })
            .addCase(fetchPostDetail.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setFilteredPosts, clearFilteredPosts, setPage, clearPostDetail } = postsSlice.actions;
export default postsSlice.reducer;
