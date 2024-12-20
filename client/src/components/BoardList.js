import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BoardList = ({ posts }) => {
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("ko-KR");
    const navigate = useNavigate();
    const handleClick = (id) => {
        navigate(`/detail/${id}`)
    }

    return (
        <table className="w-full border-collapse border">
            <thead>
                <tr>
                    <th className="border p-2">번호</th>
                    <th className="border p-2">제목</th>
                    <th className="border p-2">날짜</th>
                    
                </tr>
            </thead>
            <tbody>
                {posts.map((post) => (
                    <tr key={post.id} onClick={() => handleClick(post.id)} className="cursor-pointer hover:bg-violet-200 text-center">
                        <td className="border p-2">{post.id}</td>
                        <td className="border p-2">{post.title}</td>
                        <td className="border p-2">{formatDate(post.date)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default BoardList;