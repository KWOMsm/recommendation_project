var request = require('request');
var fs = require('fs');

var client_id = 'MTCwDmmfTG72kGW6NWFY';
var client_secret = 'OgjpZO94SF';

module.exports = {
    parse: (hobby) => {
        if (hobby == "sports") {
            hobby = "걷기";
        } else if (hobby == "cook") {
            hobby = "중국음식";
        } else if (hobby == "game") {
            hobby = "콘솔";
        } else if (hobby == "travel") {
            hobby = "해외여행";
        }

        var api_url = 'https://openapi.naver.com/v1/search/news?query=' + encodeURI(hobby); // json 결과

        var options = {
            url: api_url,
            headers: { 'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret }
        };

        request(options, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                var titles = JSON.parse(body).items;
                var dataArray = new Array();

                for (var title in titles) {
                    var data = new Object();
                    data.newsTitle = titles[title].title;
                    data.newsContent = titles[title].description;
                    data.newsLink = titles[title].link;

                    dataArray.push(data);
                }

                var dataJSON = JSON.stringify(dataArray);
                fs.writeFileSync('./news_json/news_content2.json', dataJSON);

                console.log('news_json complete');
            } else {
                res.status(response.statusCode).end();
                console.log('error = ' + res.statusCode);
            }
        });
    }
};