import {use, useState} from "react";
import DropDown from "./DropDown";

const SearchBar = ({options, onSearch}) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleSearch = () => {
        if(searchQuery.trim() === "") {
            alert("검색어를 입력해주세요")
            return;
        } onSearch(searchQuery,selectedOption.toLowerCase());
    };
    return (
        <div>
            <DropDown options={options} selectedOption={setSelectedOption} setSelectedOption={setSelectedOption}/>
            <input type=text value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="검색어를 입력하세요" className="px-4 py-2 rounded border"/>
            <button onClick={handleSearch} className="px-4 py-2 bg-lime-400 text-white rounded">검색</button>
        </div>
    )
}
export default SearchBar;