var request = require('request');
var fs = require('fs');

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

        // AIzaSyDjaHGi2E71wgSgzClgIoUKl9Q2cHk5UHk
        // AIzaSyCi4_ddKMtLx89VhyZYs9ypGPWJCW5CZVg
        // AIzaSyDpbjGD2lC9iEfMY21qwCKmzqxjzHdlVmo

        var optionParams = {
            q: hobby,
            part: "snippet",
            key: "AIzaSyDpbjGD2lC9iEfMY21qwCKmzqxjzHdlVmo",
            type: "video",
            regionCode: "KR",
            maxResults: 5
        };

        optionParams.q = encodeURI(optionParams.q); // 한글 인코딩

        var url = "https://www.googleapis.com/youtube/v3/search?";

        for (var option in optionParams) {
            url += option + "=" + optionParams[option] + "&";
        }

        //url의마지막에 붙어있는 & 정리
        url = url.substr(0, url.length - 1);

        request(url, function(err, res, body) {
            // items 부분 파싱
            var titles = JSON.parse(body).items;

            // 배열 형태로 저장
            var dataArray = new Array();
            var temp = true;
            for (var title in titles) {
                var data = new Object();
                // title과 videoId 추출
                data.id = titles[title].id.videoId;
                data.content = titles[title].snippet.title;

                for (var dataArr in dataArray) { // 중복 제거
                    if (data.id == dataArray[dataArr].id) {
                        console.log(dataArray[dataArr].id);
                        temp = false;
                        break;
                    }

                }
                if (temp) {
                    // 배열에 저장
                    dataArray.push(data);
                }

            }

            // 문자열 형태로 변환
            var dataJSON = JSON.stringify(dataArray);
            console.log(dataJSON.length);
            if (dataJSON.length > 2) {
                // json 파일로 저장
                fs.writeFileSync('./youtube_json/youtube_title.json', dataJSON);
                fs.writeFileSync('./youtube_json/youtube_title_bak.json', dataJSON);
            }

            console.log('json1 complete');
        });

        return optionParams.q;
    }
};