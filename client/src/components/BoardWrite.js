import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BoardWrite = ({ posts,onSubmit, isAuthenticated  }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({title : "", content : ""});

    useEffect(() => {
        if(isAuthenticated === false) {
            alert("글쓰기를 하려면 로그인이 필요합니다")
            navigate("/login")
        }
    }, [isAuthenticated, navigate])

    useEffect(()=> {
        if(id) {
            const post = posts.find((p) => p.id === parseInt(id,10));
            if(post) {
                setFormData ({title : post.title, content: post.content})            }
        }
    }, [id,posts])

    const handleChange = (e) => {
        const { name , value } =e.target;
        setFormData({...formData, [name] : value });
    }

    const handleSubmit = () => {
        if (formData.title && formData.content) {
            const newPost = id
                ? { ...formData, id: parseInt(id, 10) } // 수정하는 경우 ID 유지
                : { ...formData }; // 새 글 작성 시 ID 없이 전송
    
            onSubmit(newPost); 
            navigate("/board");
        } else {
            alert("제목과 내용을 입력해주세요 ~");
        }
    };
    

    return (
        <div className="p-4">
            <input
                name="title"
                value={formData.title}            
                onChange={handleChange}
                placeholder="제목"
                className="border p-2 w-full mb-2"
            />
            <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="내용"
                className="border p-2 w-full mb-2"
            />
            <button onClick={handleSubmit} className="bg-blue-400 text-white p-2 rounded">
                { id ? "수정" : "등록"}
            </button>
        </div>
    )
}

export default BoardWrite;