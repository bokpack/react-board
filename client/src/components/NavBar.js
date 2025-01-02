import { Link, useNavigate } from "react-router-dom"

const NavBar = ({ isAuthenticated , setIsAuthenticated}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate("/")
    }

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <Link to="/" className="text-lg font-bold">
                홈
            </Link>
            <div>
                {isAuthenticated ? (
                    <>
                        <button onClick={handleLogout}
                                className="mr-4 px-4 pt-2 bg-green-500 rounded">
                                로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mr-4 px-4 pt-2 bg-green-500 rounded">
                            로그인
                        </Link>
                        <Link to="/signup" className="px-4 py-2 bg-green-500 rounded">
                            회원가입
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
export default NavBar;