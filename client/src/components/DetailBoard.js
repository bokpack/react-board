import React from "react";
import { useNavigate, useParams } from "react-router-dom"; 

const DetailBoard = ({ posts, onDelete }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = posts.find((p) => p.id === parseInt(id,10));
    
    if(!post) {
        return <p>게시글을 찾을 수 없습니다</p>;
    }
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("ko-KR");

    const handleDelete = () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            onDelete(post.id);
            window.alert("게시글이 삭제되었습니다."); 
            navigate("/"); 
        }
    }

    const handleUpdate = () => {
        navigate(`/update/${id}`);
    }

    const handleHome = () => {
        navigate("/");
    }

    return (
        <div className="p-4 border">
            <h1 className="text-xl font-bold mb-4">{post.title}</h1>
            <p>작성일: {formatDate(post.date)}</p>
            <p>내용</p>
            <p>{post.content}</p>
            <div className="flex gap-3">
                <button onClick={handleDelete} className="p-2 rounded-sm bg-blue-400 text-white ">삭제</button>
                <button onClick={handleUpdate} className="p-2 rounded-sm bg-blue-400 text-white ">수정</button>
                <button onClick={handleHome} className="p-2 rounded-sm bg-blue-400 text-white ">홈으로</button>
            </div>
        </div>
    )
    
}

export default DetailBoard;