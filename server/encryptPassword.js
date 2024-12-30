const bcrypt = require("bcrypt");

const plainPassword = "zzz123"
    bcrypt.hash(plainPassword, 10, (err,hash) => {
        if(err) {
            console.log("비밀번호 해시오류 : ", err);
        } else {
            console.log("암호화된 비밀번호 : ", hash)
        }
    })
