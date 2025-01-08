import { Link, useNavigate } from "react-router-dom"
import Logout from "./Logout";
import {useState} from "react";
import DropDown from "./DropDown";
import SearchBar from "./SearchBar";


const NavBar = ({ isAuthenticated, setIsAuthenticated, onSearch }) => {
    const dropDownOptions =[ {label : "제목", value : "title"}, {label : "내용", value : "content"},{label : "작성자", value : "writer"} ]
    const [selectedField, setSelectedField] = useState("");

    const handleOptionSelect = (selectedOption) => {
      console.log("선택된 옵션 : ", selectedOption)
      setSelectedField(selectedOption);
    }
    return (
        <nav className="flex justify-between items-center p-4 bg-indigo-400 text-white">
            <Link to="/" className="text-lg font-bold hover:text-gray-300">
                홈
            </Link>
            <div className="flex items-start gap-4">
              <DropDown toggleMenu="선택" options={dropDownOptions} onOptionSelect={handleOptionSelect}/>
              <SearchBar onSearch={(query) => onSearch(query,selectedField)} />
            </div>
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