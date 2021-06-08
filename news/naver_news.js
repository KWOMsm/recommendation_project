var request = require('request');
var fs = require('fs');

// API 관련 정보
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

        var api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(hobby);
        
        // 요청 옵션에 맞게 설정
        var options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };

        // 요청
        request(options, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                var titles = JSON.parse(body).items;
                var dataArray = new Array();
                
                // 뉴스 제목과 내용, 링크만 파싱해서 저장
                for (var title in titles) {
                    var data = new Object();
                    data.newsTitle = titles[title].title;
                    data.newsContent = titles[title].description;
                    data.newsLink = titles[title].link;

                    dataArray.push(data);
                }
                
                // 파싱한 내용 json 파일로 저장
                var dataJSON = JSON.stringify(dataArray);
                fs.writeFileSync('./news_json/news_content.json', dataJSON);

                console.log('news_json complete');
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + res.statusCode);
            }
        });
    }
};
