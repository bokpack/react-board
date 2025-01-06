const express = require('express');
const cors = require('cors');
const mysql = require('mysql')
const app = express();
const PORT = 8000;
const bcrypt = require("bcrypt");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const db = mysql.createConnection({
    host: "localhost",
    port:"3306",
    user: "root",
    password: "ann123123",
    database:"easyboard"
})

db.connect(err => { if (err) console.log("MySQL 연결 실패 : ", err); console.log("MySQL가 연결되었습니다!"); });

const sessionStore = new MySQLStore({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "ann123123",
    database: "easyboard"
});


app.use(session({  
    key: 'session_cookie_name',
    secret: '~',
    store: sessionStore,
    resave: false,
    saveUninitialized: false

}))

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
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
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ success: false, message: "비밀번호가 일치하지 않습니다" });
        }

        req.session.user = {
            id : user.id,
            name: user.name,
            email:user.email
        }
        res.send({
            success:true,
            message:"로그인 성공",
            user: req.session.user
        })

            
    });
});

// 로그아웃
app.post("/api/logout", (req,res) => {
    req.session.destroy(err => {
        if(err) {
            return res.status(500).send({success : false, message : "로그아웃 실패"});
        }
        res.clearCookie("session_cookie_name")
        res.send({success : true, message:"로그아웃 성공"})
    })
})

// 로그인 상태 유지
app.get("/api/session", (req,res) => {
    if(req.session.user) {
        res.send({
            success:true,
            user:req.session.user
        });
    } else {
        res.send({
            success:false,
            message:"로그인되어있지않습니다."
        })
    }
})




// INSERT 게시글 등록
app.post("/api/insert", (req, res) => {
    const { title, content } = req.body;
    const userId = req.session.user?.id;

    if(!userId) {
        return res.status(401).send({success : false , message : "로그인 필요"})
    }

    const sqlQuery = "INSERT INTO board (title, content, date, user_id) VALUES (?, ?, NOW(), ?)"; 
    db.query(sqlQuery, [title, content, userId], (err, result) => {
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
    const sqlQuery = 
        `SELECT b.id, b.title, b.content, b.date, b.view_count, u.name AS writer
        FROM board b 
        JOIN user u ON b.user_id = u.id `;
    db.query(sqlQuery, (err, result)=> {
        if(err) {
            console.error("MySQL 쿼리 오류 : ", err);
            return res.status(500).send("서버오류")
        }
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

// GET 게시글 상세조회 및 조회수
app.get("/api/detail/:id", (req, res) => {
    const { id } = req.params;

    const incrementQuery = "UPDATE board SET view_count = view_count + 1 WHERE id = ?";
    const selectQuery = ` SELECT b.id, b.title, b.date, b.view_count, u.name AS writer
                            FROM board b JOIN user u ON b.user_id = u.id WHERE b.id = ?`;
    db.query(incrementQuery, [id], (err) => {
        if(err) {
            console.error("조회수 증가 실패 : ", err);
            return res.status(500).send("조회수 증가 실패")
        }
        db.query(selectQuery , [id], (err, result) => {
            if(err) {
                console.error("게시글 조회 실패 : ", err);
                return res.status(500).send("게시글 조회 실패")
            }
            res.send(result[0]);
        })
    })
})

// GET 댓글 조회회
app.get("/api/comments/:postId", (req,res) => {
    const {postId} = req.params;
    const sqlQuery = `SELECT c.id ,c.content , c.date, u.name AS writer
                      FROM comments c
                      JOIN user u ON c.user_id = u.id
                      WHERE c.board_id = ?
                      ORDER BY c.date ASC`;
    db.query(sqlQuery, [postId], (err,results) => {
        if (err) {
            console.error("댓글 조회 실패 : ", err);
            return res.status(500).send("댓글 조회 실패")
        }
        res.send(results)
    })
})

//POST 댓글 등록
app.post("/api/comment/:postId", (req,res) => {
    const {postId} = req.params;
    const {content} = req.body;
    const userId = req.session.user?.id;

    if(!userId) {
        return res.status(400).send({success : false, message: "로그인이 필요합니다"})
    }
    const sqlQuery = "INSERT INTO comments (board_id, user_id, content, date) VALUES (?,?,?,NOW())";
    db.query(sqlQuery, [postId, userId, content], (err, result) => {
        if(err) {
            console.error("댓글 등록 실패 : ",err);
            return res.status(500).send("댓글 등록 실패")
        }
        res.send({success: true, commendId : result.insertId})
    })
})

// UPDATE 댓글 수정 
app.put("/api/comment/:commentId", (req,res) => {
    const {commentId} = req.params;
    const {content} = req.body;

    const sqlQuery = "UPDATE comments SET content = ? , date = NOW() WHERE id = ? ";
    db.query(sqlQuery , [content, commentId], (err,result) => {
        if(err) {
            console.log("MYSQL 쿼리 오류 : ", err);
            return res.status(500).send("서버오류")
        }
        console.log("댓글 수정 완료 : ", result);
        res.send("success")
    })
})


app.listen(PORT, ()=>{
    console.log(`포트 ${PORT}번으로 서버를 열었습니다.`);
});