import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardList = ({ posts }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("ko-KR");
    const navigate = useNavigate();

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const handleClick = (id) => {
        navigate(`/detail/${id}`)
    }

    return (
        <div className="bg-white">
            <div>
                <p className="text-2xl p-2 text-center">자유게시판임니다</p>
            </div>

            <table className="w-full border-collapse border text-center">
                <thead>
                    <tr className="">
                        <th className="border-b p-2">No</th>
                        <th className="border-b p-2">글제목</th>
                        <th className="border-b p-2">작성자</th>
                        <th className="border-b p-2">작성일</th>

                    </tr>
                </thead>
                <tbody>
                    {currentPosts.map((post) => (
                        <tr key={post.id} onClick={() => handleClick(post.id)} className="cursor-pointer hover:bg-gray-200 text-center">
                            <td className="border-b p-2">{post.id}</td>
                            <td className="border-b p-2">{post.title}</td>
                            <td className="border-b p-2">{post.writer}</td>
                            <td className="border-b p-2">{formatDate(post.date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center space-x-2 p-4">
                <button onClick={()=> paginate(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
                    이전
                </button>
                {[...Array(totalPages)].map((_, index) =>(
                    <button key={index} onClick={()=> paginate(index + 1)} className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
                    다음
                </button>
            </div>
        </div>
        
    )
}

export default BoardList;