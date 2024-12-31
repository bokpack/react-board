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
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 bg-red-300 p-4 rounded">
                <h2>Login</h2>
                <div>
                    <label>이메일:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@example.com"
                        className="border"
                    />
                </div>
                <div>
                    <label>비밀번호:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border"
                    />
                </div>
                <div>
                    <button className="bg-green-500 text-white p-1 rounded">로그인</button>
                </div>
            </div>
        </form>
    );
}

export default Login;
