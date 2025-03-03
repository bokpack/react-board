import { useState } from "react";

const SearchBar = ({ onSearch,searchQuery, setSearchQuery }) => {

    const handleSearch = () => {
        if (searchQuery.trim() === "") {
            alert("검색어를 입력해주세요");
            return;
        }
        onSearch(searchQuery);
    };

    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            handleSearch();
        }
    }

    return (
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
                type="text"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요"
                className="text-gray-400 px-4 py-2 rounded border w-full sm:w-56"
            />
            <button onClick={handleSearch} className="px-4 py-2 bg-lime-400 text-white rounded w-full sm:w-auto">
                검색
            </button>
        </div>
    );
};

export default SearchBar;



// 반응형 적용 전
// import {use, useState} from "react";
//
//
// const SearchBar = ({onSearch}) => {
//     const [searchQuery, setSearchQuery] = useState("")
//
//     const handleSearch = () => {
//         if(searchQuery.trim() === "") {
//             alert("검색어를 입력해주세요")
//             return;
//         } onSearch(searchQuery);
//     };
//     return (
//         <div className="flex items-center gap-2">
//             <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="검색어를 입력하세요" className="text-gray-400 px-4 py-2 rounded border"/>
//             <button onClick={handleSearch} className="px-4 py-2 bg-lime-400 text-white rounded">검색</button>
//         </div>
//     )
// }
// export default SearchBar;