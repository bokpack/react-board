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
        <nav className="relative flex flex-wrap justify-between items-center p-4 bg-indigo-400 text-white">

    <Link to="/" className="text-lg font-bold hover:text-gray-300">
        홈
    </Link>

    {/* 검색바 & 드롭다운 */}
    <div className="flex items-center gap-4 md:gap-6 order-3 md:order-2 w-full md:w-auto justify-center md:justify-center mt-4 md:mt-0">
        <DropDown toggleMenu="선택" options={dropDownOptions} onOptionSelect={handleOptionSelect} />
        <SearchBar onSearch={(query) => onSearch(query, selectedField)} />
    </div>

    {/* 로그인 회원가입 (데스크탑 전용) */}
    <div className="hidden md:flex items-center gap-4 order-2 md:order-3">
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

    {/* 모바일 - 햄버거 버튼 (중간 크기에서도 활성화) */}
    <div className="md:hidden order-1 md:order-3">
        <button onClick={toggleMenu} className="text-white">
            {isMenuOpen ? "☰" : "☰"}
        </button>
    </div>

    {/* 모바일 - 메뉴 (중간 크기에서도 활성화) */}
    {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={toggleMenu}>
            <div className="absolute top-16 right-4 bg-white text-black p-4 rounded shadow-lg w-40">
                <button
                    onClick={toggleMenu}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                >
                    &#x2715;
                </button>
                <div className="flex flex-col items-center mt-4">
                    {isAuthenticated ? (
                        <Logout setIsAuthenticated={setIsAuthenticated} />
                    ) : (
                        <>
                            <Link to="/login" className="block mb-2 px-4 py-2 border-2 hover:bg-gray-200 rounded w-full text-center">
                                로그인
                            </Link>
                            <Link to="/signup" className="block mb-2 px-4 py-2 border-2 hover:bg-gray-200 rounded w-full text-center">
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )}
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