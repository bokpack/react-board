import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardList = ({ posts }) => {
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("ko-KR");
    const navigate = useNavigate();
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
                    {posts.map((post) => (
                        <tr key={post.id} onClick={() => handleClick(post.id)} className="cursor-pointer hover:bg-gray-200 text-center">
                            <td className="border-b p-2">{post.id}</td>
                            <td className="border-b p-2">{post.title}</td>
                            <td className="border-b p-2">{post.writer}</td>
                            <td className="border-b p-2">{formatDate(post.date)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
    )
}

export default BoardList;