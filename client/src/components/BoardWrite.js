import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BoardWrite = ({ posts,onSubmit }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({title : "", content : ""});

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
            const updatePost = {...formData, id: parseInt(id,10)}
            onSubmit(updatePost);
            navigate("/")
        } else {
            alert("제목과 내용을 입력해주세요 ~ ")
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
                등록
            </button>
        </div>
    )
}

export default BoardWrite;