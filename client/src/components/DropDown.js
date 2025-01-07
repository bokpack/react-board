import {useState} from "react";

const DropDown= ({toggleMenu = "", options = []}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption , setSelectedOption] = useState(null);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    }

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
    }
    return (
        <div className="relative">
            <div
                onClick={toggleDropdown}
                className="flex items-center px-4 py-2 bg-lime-400 text-white rounded cursor-pointer w-24">
                {selectedOption || toggleMenu}
                <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
                <div className="absolute mt-2 bg-white text-gray-500 border rounded shadow-lg w-24">
                    <ul className="flex flex-col">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )

}
export default DropDown;