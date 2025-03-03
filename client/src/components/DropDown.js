import { useState } from "react";
const DropDown = ({ options = [], selectedField,setSelectedField  }) => {
    const [isOpen, setIsOpen] = useState(false);
    

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedField(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div
                onClick={toggleDropdown}
                className="flex justify-center px-4 py-2 bg-lime-400 text-white rounded cursor-pointer w-28 gap-3"
            >
                {selectedField ? options.find((opt) => opt.value === selectedField)?.label : "선택"}
                <span>{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
                <div className="absolute mt-2 bg-white text-gray-500 border rounded shadow-lg w-24 z-10">
                    <ul className="flex flex-col">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropDown;





// 반응형 적용 전
// import {useState} from "react";
//
// const DropDown= ({toggleMenu = "", options = [], onOptionSelect}) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedOption , setSelectedOption] = useState(null);
//
//     const toggleDropdown = () => {
//         setIsOpen(!isOpen);
//     }
//
//     const handleOptionClick = (option) => {
//         setSelectedOption(option.label);
//         setIsOpen(false);
//         onOptionSelect(option.value);
//     }
//     return (
//         <div className="relative">
//             <div
//                 onClick={toggleDropdown}
//                 className="flex justify-center px-4 py-2 bg-lime-400 text-white rounded cursor-pointer w-28 gap-3">
//                 {selectedOption || toggleMenu}
//                 <span className="">{isOpen ? "▲" : "▼"}</span>
//             </div>
//             {isOpen && (
//                 <div className="absolute mt-2 bg-white text-gray-500 border rounded shadow-lg w-24">
//                     <ul className="flex flex-col">
//                         {options.map((option, index) => (
//                             <li
//                                 key={index}
//                                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                 onClick={() => handleOptionClick(option)}
//                             >
//                                 {option.label}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     )
//
// }
// export default DropDown;