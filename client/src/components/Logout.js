import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            console.log("로그아웃 응답 : ", response.data)
            if (response.data.success) {
                alert(response.data.message);
                navigate("/")
            } else {
                alert("로그아웃 실패 : " + response.data.message);
            }
        } catch (err) {
            console.error("로그아웃 실패 : ", err.response?.data || err.message);
            alert("로그아웃 처리중 오류가 발생했습니다")
        }
    };
    return <button onClick={handleLogout}>로그아웃웃</button>
}
export default Logout;