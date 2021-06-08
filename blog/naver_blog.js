var request = require('request');
var fs = require('fs');

// API 호출 관련 정보
var client_id = 'MTCwDmmfTG72kGW6NWFY';
var client_secret = 'OgjpZO94SF';

module.exports = {
    parse: (hobby) => {
        if (hobby == "sports") {
            hobby = "축구";
        } else if (hobby == "cook") {
            hobby = "한식";
        } else if (hobby == "game") {
            hobby = "컴퓨터";
        } else if (hobby == "travel") {
            hobby = "국내여행";
        }

        var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(hobby); // json 결과
        
        // 요청 옵션에 맞게 설정
        var options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };
        
        // 값 요청
        request(options, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                var titles = JSON.parse(body).items;
                var dataArray = new Array();
                
                // 제목과 내용, 링크만 파싱해서 저장
                for (var title in titles) {
                    var data = new Object();
                    data.blogTitle = titles[title].title;
                    data.blogContent = titles[title].description;
                    data.blogLink = titles[title].link;

                    dataArray.push(data);
                }
                
                // 파싱한 내용 json 파일로 저장
                var dataJSON = JSON.stringify(dataArray);
                fs.writeFileSync('./blog_json/blog_content.json', dataJSON);

                console.log('blog_json complete');
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + res.statusCode);
            }
        });
    }
};
