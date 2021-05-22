var mysql = require('mysql');
// ec2 껏다 킬 때마다 host 바꿔줘야함
var db_info = {
    host: '13.125.128.149',
    port: '3306',
    user: 'kwonSM',
    password: 'g5438111',
    database: 'testDB'
}

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
