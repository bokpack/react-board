const express = require('express');
const cors = require('cors');
const mysql = require('mysql')
const app = express();
const PORT = 8000;

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