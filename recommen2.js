// 안 쓸 가능성 높음

const ContentBasedRecommender = require('content-based-recommender');
const recommender = new ContentBasedRecommender({
    minScore: 0.01,
    maxSimilarDocuments: 100
});

// prepare documents data
const documents = [
    { id: '1000001', content: '신나는 팝송 - 인기팝송 모음 - 최고의 외국 음악 2021 - 팝송 명곡 - 최신 곡 포함 - 광고 없는 팝송 베스트 | Best Popular Songs Of 2021' },
    { id: '1000002', content: '하루 종일 듣고 싶은 좋은노래 좋은음악 60곡 BEST TOP 60 베스트 발라드모음' },
    { id: '1000003', content: '[메이킹] 음악할 땐 급진지 모먼트! 크..소울에 또 취한다.. | 탑매니지먼트' },
    { id: '1000004', content: '[playlist] 눈에띠네가 Pick한 인디음악 모음 # 1 l 플레이리스트 2시간' },
    { id: '1000005', content: '재알못도 무조건 아는 유명한 재즈곡 모음 [재즈 Playlist]' },
    { id: '1000006', content: '지친 마음을 달래주는 음악🐛하루10분 만병을 치료 해주는 힐링 명상 기치료 음악 및 영상 - 아침명상음악 - 아침음악 - 힐링음악 - 명상음악' },
    { id: '1000007', content: '숲속에 온 듯, 마음이 편해지는 뉴에이지 음악 테라피' },
    { id: '1000008', content: '[TOP50] 그때 그 시절 우리를 설레게 한 뉴에이지 명곡 BEST | The Best of New Age Music Collection' },
    { id: '1000009', content: '분위기 있는 여름밤, 차분하게 듣는 재즈' },
    { id: '1000010', content: '재즈에서 라일락 향기가! 공부할 때 듣기 좋은 스타벅스 매장음악 봄 재즈ㅣ𝐑𝐞𝐥𝐚𝐱𝐢𝐧𝐠 𝐒𝐩𝐫𝐢𝐧𝐠 𝐉𝐚𝐳𝐳 𝐌𝐮𝐬𝐢𝐜 𝐟𝐨𝐫 𝐬𝐭𝐮𝐝𝐲, 𝐰𝐨𝐫𝐤, リラックスジャズ' },
    { id: '1000011', content: '코딩 & 공부할때 듣는 음악 - 집중할때 듣기 좋은 편안한 Lo-Fi 재즈' }
];

// start training
recommender.train(documents);

//get top 10 similar items to document 1000002
const similarDocuments = recommender.getSimilarDocuments('10000011', 0, 10);

console.log(similarDocuments);