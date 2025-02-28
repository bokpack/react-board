import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        alert("로그아웃 성공!");
        navigate("/");
      })
      .catch((err) => {
        alert("로그아웃 실패: " + err);
      });
  };

  return <button onClick={handleLogout} className="border rounded p-2">로그아웃</button>;
}

export default Logout;




// Redux 적용 전의 코드
// import { useNavigate } from "react-router-dom";
// import { logoutUser } from "../services/api";

// function Logout({setIsAuthenticated}) {
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         try {
//             const response = await logoutUser();
//             console.log("로그아웃 응답 : ", response.data)
//             if (response.data.success) {
//                 alert(response.data.message);
//                 setIsAuthenticated(false)
//                 navigate("/")
//             } else {
//                 alert("로그아웃 실패 : " + response.data.message);
//             }
//         } catch (err) {
//             console.error("로그아웃 실패 : ", err.response?.data || err.message);
//             alert("로그아웃 처리중 오류가 발생했습니다")
//         }
//     };
//     return <button onClick={handleLogout} className="border rounded p-2">로그아웃</button>
// }
// export default Logout;