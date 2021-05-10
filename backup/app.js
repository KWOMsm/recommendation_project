// https://gongbu-ing.tistory.com/32 원본
// https://gist.github.com/livelikeabel/909d5dc35e96e3f0bed0cd28cddcdeaf 
// https://velopert.com/294
// 공부 참고

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

// database.js에 있는 connect 함수로 연결
db_config.connect(conn);

// view 경로 설정
app.set('views', __dirname + '/views');

app.use(express.static('views'));

// 화면 engine을 ejs로 설정
// https://d2fault.github.io/2018/12/26/20181226-nodejs-html-load-with-express/
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// bodyParser의 기능인데 express로 사용가능
app.use(express.json());

// https://sjh836.tistory.com/154
app.use(express.urlencoded({ extended: false }));

// 기본 경로일때는 Root 출력
app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/index', function(req, res) {
    res.render('index.ejs');
});

app.get('/blog', function(req, res) {
    res.render('blog.ejs');
});

app.get('/youtube', function(req, res) {
    res.render('youtube.ejs');
});

app.get('/soccer', function(req, res) {
    res.render('soccer.ejs');
});

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
        else res.redirect('/list');
    });
});

// 3000
app.listen(3000, () => console.log('Server is running on port 3000...'));