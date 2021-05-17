// https://gongbu-ing.tistory.com/32 원본
// https://gist.github.com/livelikeabel/909d5dc35e96e3f0bed0cd28cddcdeaf 
// https://velopert.com/294
// 공부 참고

var fs = require('fs');

// node.js의 웹프레임워크 사용하면 좋다.
// Express 사용
var express = require('express');
var app = express();

// database.js 파일을 불러와서 사용 (mysql 정보있음)
var db_config = require(__dirname + '/config/database.js');
// database.js에 있는 init 함수 이용
var conn = db_config.init();

// 최근부터 bodyParser에 있는 기능을 express에서 수행할 수 있음
//var bodyParser = require('body-parser');

var session = require('express-session');
//var crypto = require('crypto');
var FileStore = require('session-file-store')(session);
var cookieParser = require('cookie-parser');


// database.js에 있는 connect 함수로 연결
db_config.connect(conn);

// view 경로 설정
app.set('views', __dirname + '/views');

app.use(express.static('views'));

// 화면 engine을 ejs로 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// bodyParser의 기능인데 express로 사용가능
app.use(express.json());

// https://sjh836.tistory.com/154
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'kwonSM',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

// 기본 경로일때는 Root 출력
app.get('/', function(req, res) {
    if (req.session.is_logined == true) { // 로그인이 되있는 상태면
        res.render('main', { // main 페이지로간다
            is_logined: req.session.is_logined,
            id: req.session.userId
        });
    } else { // 로그인이 안되어있다면
        res.render('index', { // index 페이지로 간다
            is_logined: false
        });
    }
});


// 회원가입
app.get('/register', function(req, res) {
    console.log('회원가입 페이지');
    res.render('register', { pass: true });
});

app.post('/register', function(req, res) {
    console.log('회원가입 하는중')
    const body = req.body;
    const id = body.id;
    const pw = body.pw;
    const hobby = body.hobby;

    conn.query('select * from userData where id=?', [id], function(err, data) {
        if (data.length == 0) {
            console.log('회원가입 성공');
            conn.query('insert into userData(id, pw, hobby) values(?,?,?)', [
                id, pw, hobby
            ]);
            res.redirect('/');
        } else {
            console.log('회원가입 실패');
            res.render('register', { pass: false });
            //res.send('<script>alert("회원가입 실패");</script>');

        }
    });
});

// 로그인
app.get('/login', (req, res) => {
    console.log('로그인 작동');
    res.render('login', { pass: true });
});

app.post('/login', (req, res) => {
    const body = req.body;
    const id = body.id;
    const pw = body.pw;

    conn.query('select * from userData where id=?', [id], function(err, data) {
        // 로그인 확인
        if (!data[0]) {
            console.log('로그인 실패');
            res.render('login', { pass: false });
        } else if (id == data[0].id && pw == data[0].pw) {
            console.log('로그인 성공');
            // 세션에 추가
            req.session.is_logined = true;
            console.log(data[0].id);
            req.session.userId = data[0].id;
            //req.session.pw = data[0].pw;
            req.session.hobby = data[0].hobby;
            req.session.save(function() {
                res.redirect('/main');
            });

        } else {
            console.log('로그인 실패');
            res.render('login', { pass: false });
        }
    });
});

// 로그아웃
app.get('/logout', (req, res) => {
    console.log('로그아웃 성공');
    req.session.destroy(function(err) {
        // 세션 파괴후 할 것들
        res.redirect('/');
    });
});

app.get('/index', function(req, res) {
    res.render('index.ejs');
});

// 정보 변경
app.get('/change', (req, res) => {
    console.log('정보 변경 중');
    res.render('change');
});

app.post('/change', function(req, res) {
    console.log('정보 변경 중')
    const body = req.body;
    const id = req.session.userId;
    const hobby = body.hobby;
    console.log(id);

    conn.query('UPDATE userData SET hobby=? where id=?', [hobby, id], function(err, data) {
        if (err) {
            console.log(err);
            res.status(404).send('Server Error');
        } else {
            req.session.hobby = hobby;
            req.session.save(function() {
                res.redirect('/main');
            });
        }
    });
});

app.get('/main', (req, res) => {
    console.log(req.session.userId);
    res.render('main', { // 정보전달
        id: req.session.userId,
        hobby: req.session.hobby,
        is_logined: true
    });
})

// /list 페이지일때
app.get('/list', function(req, res) {
    // sql문 작성
    var sql = 'SELECT * FROM userInfo';

    // db에 query를 날린다. 1번째 인자로 sql문과, 배열 안에 담긴 값들, 그리고 함수를 전달한다.
    conn.query(sql, function(err, rows, fields) {
        if (err) console.log('query is not excuted. select fail...\n' + err); // 오류 났을 때
        else res.render('list.ejs', { list: rows });
        // list.ejs 파일에 
    });
});

app.get('/write', function(req, res) {
    res.render('write.ejs');
});

app.post('/writeAf', function(req, res) {
    var body = req.body;
    console.log(body);

    var sql = 'INSERT INTO userInfo(id, userName, interest) VALUES(?, ?, ?)';
    var params = [body.id, body.userName, body.interest];
    console.log(sql);
    conn.query(sql, params, function(err) {
        if (err) console.log('query is not excuted. insert fail...\n' + err);
        else res.redirect('/list', );
    });
});

// 3000
app.listen(3000, () => console.log('Server is running on port 3000...'));