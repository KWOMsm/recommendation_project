// 추천 서비스 기능

const ContentBasedRecommender = require('content-based-recommender');
var fs = require('fs');

const datasBuffer = fs.readFileSync('test.json');
const datasJSON = datasBuffer.toString();
const datas = JSON.parse(datasJSON);


const tags = [{
    id: "DhIVWgIos3E",
    content: "신나는 팝송 - 인기팝송 모음 - 최고의 외국 음악 2021 - 팝송 명곡 - 최신 곡 포함 - 광고 없는 팝송 베스트 | Best Popular Songs Of 2021"
}];


const tagMap = tags.reduce((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
}, {});

const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 50
});

recommender.trainBidirectional(datas, tags);

for (let data of datas) {
    const relatedTags = recommender.getSimilarDocuments(data.id);
    for (let relatedTag of relatedTags) {
        console.log(data.content, '\nscore:', relatedTag.score);
    }
    //const tags = relatedTags.map(t => { tagMap[t.id].content; });
}