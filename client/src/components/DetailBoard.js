import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import { fetchBoardDetail } from "../services/api";

const DetailBoard = ({ onDelete, isAuthenticated }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post,setPost] = useState(null);
    const fetchOnce = useRef(false); // 조회수가 2씩 증가하는 걸 방지하기 위함함

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await fetchBoardDetail(id);
                setPost(response.data);
            } catch (err) {
                console.error("게시글 상세조회 실패 : ", err);
                alert("게시글을 불러오는 중 오류가 발생했습니다.")
                navigate("/board")
            }
        };
        if(!fetchOnce.current) {
            fetchDetail();
            fetchOnce.current = true; // 한번만 실행하기
        }
    }, [id, navigate]);
    

    
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
        navigate("/board", {state : {reload : true}});
    }
    const formatDate = (dateStr) => new Date(dateStr).toLocaleString("ko-KR");

    if (!post) {
        return <p>게시글을 불러오는 중입니다...</p>;
    }

    return (
        <div className="">
            <p className='text-4xl text-gray-600 p-2'>VIEW</p>
            <div className="border rounded border-indigo-300">
                
                <p className="flex justify-between items-center border-b border-indigo-300 p-2 text-indigo-400">{post.title} <span className="border rounded-full p-1 bg-lime-400 text-white ">조회수: {post.view_count}</span></p>
    
                <p className="border-b border-indigo-300 p-2 text-indigo-400">작성자 : <span
                    className="text-gray-500">{post.writer}</span></p>
                <p className="border-b border-indigo-300 p-2 text-indigo-400">작성일: <span
                    className="text-gray-500">{formatDate(post.date)}</span></p>
                <p className="p-2 text-gray-500"> {post.content}</p>

                <div className="flex gap-3 p-4 justify-center">
                    <button onClick={handleHome} className="p-2 rounded-sm bg-lime-400 text-white ">목록</button>
                {isAuthenticated && (
                    <>
                        <button onClick={handleDelete} className="p-2 rounded-sm bg-indigo-400 text-white ">삭제</button>
                        <button onClick={handleUpdate} className="p-2 rounded-sm bg-indigo-400 text-white ">수정</button>
                    </>
                    )}
                </div>
            </div>


        </div>
    )

}

export default DetailBoard;