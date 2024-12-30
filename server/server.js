const express = require('express');
const cors = require('cors');
const mysql = require('mysql')
const app = express();
const PORT = 8000;
const bcrypt = require("bcrypt");

const db = mysql.createConnection({
    host: "localhost",
    port:"3306",
    user: "root",
    password: "ann123123",
    database:"easyboard"
})

db.connect(err => { if (err) console.log("MySQL 연결 실패 : ", err); console.log("MySQL가 연결되었습니다!"); }) // 오류해결 https://www.inflearn.com/questions/3637

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"]
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(`요청경로: ${req.path}, 요청메소드: ${req.method}`);
    next();
})

// 사용자 로그인
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    console.log("로그인 요청 데이터:", { email, password });

    if (!email || !password) {
        return res.status(400).send({ success: false, message: "이메일과 비밀번호를 입력해주세요" });
    }

    const sqlQuery = "SELECT * FROM user WHERE email = ?";
    db.query(sqlQuery, [email], async (err, result) => {
        if (err) {
            console.error("MYSQL 쿼리 오류:", err);
            return res.status(500).send({ success: false, message: "서버 오류" });
        }

        if (result.length === 0) {
            return res.status(400).send({ success: false, message: "사용자를 찾을 수 없습니다" });
        }

        const user = result[0];
        try {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).send({ success: false, message: "비밀번호가 일치하지 않습니다" });
            }

            console.log("로그인 성공");
            res.send({
                success: true, // 클라이언트가 성공 여부를 확인하기 위해 추가
                message: "로그인 성공",
                user: { id: user.id, name: user.name, email: user.email }
            });
        } catch (compareError) {
            console.error("bcrypt 비교 오류:", compareError);
            return res.status(500).send({ success: false, message: "비밀번호 비교 중 오류가 발생했습니다" });
        }
    });
});


// INSERT 게시글 등록
app.post("/api/insert", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const sqlQuery = "INSERT INTO board (title, content, date) VALUES (?, ?, NOW())"; 
    db.query(sqlQuery, [title, content], (err, result) => {
        if (err) {
            console.error("MySQL 쿼리 오류: ", err); // 에러 로그 출력
            return res.status(500).send("서버 오류");
        }
        console.log("데이터 삽입 성공:", result);
        res.send("succ");
    });
});


// GET 게시글 전체 조회
app.get("/api/get", (req,res) => {
    const sqlQuery = "SELECT * FROM board;";
    db.query(sqlQuery, (err, result)=> {
        res.send(result);
    })
})

// UPDATE 게시글 수정
app.put("/api/update/:id", (req,res) => {
    const id = req.params.id;
    const { title, content } = req.body;

    const sqlQuery = "UPDATE board SET title = ?, content = ? WHERE id = ? ";
    db.query(sqlQuery, [title, content, id], (err, result) => {
        if(err) {
            console.log("MYSQL 쿼리 오류: ", err);
            return res.status(500).send("서버오류")
        }
        console.log("게시글 수정 성공 : ", result);
        res.send("success")
    })
})

// DELETE 게시글 삭제
app.delete("/api/delete/:id", (req,res) => {
    const id = req.params.id;
    console.log("삭제요청받은은 id : ", id)
    const sqlQuery = "DELETE FROM board WHERE id = ? "
    db.query(sqlQuery, [id], (err,result) => {
        if(err) {
            console.error("MYSQL 쿼리 오류 : ",err);
            return res.status(500).send('서버오류');
        }
        console.log('게시글 삭제 성공 : ',result);
        res.send(result);
    })
})

app.listen(PORT, ()=>{
    console.log(`포트 ${PORT}번으로 서버를 열었습니다.`);
});