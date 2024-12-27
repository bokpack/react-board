import React, { useState } from "react";

function Login() {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    const onIdHandler = (e) => {
        setId(e.currentTarget.value)
    }

    const onPwHandler = (e) => {
        setPw(e.currentTarget.value)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        console.log("ID : ", id);
        console.log("PW : ", pw);
    }

    return(
        <form onSubmit={onSubmitHandler}>
            <div className=" flex flex-col gap-4 bg-red-300 p-4 rounded">
                <h2>Login</h2>
                <div>
                    <label>ID : </label>
                    <input type="id" value={id} onChange={onIdHandler} className="border"></input>
                </div>
                <div>
                    <label>PW : </label>
                    <input type="password" value={pw} onChange={onPwHandler} className="border"></input>
                </div>
                <div>
                    <button className="bg-green-500 text-white p-1 rounded">로그인</button>
                </div>
            </div>
        </form>
       
        
    )
}

export default Login;