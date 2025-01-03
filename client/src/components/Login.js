import React, { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Login({setIsAuthenticated}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("로그인 요청 데이터:", { email, password });

        try {
            const response = await loginUser({ email, password });
            console.log("서버 응답:", response.data);

            if (response.data.success) {
                alert(response.data.message);
                setIsAuthenticated(true)
                console.log("로그인 성공 사용자:", response.data.user);
                navigate("/board");
            } else {
                alert("로그인 실패: " + response.data.message);
            }
        } catch (err) {
            console.error("로그인 실패:", err.response?.data || err.message);
            alert(err.response?.data || "로그인에 실패했습니다.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border w-96">
            <div className="flex flex-col items-center gap-4 ">
                <p className="text-2xl font-bold">로그인</p>
                <div>
                    {/* <label>이메일:</label> */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일을 입력해주세요."
                        className="border w-80 h-10 rounded"
                    />
                </div>
                <div>
                    {/* <label>비밀번호:</label> */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border w-80 h-10 rounded"
                        placeholder="비밀번호를 입력해주세요."
                    />
                </div>
                <div>
                    <button className="bg-green-500 text-white w-80 h-8  p-1 rounded">로그인</button>
                </div>
            </div>
            </form>
        </div>
    );
}

export default Login;
