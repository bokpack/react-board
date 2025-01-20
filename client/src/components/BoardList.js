import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, filterPosts, setPage } from '../redux/slices/postsSlice';

const BoardList = () => {
  const dispatch = useDispatch(); // Redux 액션(fetchPosts, filterPosts)을 실행
  const navigate = useNavigate();
  const location = useLocation();

  // const {  filteredPosts, status } = useSelector((state) => state.posts); // Redux의 상태를 가져옴, filteredPosts(필터링된 게시글 리스트) & status (로딩 상태)
  // const [currentPage, setCurrentPage] = useState(1);
  // const postsPerPage = 10;

  // Redux 적용한 pagenation을 위해서
  const { filteredPosts, currentPage, postsPerPage, status } = useSelector((state) => state.posts);

  useEffect(() => {
    // 게시글 데이터를 로드
    if (status === 'idle') {
      dispatch(fetchPosts()); // Redux 액션을 통해 게시글 데이터를 로드
    }
  }, [dispatch, status]);

  useEffect(() => {
    const { searchQuery, searchField, reload } = location.state || {};
    if (reload) {
      dispatch(fetchPosts()); // 게시글 데이터 다시 로드
      navigate('/board', { state: {} });
    } else if (searchQuery && searchField) {
      dispatch(filterPosts({ searchQuery, searchField }));
    } else {
      dispatch(filterPosts({ searchQuery: '', searchField: '' })); // 검색 조건 초기화
    }
  }, [dispatch, location.state]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);  Redux의 dispatch 사용할 거라 필요가 없어짐
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleClick = (id) => {
    navigate(`/detail/${id}`);
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString('ko-KR');

  return (
    <div className="bg-white">
      <div>
        <p className="text-2xl p-2 text-center">자유게시판임니다</p>
      </div>

      <table className="w-full border-collapse border text-center">
        <thead>
          <tr>
            <th className="border-b p-2">No</th>
            <th className="border-b p-2">글제목</th>
            <th className="border-b p-2">작성자</th>
            <th className="border-b p-2">조회수</th>
            <th className="border-b p-2">작성일</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr
              key={post.id}
              onClick={() => handleClick(post.id)}
              className="cursor-pointer hover:bg-gray-200 text-center"
            >
              <td className="border-b p-2">{post.id}</td>
              <td className="border-b p-2">{post.title}</td>
              <td className="border-b p-2">{post.writer}</td>
              <td className="border-b p-2">{post.view_count || 0}</td>
              <td className="border-b p-2">{formatDate(post.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center space-x-2 p-4">
        <button
          onClick={() => dispatch(setPage(currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          이전
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => dispatch(setPage(index + 1))}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1 ? 'bg-indigo-400 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => dispatch(setPage(currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default BoardList;





// redux 적용 전
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const BoardList = ({ posts, loadPosts, searchQuery, searchField }) => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const [filteredPosts, setFilteredPosts] = useState(posts);
//     const postsPerPage = 10;
//     const formatDate = (dateStr) => new Date(dateStr).toLocaleString("ko-KR");
//     const navigate = useNavigate();
//     const location = useLocation();

//     useEffect(() => {
//         const { searchQuery, searchField, reload } = location.state || {}; // 상태 확인
//         if(reload) {
//             loadPosts() // props로 전달된 게시글 로그 함수 호출
//             navigate("/board", {state : {}})
//         } else if (searchQuery && searchField) {
//             const filtered = posts.filter((post) => {
//                 if (searchField === "title") return post.title.includes(searchQuery);
//                 if (searchField === "content") return post.content.includes(searchQuery);
//                 if (searchField === "writer") return post.writer.includes(searchQuery);
//                 return false;
//             });
//             setFilteredPosts(filtered);
//         } else {
//             setFilteredPosts(posts); // 검색 조건이 없으면 전체 게시글 표시
//         }
//     }, [location.state, posts]);


//     const indexOfLastPost = currentPage * postsPerPage;
//     const indexOfFirstPost = indexOfLastPost - postsPerPage;
//     const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     const totalPosts = filteredPosts.length;
//     const totalPages = Math.ceil(totalPosts / postsPerPage);
//     const handleClick = (id) => {
//         navigate(`/detail/${id}`)
//     }

//     return (
//         <div className="bg-white">
//             <div>
//                 <p className="text-2xl p-2 text-center">자유게시판임니다</p>
//             </div>

//             <table className="w-full border-collapse border text-center">
//                 <thead>
//                     <tr className="">
//                         <th className="border-b p-2">No</th>
//                         <th className="border-b p-2">글제목</th>
//                         <th className="border-b p-2">작성자</th>
//                         <th className="border-b p-2">조회수</th>
//                         <th className="border-b p-2">작성일</th>

//                     </tr>
//                 </thead>
//                 <tbody>
//                     {currentPosts.map((post) => (
//                         <tr key={post.id} onClick={() => handleClick(post.id)} className="cursor-pointer hover:bg-gray-200 text-center">
//                             <td className="border-b p-2">{post.id}</td>
//                             <td className="border-b p-2">{post.title}</td>
//                             <td className="border-b p-2">{post.writer}</td>
//                             <td className="border-b p-2">{post.view_count || 0}</td>
//                             <td className="border-b p-2">{formatDate(post.date)}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <div className="flex justify-center space-x-2 p-4">
//                 <button onClick={()=> paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
//                     이전
//                 </button>
//                 {[...Array(totalPages)].map((_, index) =>(
//                     <button key={index} onClick={()=> paginate(index + 1)} className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-indigo-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
//                         {index + 1}
//                     </button>
//                 ))}
//                 <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
//                     다음
//                 </button>
//             </div>
//         </div>
        
//     )
// }

// export default BoardList;