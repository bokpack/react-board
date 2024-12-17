const express = require('express');
const cors = require('cors');
const mysql = require('mysql')
const app = express();
const PORT = 8000;

const db = mysql.createConnection({
    host: "localhost",
    port:"3306",
    user: "root",
    password: "1111",
    database:"easyboard"
})

db.connect(err => { if (err) console.log("MySQL 연결 실패 : ", err); console.log("MySQL가 연결되었습니다!"); }) // 오류해결 https://www.inflearn.com/questions/3637

app.use(cors());
app.use(express.json());

// insert에 들어온 data를 쿼리에 전송하는 것 
app.post("/api/insert", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const date = req.body.date;
    
    const sqlQuery = "INSERT INTO board (title, content, date) VALUES (?,?,?)";
    db.query(sqlQuery, [title, content, date], (err, result) => {
        if (err) {
            console.error("MySQL 쿼리 오류: ", err);  // 오류를 콘솔에 출력
            return res.status(500).send('서버 오류');
        }
        console.log('데이터 삽입 성공:', result);
        res.send('succ');
    });
});


app.listen(PORT, ()=>{
    console.log(`포트 ${PORT}번으로 서버를 열었습니다.`);
});