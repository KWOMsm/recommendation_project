// https://gongbu-ing.tistory.com/32 원본
// https://gist.github.com/livelikeabel/909d5dc35e96e3f0bed0cd28cddcdeaf 
// https://velopert.com/294
// 공부 참고

var fs = require('fs');
var express = require('express'); // Express 사용
var db_config = require(__dirname + '/config/database.js'); // database.js 파일을 불러와서 사용 (mysql 정보있음)
var conn = db_config.init(); // database.js에 있는 init 함수 이용
db_config.connect(conn); // database.js에 있는 connect 함수로 연결

var session = require('express-session'); // 세션 기능
var FileStore = require('session-file-store')(session);
var cookieParser = require('cookie-parser'); // 쿠기 기능
//var crypto = require('crypto');

const ejsLint = require('ejs-lint');

// 유튜브 정보 가져오는 파일 부르기
var youtubeData = require('./youtube.js');

var app = express();
app.set('views', __dirname + '/views'); // view 경로 설정
app.use(express.static('views'));
app.set('view engine', 'ejs'); // 화면 engine을 ejs로 설정
app.engine('html', require('ejs').renderFile);
app.use(express.json()); // bodyParser의 기능인데 express로 사용가능
app.use(express.urlencoded({ extended: false })); // https://sjh836.tistory.com/154
app.use(session({
    secret: 'kwonSM',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));



// 기본 경로일때는 Root 출력
app.get('/', function(req, res) {
    if (req.session.is_logined == true) { // 로그인이 되있는 상태면
        res.redirect('/main');
    } else { // 로그인이 안되어있다면
        res.render('index', { // index 페이지로 간다
            is_logined: false
        });
    }
});

// main 페이지
app.get('/main', (req, res) => {
    youtubeData.parse(req.session.hobby);

    function readData() {
        const dataBuffer = fs.readFileSync('./youtube_title.json');

        const dataJSON = dataBuffer.toString();
        const datas = JSON.parse(dataJSON);

        res.render('main', { // 정보전달
            id: req.session.userId,
            hobby: req.session.hobby,
            is_logined: true,
            datas: datas
        });
    }
    setTimeout(readData, 1000);

});

// 초기 화면
app.get('/index', function(req, res) {
    res.render('index.ejs');
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

// 3000
app.listen(3000, () => console.log('Server is running on port 3000...'));