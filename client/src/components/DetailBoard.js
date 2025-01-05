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
        navigate("/board");
    }

    return (
        <div className="">
            <p className='text-4xl text-gray-600 p-2'>VIEW</p>
            <div className="border rounded border-indigo-300">
                <p className="border-b border-indigo-300 p-2 text-indigo-400">{post.title}</p>
                <p className="border-b border-indigo-300 p-2 text-indigo-400">작성자 : <span
                    className="text-gray-500">{post.writer}</span></p>
                <p className="border-b border-indigo-300 p-2 text-indigo-400">작성일: <span
                    className="text-gray-500">{formatDate(post.date)}</span></p>
                <p className="p-2 text-gray-500"> {post.content}</p>

                {onDelete && (
                    <div className="flex gap-3 p-4 justify-center">
                        <button onClick={handleHome} className="p-2 rounded-sm bg-lime-400 text-white ">목록</button>
                        <button onClick={handleDelete} className="p-2 rounded-sm bg-indigo-400 text-white ">삭제</button>
                        <button onClick={handleUpdate} className="p-2 rounded-sm bg-indigo-400 text-white ">수정</button>

                    </div>
                )}
            </div>


        </div>
    )

}

export default DetailBoard;