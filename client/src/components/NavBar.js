import { Link, useNavigate } from "react-router-dom"
import Logout from "./Logout";


const NavBar = ({ isAuthenticated, setIsAuthenticated }) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <Link to="/" className="text-lg font-bold hover:text-gray-300">
          홈
        </Link>
        <div>
        {isAuthenticated ? (
          // Logout 컴포넌트 재사용
          <Logout setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <>
            <Link
              to="/login"
              className="mr-4 px-4 py-2 border-2 hover:bg-white hover:text-black rounded"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 border-2 hover:bg-white hover:text-black rounded"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
        
        
      </nav>
    )
}
export default NavBar;