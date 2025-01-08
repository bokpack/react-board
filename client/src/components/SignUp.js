import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";

function SignUp() {
    const [name , setName] = useState("");
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, SetConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emilReggex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emilReggex.test(email);
    }

    const validatePassword = (password) => {
        const passwordReggex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,16}$/;
        return passwordReggex.test(password);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if(!name) {
            newErrors.name = "이름을 임력해주세요";
        } else if (name.length < 2 || name.length > 5) {
            newErrors.name="이름은 2자 이상, 5자 이하여야 합니다."
        }
        if(!email) {
            newErrors.email = "이메일을 입력해주세요";
        } else if (!validateEmail(email)) {
            newErrors.email="올바른 이메일 형식을 입력해주세요."
        }
        if(!password) {
            newErrors.password = "비밀번호를 입력해주세요"
        } else if(!validatePassword(password)) {
            newErrors.password = "비밀번호는 8~16자의 영문, 숫자, 특수문자를 포함해야합니다."
        }
        if(!confirmPassword) {
            newErrors.confirmPassword = "비밀번호 확인을 입력해주세요."
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "비밀번호와 비밀번호 확인이 일치하지 않습니다."
        }

        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await signupUser({name, email, password})
            if(response.data.success) {
                alert("회원가입 성공 ! ")
                navigate("/login")
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            console.error("회원가입 실패 : ", err.response?.data || err.message);
            alert("회원가입에 실패했습니다.")
        }

    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border w-96">
            <div className="flex flex-col items-center gap-4">
                <p className="text-2xl font-bold">회원가입</p>
                <div>
                    <p className="font-bold">이름 *</p>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="border-b-2 w-80 h-10 " placeholder="이름을 입력해주세요"  />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <p className="font-bold">이메일 주소 *</p>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="border-b-2 w-80 h-10 " placeholder="ID@example.com"  />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <p className="font-bold">비밀번호 *</p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-b-2 w-80 h-10 " placeholder="비밀번호"  />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div>
                    <p className="font-bold">비밀번호 확인 *</p>
                    <input type="password" value={confirmPassword} onChange={(e) => SetConfirmPassword(e.target.value)} className="border-b-2 w-80 h-10 " placeholder="비밀번호 확인"  />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <div>
                    <button className="bg-lime-400 text-white w-80 h-8 p-1 rounded">회원가입</button>
                </div>
            </div>
            </form>
        </div>
    )

}
export default SignUp;