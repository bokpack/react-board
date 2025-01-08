import {use, useState} from "react";


const SearchBar = ({onSearch}) => {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = () => {
        if(searchQuery.trim() === "") {
            alert("검색어를 입력해주세요")
            return;
        } onSearch(searchQuery);
    };
    return (
        <div className="flex items-center gap-2">
            <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="검색어를 입력하세요" className="text-gray-400 px-4 py-2 rounded border"/>
            <button onClick={handleSearch} className="px-4 py-2 bg-lime-400 text-white rounded">검색</button>
        </div>
    )
}
export default SearchBar;