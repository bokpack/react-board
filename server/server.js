const express = require('express');
const cors = require('cors');
const mysql = require('mysql2')
const app = express();
const PORT = 8000;
const bcrypt = require("bcrypt");
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

// 파일 서빙해주는 코드 추가
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


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
        console.log("쿼리 결과: ", result);
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
    console.log("살세조회 요청 id : ", id)
    const incrementQuery = "UPDATE board SET view_count = view_count + 1 WHERE id = ?";
    const selectQuery = ` SELECT b.id, b.title, b.content,  b.date, b.view_count, u.name AS writer
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
    const sqlQuery = `SELECT c.id ,c.content ,c.date, u.name AS writer
                      FROM comments c
                      JOIN user u ON c.user_id = u.id
                      WHERE c.board_id = ?
                      ORDER BY c.date ASC`;
    db.query(sqlQuery, [postId], (err,results) => {
        if (err) {
            console.error("댓글 조회 실패 : ", err);
            return res.status(500).send("댓글 조회 실패")
        }
        res.send({success : true, data : results})
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
        const selectQuery = `
            SELECT c.id, c.content, c.date, u.name AS writer
            FROM comments c
            JOIN user u ON c.user_id = u.id
            WHERE c.id = ?
        `;
        db.query(selectQuery, [result.insertId], (err, rows) => {
            if (err) {
                console.error("댓글 조회 실패:", err);
                return res.status(500).send("댓글 조회 실패");
            }
        res.send({success: true, comment : rows[0]})
    })
})
});

// UPDATE 댓글 수정 
app.put("/api/comment/:commentId", (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId || isNaN(Number(commentId))) {
        console.error("유효하지 않은 댓글 id : ", commentId);
        return res.status(400).send({ success: false, message: "잘못된 댓글 id 입니다" });
    }

    const sqlQuery = `
        UPDATE comments 
        SET content = ?, date = NOW() 
        WHERE id = ?
    `;

    db.query(sqlQuery, [content, commentId], (err, result) => {
        if (err) {
            console.error("MYSQL 쿼리 오류 : ", err);
            return res.status(500).send("서버 오류");
        }

        // 수정된 댓글 데이터를 다시 조회
        const selectQuery = `
            SELECT c.id, c.content, c.date, u.name AS writer
            FROM comments c
            JOIN user u ON c.user_id = u.id
            WHERE c.id = ?
        `;

        db.query(selectQuery, [commentId], (err, rows) => {
            if (err) {
                console.error("수정된 댓글 조회 실패 : ", err);
                return res.status(500).send("수정된 댓글 조회 실패");
            }

            res.send({
                success: true,
                comment: rows[0], // 수정된 댓글 데이터 반환
            });
        });
    });
});

// DELETE 댓글 삭제
app.delete("/api/comment/:commentId", (req,res) => {
    const { commentId } = req.params;
    const userId = req.session.user?.id;

    if(!userId) {
        return res.status(401).send({success : false, message : "로그인이 필요합니다"})
    }

    const checkQuery = "SELECT user_id FROM comments WHERE id = ?";
    db.query(checkQuery, [commentId], (err, results) => {
        if(err) {
            console.error("댓글 작성자 확인 실패 : ", err);
            return res.status(500).send("서버오류")
        }
        if(results.length === 0) {
            return  res.status(404).send({success : false, message : "댓글을 찾을 수 없습니다"})
        }

        const deleteQuery = "DELETE FROM comments WHERE id = ?";
        db.query(deleteQuery, [commentId], (err, results) => {
            if(err) {
                console.error("댓글 삭제 실패 : ", err);
                return res.status(500).send("댓글 삭제 실패")
            }
            res.send({success : true, message : "댓글이 삭제되었습니다"})
        })
    })
})

// GET 게시글 검색
app.get("/api/search", (req, res) => {
    const { query, field } = req.query;

    if (!query || !field) {
        return res.status(400).send({ success: false, message: "검색어와 필드를 입력해주세요" });
    }
    const allowedFields = ["title", "content", "writer"]
    if(!allowedFields.includes(field)) {
        return res.status(400).send({success : false, message : "유효하지 않은 검색필드입니다."})
    }
    const dbField = field === "writer" ? "u.name" : `b.${field}`

    let sqlQuery = `SELECT b.id, b.title, b.content, b.date, b.view_count, u.name AS writer
                    FROM board b
                    JOIN user u ON b.user_id = u.id
                    WHERE ${dbField} LIKE ?`;

    db.query(sqlQuery, [`%${query}%`], (err, result) => {
        if (err) {
            console.error("검색 오류:", err);
            return res.status(500).send("서버 오류");
        }
        res.send(result);
    });
});

//POST 회원가입
app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ success: false, message: "모든 필드를 입력해주세요." });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ success: false, message: "이메일 형식이 올바르지 않습니다." });
    }

    // 비밀번호 형식 검증
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_]).{8,16}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send({
            success: false,
            message: "비밀번호는 8~16자의 영문, 숫자, 특수문자를 포함해야 합니다.",
        });
    }

    try {
        // 이메일 중복 확인
        const emailCheckQuery = "SELECT * FROM user WHERE email = ?";
        const [emailCheckResult] = await db.promise().query(emailCheckQuery, [email]);
        if (emailCheckResult.length > 0) {
            return res.status(400).send({ success: false, message: "이미 사용 중인 이메일입니다." });
        }

        // 이름 중복 확인
        const nameCheckQuery = "SELECT * FROM user WHERE name = ?";
        const [nameCheckResult] = await db.promise().query(nameCheckQuery, [name]);
        if (nameCheckResult.length > 0) {
            return res.status(400).send({ success: false, message: "이미 사용 중인 이름입니다." });
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 저장
        const insertUserQuery = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
        const [result] = await db.promise().query(insertUserQuery, [name, email, hashedPassword]);

        
        req.session.user = {
            id: result.insertId,
            name,
            email
        }

        res.send({ success: true, message: "회원가입 성공 및 자동 로그인 완료", user: req.session.user });
    } catch (err) {
        console.error("회원가입 실패:", err);
        res.status(500).send({ success: false, message: "서버 오류로 회원가입에 실패했습니다." });
    }
});



app.listen(PORT, ()=>{
    console.log(`포트 ${PORT}번으로 서버를 열었습니다.`);
});