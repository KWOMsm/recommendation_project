var request = require('request');
var fs = require('fs');


module.exports = {
    parse: (videoid) => {

        var optionParams = {
            q: videoid,
            part: "snippet",
            key: "AIzaSyCi4_ddKMtLx89VhyZYs9ypGPWJCW5CZVg",
            type: "video",
            regionCode: "KR",
            maxResults: 1
        };

        var url = "https://www.googleapis.com/youtube/v3/search?";

        for (var option in optionParams) {
            url += option + "=" + optionParams[option] + "&";
        }

        //url의마지막에 붙어있는 & 정리
        url = url.substr(0, url.length - 1);

        //var result = new Object();
        request(url, function(err, res, body) {
            // items 부분 파싱
            var titles = JSON.parse(body).items;
            //var result = new Object();
            result = titles[0].snippet.title;
            global.result = result;
            console.log(result);
        });
    },
};