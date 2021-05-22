// 추천 서비스 기능

const ContentBasedRecommender = require('content-based-recommender');
var fs = require('fs');

module.exports = {
    rec: (videoId, title) => {
        const datasBuffer = fs.readFileSync('./youtube_title.json');
        const datasJSON = datasBuffer.toString();
        const datas = JSON.parse(datasJSON);

        const tags = [{
            id: videoId,
            content: title
        }];


        const tagMap = tags.reduce((acc, tag) => {
            acc[tag.id] = tag;
            return acc;
        }, {});

        const recommender = new ContentBasedRecommender({
            minScore: 0.1,
            maxSimilarDocuments: 100
        });

        recommender.trainBidirectional(datas, tags);
        var dataArray = new Array();
        for (let data of datas) {
            const relatedTags = recommender.getSimilarDocuments(data.id);

            for (let relatedTag of relatedTags) {
                var newData = new Object();
                newData.id = data.id;
                newData.content = data.content;

                dataArray.push(newData);
                console.log(newData.content, '\nscore:', relatedTag.score);

            }
            //const tags = relatedTags.map(t => { tagMap[t.id].content; });
        }

        // 문자열 형태로 변환
        var newDataJSON = JSON.stringify(dataArray);
        // json 파일로 저장
        fs.writeFileSync('recommend.json', newDataJSON);
    }
}