var mysql = require('mysql');
// ec2 껏다 킬 때마다 host 바꿔줘야함
// 탄력적 ip로 해결

// 개인정보는 감춤
// 데이터베이스 관련 정보
var db_info = {
    host: '&&&&',
    port: '&&&&',
    user: 'kwonSM',
    password: '&&&&&',
    database: '&&&&&'
}

// 데이터베이스 연결
module.exports = {
    init: function () {
        return mysql.createConnection(db_info);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if(err) console.error('mysql connection error : ' + err);
            else console.log('mysql is connected successfully!');
        });
    }
}
