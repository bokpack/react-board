import { Link } from "react-router-dom";
import Logout from "./Logout";
import { useState } from "react";
import DropDown from "./DropDown";
import SearchBar from "./SearchBar";

const NavBar = ({ isAuthenticated, setIsAuthenticated, onSearch }) => {
    const dropDownOptions = [
        { label: "제목", value: "title" },
        { label: "내용", value: "content" },
        { label: "작성자", value: "writer" },
    ];

    const [selectedField, setSelectedField] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일용 메뉴 열기/닫기 상태

    const handleOptionSelect = (selectedOption) => {
        console.log("선택된 옵션 : ", selectedOption);
        setSelectedField(selectedOption);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="flex justify-between items-center p-4 bg-indigo-400 text-white">
            {/* 로고 */}
            <Link to="/" className="text-lg font-bold hover:text-gray-300">
                홈
            </Link>

            {/* 작은 화면에서 드롭다운과 검색바를 하나로 묶음 */}
            <div className="flex items-center gap-4 sm:gap-6">
                <DropDown toggleMenu="선택" options={dropDownOptions} onOptionSelect={handleOptionSelect} />
                <SearchBar onSearch={(query) => onSearch(query, selectedField)} />
            </div>

            {/* 로그인/회원가입, 로그아웃 버튼 */}
            <div className="hidden sm:flex items-center gap-4">
                {isAuthenticated ? (
                    <Logout setIsAuthenticated={setIsAuthenticated} />
                ) : (
                    <>
                        <Link to="/login" className="px-4 py-2 border-2 hover:bg-white hover:text-black rounded">
                            로그인
                        </Link>
                        <Link to="/signup" className="px-4 py-2 border-2 hover:bg-white hover:text-black rounded">
                            회원가입
                        </Link>
                    </>
                )}
            </div>

            {/* 모바일에서 햄버거 메뉴 */}
            <div className="sm:hidden">
                <button onClick={toggleMenu} className="text-white">
                    {isMenuOpen ? "닫기" : "☰"}
                </button>

                {/* 모바일 메뉴가 열리면 로그인, 회원가입 버튼 표시 */}
                {isMenuOpen && (
                    <div className="absolute top-16 right-4 bg-white text-black p-4 rounded shadow-lg w-40">
                        <div className="flex flex-col items-center">
                            {isAuthenticated ? (
                                <Logout setIsAuthenticated={setIsAuthenticated} />
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block mb-2 px-4 py-2 border-2 hover:bg-white hover:text-black rounded"
                                    >
                                        로그인
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block mb-2 px-4 py-2 border-2 hover:bg-white hover:text-black rounded"
                                    >
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;








// 반응형 적용 전
// import { Link, useNavigate } from "react-router-dom"
// import Logout from "./Logout";
// import {useState} from "react";
// import DropDown from "./DropDown";
// import SearchBar from "./SearchBar";
//
//
// const NavBar = ({ isAuthenticated, setIsAuthenticated, onSearch }) => {
//     const dropDownOptions =[ {label : "제목", value : "title"}, {label : "내용", value : "content"},{label : "작성자", value : "writer"} ]
//     const [selectedField, setSelectedField] = useState("");
//
//     const handleOptionSelect = (selectedOption) => {
//       console.log("선택된 옵션 : ", selectedOption)
//       setSelectedField(selectedOption);
//     }
//     return (
//         <nav className="flex justify-between items-center p-4 bg-indigo-400 text-white">
//             <Link to="/" className="text-lg font-bold hover:text-gray-300">
//                 홈
//             </Link>
//             <div className="flex items-start gap-4">
//               <DropDown toggleMenu="선택" options={dropDownOptions} onOptionSelect={handleOptionSelect}/>
//               <SearchBar onSearch={(query) => onSearch(query,selectedField)} />
//             </div>
//         <div>
//         {isAuthenticated ? (
//           // Logout 컴포넌트 재사용
//           <Logout setIsAuthenticated={setIsAuthenticated} />
//         ) : (
//           <>
//             <Link
//               to="/login"
//               className="mr-4 px-4 py-2 border-2 hover:bg-white hover:text-black rounded"
//             >
//               로그인
//             </Link>
//             <Link
//               to="/signup"
//               className="px-4 py-2 border-2 hover:bg-white hover:text-black rounded"
//             >
//               회원가입
//             </Link>
//           </>
//         )}
//       </div>
//
//
//       </nav>
//     )
// }
// export default NavBar;