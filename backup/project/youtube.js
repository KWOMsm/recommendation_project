var request = require('request');
var fs = require('fs');

module.exports = {
    parse: (hobby) => {

        if (hobby == "movie") {
            hobby = "영화";
        } else if (hobby == "sports") {
            hobby = "스포츠";
        } else if (hobby == "music") {
            hobby = "음악";
        }
        var optionParams = {
            q: hobby,
            part: "snippet",
            key: "AIzaSyDjaHGi2E71wgSgzClgIoUKl9Q2cHk5UHk",
            type: "video",
            regionCode: "KR",
            maxResults: 10
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
            // json 파일로 저장
            fs.writeFileSync('youtube_title.json', dataJSON);

            console.log('json complete');
        });

        return optionParams.q;
    }
};