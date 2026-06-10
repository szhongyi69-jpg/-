import React, { useState, useEffect, useRef } from "react";
import { Spirit, Brand, CountryCulture } from "./types";
import { SPIRITS, BRANDS, COUNTRIES } from "./data/spiritsData";
import WorldMap from "./components/WorldMap";
import RadarChart from "./components/RadarChart";
// @ts-ignore
import moutaiBottlesImg from "./assets/images/moutai_bottles_1781069633701.png";
import {
  Compass,
  Wine,
  Search,
  BookOpen,
  Award,
  Flame,
  Star,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  Heart,
  HelpCircle,
  X,
  Languages,
  Thermometer,
  GlassWater,
  ArrowRight,
  Send,
  Check,
  ChevronRight,
  ShieldCheck,
  Info
} from "lucide-react";

// Localizations for multi-language toggle (CN / EN / JA)
const TRANSLATIONS = {
  zh: {
    title: "全球酒类探索者",
    subtitle: "Global Spirits Explorer",
    navHome: "首页",
    navWiki: "酒类百科",
    navMap: "国家酒文化",
    navBrands: "酒品牌库",
    navFav: "收藏夹",
    navAI: "AI 侍酒助教",
    navAbout: "品酒指南",
    heroTitle: "探索全球酒文化",
    heroSubtitle: "发现来自世界各地的葡萄酒、威士忌、白兰地、啤酒、清酒和传统酿造酒品",
    searchPlaceholder: "搜索酒名、类型、原产国或故事...",
    quickAccess: "一击探索 / Quick Chips",
    recommendOfDay: "今日非凡推荐",
    viewDetail: "查看品鉴详情",
    spiritsNum: "款珍藏酒品",
    allCategories: "全部酒类",
    allCountries: "所有国度",
    sortBy: "排序规则",
    ratingHigh: "综合评分高",
    abvHigh: "酒精度数高",
    abvLow: "酒精度数低",
    favoritesEmpty: "您的收藏里还没有酒品。在百科中点击❤即可将珍品收录至此！",
    aiInitialMessage: "您好！我是您的私人高级侍酒师与全球酒类学者。今天有什么想了解 of 酒文化、品鉴秘诀或配餐艺术吗？",
    aiPrompt1: "推荐适合新手的威士忌",
    aiPrompt2: "日本清酒等级如何区分？",
    aiPrompt3: "龙舌兰与梅斯卡尔有什么区别？",
    aiPrompt4: "法国最著名的葡萄酒产区有哪些？",
    askButton: "唤醒侍酒师 AI",
    aroma: "香气特征",
    taste: "口感描述",
    serveTemp: "最佳温度",
    glassType: "推荐酒杯",
    aiReview: "AI 专家点评",
    basicSpecs: "基础参数",
    historyTitle: "酿造历史与故事",
    foodPairing: "推荐美食搭配",
    heroBadge: "世界酒香版图 / Global Spirits Cartography",
    aiSectionTitle: "AI 侍酒助手 RAG",
    aiSectionDesc: "基于 Gemini 超脑，结合全球最严苛的酒品风味数据库，实时解答您的选酒、送礼搭配、历史考据等难题，提供侍酒师级别的结构化方案。",
    aiConciergeTitle: "高级智能侍酒师 AI",
    aiConciergeDesc: "内置高级知识检索，全语种理解。自动识别推荐内容并与百科交互。",
    recomCardsTitle: "✦ 侍酒师关联卡片 / Recommended Spirits",
    statTotal: "收录产品总数",
    statTotalVal: "款",
    statTotalDesc: "烈、葡、啤、全分类",
    statCountries: "原产地覆盖",
    statCountriesVal: " 个国家",
    statCountriesDesc: "全球风土汇聚",
    statBrands: "传奇蒸馏名厂",
    statBrandsVal: " 座",
    statBrandsDesc: "百年工艺名牌",
    statActive: "今日藏家活跃",
    statActiveVal: "100%",
    statActiveDesc: "本地实时安全沙盒",
    searchEmpty: "没有找到任何符合当前筛选条件的珍藏酒品。",
    searchEmptyDesc: "尝试清空或重置搜索词与过滤器条件。",
    brandFounded: "创立：",
    brandYearSuffix: "年",
    brandFlagship: "代表旗舰作",
    brandDigital: "前往官方庄园",
    favCellarTitle: "酒学珍藏库",
    favCellarDesc: "保存您心仪的佳酿与文化地标项目，一览无余。",
    favAbvLabel: "度数：",
    favScoreLabel: "★ ",
    favGoWiki: "前往选酒百科",
    aiExplorerName: "探索者 (你)",
    aiSommelierName: "侍酒师 (智能助理)",
    aiSearching: "正在精心翻阅酒庄百科与风土典籍...",
    aiHotFollowup: "快捷追问 / Hot:",
    aiInputPlaceholder: "询问AI学者，例如：'给我推荐一款配和牛的法国干红'...",
    aiSendBtn: "发送询问",
    guideHeaderTitle: "品酒艺术与理性指南 / Master Sommelier Philosophy",
    guideStep1Title: "色（Sight）—— 观其骨血",
    guideStep1Desc: "好酒会由于木桶的陈酿吸收、大麦的深度焙煮或原料本身的特性而泛出温润的琥珀金、深桃木红或莹绿清白。在干净的白色酒单衬托下，轻轻斜持酒杯 45 度，观测其边缘流走的裙边（Rim）和流下的‘挂杯酒眼’(Tears of spirit)，酒腿流动越徐缓饱满，暗示其酒精度和多糖酯类物质越密实，酒体结构越高挺。",
    guideStep2Title: "香（Nose）—— 察其幽魂",
    guideStep2Desc: "气味是酒的性格侧写。闻高档烈酒切莫将鼻子直扑杯中狂吸，那会窒息您的嗅神经。应当将口微张，距离杯口数公分处轻嗅空气的流动。先感受前调中扑闪而出的高昂花香、新鲜水果或柑橘皮；随后晃动酒杯，吸纳底层橡木熟化带来的焦草香、香草奶油、可可、皮革与重泥煤烟熏野趣。",
    guideStep3Title: "味（Savor）—— 品其傲骨",
    guideStep3Desc: "轻嘬约 5ml 酒液。先别忙着咽，让它在您的舌面铺匀停留 5-8 秒。用我们的温度熔沸出酒液中的复杂高酯精类。让甘润（舌尖）、清脆（两侧）、醇厚以及温暖在舌根全面升华。咽下后合口，通过后天软腭哈气，仔细辨析其余余味（Finish）在口腔留宿的秒数。伟大的酒品余韵可轻易超越 45 秒。",
    guideWiselyTitle: "酩酊雅颂 —— 理性享饮宣言 / Savor Wisely",
    guideWiselyDesc: "探索酒本身即是对风土、历史与酿酒大师匠心跨越时间的隔空对话。我们极致推崇“浅尝即止，重质而非重量”的雅饮美德。严禁未成年人及孕妇尝试酒精；生命脆弱，饮酒后切勿操作各类复杂器诫与汽车。让我们在清醒与克制的雅乐结构中，敬畏自然。",
  },
  en: {
    title: "Global Spirits",
    subtitle: "Global Spirits Explorer",
    navHome: "Home",
    navWiki: "Spirits Wiki",
    navMap: "Map & Cultures",
    navBrands: "Brands Hub",
    navFav: "Favorites",
    navAI: "AI Sommelier",
    navAbout: "Guide",
    heroTitle: "Explore World Spirits",
    heroSubtitle: "Discover wine, whisky, sake, brandy, tequila and ancient traditional beverages worldwide",
    searchPlaceholder: "Search spirit name, category, country, tags...",
    quickAccess: "Quick Tags",
    recommendOfDay: "Featured Spirit of the Day",
    viewDetail: "View Tasting Notes",
    spiritsNum: "rare collections",
    allCategories: "All Categories",
    allCountries: "All Nations",
    sortBy: "Sort By",
    ratingHigh: "Highest Rated",
    abvHigh: "ABV (High to Low)",
    abvLow: "ABV (Low to High)",
    favoritesEmpty: "Your favorites bin is empty. Click ❤ on any spirit in the Wiki to save it here!",
    aiInitialMessage: "Warm greetings! I am your personal Sommelier and Global Spirits Expert. Ask me anything about vineyard lore, premium distillation, or fine food pairings!",
    aiPrompt1: "Recommend a beginner's whisky",
    aiPrompt2: "How to judge Sake classification?",
    aiPrompt3: "Difference between Tequila & Mezcal?",
    aiPrompt4: "Most famous wine regions in France?",
    askButton: "Consult AI Sommelier",
    aroma: "Aroma Notes",
    taste: "Taste Profile",
    serveTemp: "Best Serving Temp",
    glassType: "Recommended Glass",
    aiReview: "AI Sommelier Review",
    basicSpecs: "Specifications",
    historyTitle: "Historical Background",
    foodPairing: "Culinary Pairings",
    heroBadge: "Global Spirits Cartography",
    aiSectionTitle: "AI Sommelier (RAG)",
    aiSectionDesc: "Powered by Gemini with a comprehensive flavor database to answer vintage queries, master pairings, and distilling lore immediately.",
    aiConciergeTitle: "RAG Wine Sommelier AI",
    aiConciergeDesc: "Equipped with advanced knowledge retrieval and global language support. Interacts seamlessly with our wiki.",
    recomCardsTitle: "✦ Somm's Recommended Spirits",
    statTotal: "Total Collections",
    statTotalVal: " Items",
    statTotalDesc: "Spirits, Wine, Beer, Sake",
    statCountries: "Countries Covered",
    statCountriesVal: " Nations",
    statCountriesDesc: "Global Terroirs",
    statBrands: "Legendary Distilleries",
    statBrandsVal: " Brands",
    statBrandsDesc: "Centennial Craftsmanship",
    statActive: "Active Tasters",
    statActiveVal: "100%",
    statActiveDesc: "Local Sandbox Sync",
    searchEmpty: "No rare collections found matching active criteria.",
    searchEmptyDesc: "Try resetting or clearing query and selectors.",
    brandFounded: "Est: ",
    brandYearSuffix: "",
    brandFlagship: "Flagship Portfolios",
    brandDigital: "Digital Estate",
    favCellarTitle: "My Private Cellar",
    favCellarDesc: "Keep track of your favorite spirits and historic cultures in one cozy vault.",
    favAbvLabel: "ABV: ",
    favScoreLabel: "★ ",
    favGoWiki: "Go to Wiki",
    aiExplorerName: "Explorer (You)",
    aiSommelierName: "Sommelier (AI)",
    aiSearching: "Flipping through vineyard encyclopedias and terroirs...",
    aiHotFollowup: "Follow up / Hot:",
    aiInputPlaceholder: "Ask AI Sommelier, e.g., 'Suggest a wine for ribeye steak'...",
    aiSendBtn: "Consult",
    guideHeaderTitle: "Master Sommelier Philosophy",
    guideStep1Title: "1. Sight (Visual Appraisal)",
    guideStep1Desc: "Fine spirits reveal warm amber, mahogany, or crystalline hues derived from cask aging, roasted barley, or pure crops. Tilt your glass at 45 degrees against a pale backing. Watch the 'rim' and 'tears' flowing down the glass walls; slower, viscous tears indicate high complexity, richness in esters, and a robust body.",
    guideStep2Title: "2. Nose (Aroma Examination)",
    guideStep2Desc: "Smell tells the ultimate story. Instead of plunging your nose directly into a high-proof glass, open your mouth slightly and gentle-inhale inches away. Detect high-pitched blossoms or citrus peel first, then swirl gently to unearth caramel, vintage leather, vanilla, and heavy peated smoke tucked beneath physical layers.",
    guideStep3Title: "3. Palate (Taste & Finish Progression)",
    guideStep3Desc: "Take a small sip (around 5ml). Don't swallow instantly; coat your entire tongue for 5 to 8 seconds, using body warmth to vaporize complex volatile compounds. Experience sweet elements on the tip, balance on the sides, and warmth at the core. Swish and swallow, then exhale through the mouth to timing the length of the lingering finish: legendary liquors easily exceed 45 seconds.",
    guideWiselyTitle: "Savor Wisely Declaration",
    guideWiselyDesc: "Exploring spirits is a cross-time dialogue with terroirs, histories, and master distillers. We strongly advocate the virtue of tasting over consuming. Minors and pregnant women are strictly prohibited from drinking alcohol; remember, life is precious—never operate machinery or drive under the influence. Savor with mindfulness, respect nature.",
  },
  ja: {
    title: "スピリッツ探検家",
    subtitle: "Global Spirits Explorer",
    navHome: "ホーム",
    navWiki: "お酒百科",
    navMap: "世界の酒文化",
    navBrands: "ブランド庫",
    navFav: "お気に入り",
    navAI: "AI ソムリエ",
    navAbout: "テイスティング",
    heroTitle: "世界の酒文化を探求する",
    heroSubtitle: "世界中のワイン、ウイスキー、ブランデー、ビール、日本酒、伝統酒を発見する",
    searchPlaceholder: "酒名、カテゴリー、国、歴史を検索...",
    quickAccess: "クイック探索",
    recommendOfDay: "本日の特別おすすめ",
    viewDetail: "テイスティング詳細",
    spiritsNum: "件の厳选貯蔵",
    allCategories: "すべてのカテゴリー",
    allCountries: "すべての国",
    sortBy: "ソート順",
    ratingHigh: "評価の高い順",
    abvHigh: "アルコール度数 (高→低)",
    abvLow: "アルコール度数 (低→高)",
    favoritesEmpty: "お気に入りは空です。ウィキで❤をクリックして、お気に入りのお酒を保存してください！",
    aiInitialMessage: "ようこそ！私はあなたの専属ソムリエであり、お酒の学者です。何か知りたいお酒の文化、テイスティングのコツ、マリアージュはありますか？",
    aiPrompt1: "初心者向けのウイスキーを推薦して",
    aiPrompt2: "日本酒の特定名称酒の区分は？",
    aiPrompt3: "テキーラとメスカルの違いは何ですか？",
    aiPrompt4: "フランスで最も有名なワイン産地はどこ？",
    askButton: "AIソムリエに相談する",
    aroma: "アロマの特徴",
    taste: "味わい・口当たり",
    serveTemp: "最適飲用温度",
    glassType: "推奨グラス",
    aiReview: "AI 専門家の評価",
    basicSpecs: "基本スペック",
    historyTitle: "醸造の歴史と歩み",
    foodPairing: "おすすめの食べ合わせ",
    heroBadge: "世界の酒香マップ / Global Spirits Cartography",
    aiSectionTitle: "AIソムリエ (RAG)",
    aiSectionDesc: "Geminiと広範な風味データベースに基づいて、おすすめのお酒、料理の組み合わせ、歴史探訪について瞬時に回答いたします。",
    aiConciergeTitle: "高級AIソムリエ",
    aiConciergeDesc: "高度な知識検索と多言語理解。おすすめのお酒を自動識別し、お酒百科と連携します。",
    recomCardsTitle: "✦ ソムリエ推薦のお酒",
    statTotal: "収録お酒総数",
    statTotalVal: " 種類",
    statTotalDesc: "各種スピリッツ、ワイン、ビール",
    statCountries: "生産国カバー",
    statCountriesVal: " ヶ国",
    statCountriesDesc: "世界のテロワール",
    statBrands: "伝説の醸造所",
    statBrandsVal: " ブランド",
    statBrandsDesc: "百年伝統名門",
    statActive: "今日のコレクター",
    statActiveVal: "100%",
    statActiveDesc: "ローカル安全サンドボックス",
    searchEmpty: "選択した条件に一致するお酒が見つかりませんでした。",
    searchEmptyDesc: "検索語やフィルターをクリアまたはリセットしてください。",
    brandFounded: "創業：",
    brandYearSuffix: "年",
    brandFlagship: "代表フラッグシップ",
    brandDigital: "公式サイトへ",
    favCellarTitle: "マイ・コレクション",
    favCellarDesc: "お気に入りの名酒を発見、保存していつでも確認。",
    favAbvLabel: "度数：",
    favScoreLabel: "★ ",
    favGoWiki: "お酒百科へ",
    aiExplorerName: "探索者 (あなた)",
    aiSommelierName: "ソムリエ (AI)",
    aiSearching: "シャトーの百科事典やテロワールの古文書を開いています...",
    aiHotFollowup: "クイック質問 / Hot:",
    aiInputPlaceholder: "AIソムリエに尋ねる、例：'和牛ステーキに合う赤ワインを教えて'...",
    aiSendBtn: "尋ねる",
    guideHeaderTitle: "テイスティングの美学とガイド",
    guideStep1Title: "1. 色（視覚）—— お酒の骨调を見極める",
    guideStep1Desc: "銘酒は樽での熟成や原料の個性、焙煎麦芽によって温かみのある琥珀色、深いマホガニー、あるいは透き通るような白銀の輝きを見せます。白い布やメニューを背景に、グラスを45度傾けて淵のグラデーションや涙（脚）を観察します。流れるスピードがゆったりとしているほど、アルコールやエステルが豊富でボディが強固であることを物語ります。",
    guideStep2Title: "2. 香（嗅覚）—— 魂・キャラクターを捉える",
    guideStep2Desc: "香りはキャラクターの肖像画そのものです。高品位なスピリッツを嗅ぐ際、グラスに鼻を突っ込んで鼻呼吸すると嗅覚が麻痺します。少し口を開き、グラスから数センチ離して清涼な空気を軽く吸い込みます。まずは上層に漂う華やかなフラワー、フルーツ、シトラスを探り、そこからスワリングしてバニラ、オーク、カカオ、奥底に潜むピートの煙を拾い上げます。",
    guideStep3Title: "3. 味（味覚）—— 調和と余韻を堪能する",
    guideStep3Desc: "5ml程度を口に含み、すぐに飲み込まずに舌全体に5〜8秒広げます。体温によって複雑なエステルや高級成分が気化されます。舌先で甘み、両脇で酸や塩味、喉元への温度変化を感じます。嚥下した後、鼻から静かに息を吐き出し、口内に残る余韻（フィニッシュ）の秒数を感じてください。偉大な一滴は45秒を超える旅へと誘います。",
    guideWiselyTitle: "節度の宣言 — 知性ある贅沢",
    guideWiselyDesc: "グラスを満たす一杯は、土壌、気候、歴史、あるいは職人の情熱との時空を超えた対話です。私たちは「少量で質を味わう」テイスティングの美徳を推奨します。未成年者や妊婦の飲酒は固く禁じられています。命は尊いものです。飲酒後は決して車や機械の操作を行わないでください。自制と敬意をもって自然に感謝しましょう。",
  },
  ko: {
    title: "세계 주류 탐험가",
    subtitle: "Global Spirits Explorer",
    navHome: "홈",
    navWiki: "주류 백과",
    navMap: "국가별 술 문화",
    navBrands: "브랜드 라이브러리",
    navFav: "보관함",
    navAI: "AI 소믈리에",
    navAbout: "시음 가이드",
    heroTitle: "세계의 주류 문화를 탐험하다",
    heroSubtitle: "전 세계의 와인, 위스크, 브랜디, 맥주, 사케 및 전통 양조주를 발견해 보세요",
    searchPlaceholder: "술 이름, 카테고리, 원산국 또는 이야기 검색...",
    quickAccess: "간편 검색 칩 / Quick Chips",
    recommendOfDay: "오늘의 스페셜 추천 주류",
    viewDetail: "테이스팅 상세 정보",
    spiritsNum: "개의 엄선 소장품",
    allCategories: "전체 카테고리",
    allCountries: "모든 국가",
    sortBy: "정렬 기준",
    ratingHigh: "평점 높은 순",
    abvHigh: "도수 높은 순",
    abvLow: "도수 낮은 순",
    favoritesEmpty: "보관함이 비어 있습니다. 백과사전에서 ❤를 클릭하여 선호하는 주류를 추가해 보세요!",
    aiInitialMessage: "안녕하세요! 당신의 개인 소믈리에이자 주류 학자입니다. 오늘 어떤 주류 문화, 시음 비결 또는 음식 마리아주가 궁금하신가요?",
    aiPrompt1: "입문자용 위스키 추천",
    aiPrompt2: "사케 등급 분류법은?",
    aiPrompt3: "데킬라와 메스칼의 차이점은 무엇인가요?",
    aiPrompt4: "프랑스의 가장 유명한 와인 생산지는 어디인가요?",
    askButton: "AI 소믈리에에게 물어보기",
    aroma: "아로마 특징",
    taste: "맛과 타격감",
    serveTemp: "최적 시음 온도",
    glassType: "추천 글라스",
    aiReview: "AI 전문가 리뷰",
    basicSpecs: "기본 사양",
    historyTitle: "양조 역사와 배경 스토리",
    foodPairing: "추천 음식 매칭",
    heroBadge: "세계 주류 연대기 / Global Spirits Cartography",
    aiSectionTitle: "AI 소믈리에 (RAG)",
    aiSectionDesc: "Gemini와 풍부한 테이스팅 데이터베이스를 기반으로 와인 및 위스키 추천, 선물용 조합, 역사 탐구에 실시간 답변을 제공합니다.",
    aiConciergeTitle: "고품격 지능형 AI 소믈리에",
    aiConciergeDesc: "고급 지식 검색 기술 및 다국어 지원 탑재. 추천 항목을 자동 인식해 주류 백과와 즉시 상호작용합니다.",
    recomCardsTitle: "✦ 소믈리에 관련 추천 카드",
    statTotal: "총 수록 주류",
    statTotalVal: " 종",
    statTotalDesc: "스피릿, 와인, 맥주, 사케",
    statCountries: "원산지 국가",
    statCountriesVal: " 개국",
    statCountriesDesc: "글로벌 테루아",
    statBrands: "전설적인 증류소",
    statBrandsVal: " 개사",
    statBrandsDesc: "100년 역사의 대가",
    statActive: "오늘 활성 가이드",
    statActiveVal: "100%",
    statActiveDesc: "로컬 안전 샌드박스",
    searchEmpty: "선택한 조건에 부합하는 주류가 없습니다.",
    searchEmptyDesc: "검색어나 필터를 지우거나 다른 값을 선택해 보세요.",
    brandFounded: "설립: ",
    brandYearSuffix: "년",
    brandFlagship: "시그니처 라인업",
    brandDigital: "공식 웹사이트",
    favCellarTitle: "나의 프라이빗 셀러",
    favCellarDesc: "마음에 드는 명주와 역사를 북마크에 저장하여 한 번에 가꿔보세요.",
    favAbvLabel: "도수: ",
    favScoreLabel: "★ ",
    favGoWiki: "주류 백과 가기",
    aiExplorerName: "탐험가 (나)",
    aiSommelierName: "소믈리에 (AI)",
    aiSearching: "와이너리 백과사전과 역사 문헌들을 꼼꼼하게 탐색하는 중...",
    aiHotFollowup: "빠른 추가 질문 / Hot:",
    aiInputPlaceholder: "AI 소믈리에에게 자유롭게 질문해 보세요. 예: '소고기에 어울리는 레드 와인 추천해 줘'...",
    aiSendBtn: "질문하기",
    guideHeaderTitle: "테이스팅 아트 및 이성 가이드",
    guideStep1Title: "1. 시각(Sight) —— 주류의 빛깔과 점성 관찰",
    guideStep1Desc: "명주는 오크통 숙성, 엄선된 맥아 훈연 또는 고유의 풍토 작물에 의해 은은한 호박색, 깊은 오렌지 브라운, 혹은 투명하고 맑은 물빛을 띱니다. 하얀 백지를 대고 잔을 45도 기울여 림(rim, 테두리)의 색과 함께 잔 안쪽 벽을 흘러내리는 렉(Leg, 눈물)을 관조해 보세요. 이 흐름이 느리고 끈끈할수록 알코올과 풍성한 에스테르 함량이 조밀하여 구조감이 훌륭함을 속삭여 줍니다.",
    guideStep2Title: "2. 후각(Nose) —— 숙성 향과 아로마 속삭임",
    guideStep2Desc: "향기는 술의 숨겨진 자화상입니다. 도수가 높은 고품격 위스키나 브랜디를 시음할 때 잔에 콧구멍을 들이밀고 단번에 숨을 들이마시면 감각이 마비됩니다. 입을 약간 벌린 채 잔에서 몇 센티미터 거리를 두고 부드럽게 대기 중의 기화된 향을 맡으세요. 처음에는 피어오르는 과일과 꽃 향을, 뒤이어 잔을 살살 돌려(Swirling) 바닐라 크림, 카카오, 고가죽, 그리고 묵직한 피트 연기 향을 다각도로 포착해 봅니다.",
    guideStep3Title: "3. 미각(Savor) —— 맛의 조화와 기나긴 여운",
    guideStep3Desc: "약 5ml의 술을 입에 가볍게 한 모금 머급니다. 곧장 삼키지 말고 5~8초간 입안 전체를 적셔 체온에 의해 정교한 향미 복합체들이 충분히 증발하도록 하세요. 혀끝에서 느껴지는 감미로움, 양옆의 청량한 경쾌함, 목줄기를 어루만지는 훈훈함이 하나가 됩니다. 삼킨 뒤 조용히 한 호흡을 내쉬며 구강과 비강을 메우는 피니시(Finish, 여운)의 길이를 한 번 느껴 보십시오. 위대한 술의 잔향은 아주 가볍게 45초를 뛰어넘습니다.",
    guideWiselyTitle: "소망 선언 —— 이성적 음주 공표",
    guideWiselyDesc: "주류를 탐닉하는 인생의 여정은 풍토와 역사, 그리고 양조 거장의 장인 정신과 시간의 강을 넘어 마주하는 고상한 대화입니다. 우리는 '양보다 질'을 추구하는 절제된 풍미를 최상의 덕목으로 삼습니다. 청소년 및 임산부의 음주는 법에 의해 철저히 금지됩니다. 생명은 소중합니다. 음주 후 기계 조작 및 운전은 절대 하지 말아 주십시오. 맑은 이성 안에서 자연의 은혜를 경외합시다.",
  }
};

export default function App() {
  const [lang, setLang] = useState<"zh" | "en" | "ja" | "ko">("zh");
  const [activeTab, setActiveTab] = useState<
    "home" | "encyclopedia" | "culture" | "brands" | "favorites" | "assistant" | "about"
  >("home");

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedCountryCode, setSelectedCountryCode] = useState("全部");
  const [sortBy, setSortBy] = useState<"rating" | "abvDesc" | "abvAsc">("rating");

  // Dynamic API Database loaded states
  const [spirits, setSpirits] = useState<Spirit[]>(SPIRITS);
  const [brands, setBrands] = useState<Brand[]>(BRANDS);
  const [countries, setCountries] = useState<CountryCulture[]>(COUNTRIES);

  // Selected detail overlay targets
  const [selectedSpirit, setSelectedSpirit] = useState<Spirit | null>(null);
  const activeSpirit = selectedSpirit
    ? (spirits.find((s) => s.id === selectedSpirit.id) || selectedSpirit)
    : null;
  const [selectedCountry, setSelectedCountry] = useState<CountryCulture | null>(COUNTRIES[0]);

  // Favorites tracking (Stored via ID array)
  const [favorites, setFavorites] = useState<string[]>([]);

  // AI Chat Bot variables
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string; recommendIds?: string[] }>
  >([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to latest chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Initialize data and load saved favorites on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("global_spirits_explorer_favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not read favorites from localStorage:", e);
    }
  }, []);

  // Sync localized database catalogs on language change (REST API integrated)
  useEffect(() => {
    // Synchronize localized category selection filter
    setSelectedCategory((prevSelected) => {
      const maps: Record<string, Record<string, string>> = {
        "全部": { en: "All", ja: "すべて", ko: "전체" },
        "威士忌": { en: "Whisky", ja: "ウイスキー", ko: "위스키" },
        "白兰地": { en: "Brandy", ja: "ブランデー", ko: "브랜디" },
        "伏特加": { en: "Vodka", ja: "ウォッカ", ko: "보드카" },
        "金酒": { en: "Gin", ja: "ジン", ko: "진" },
        "朗姆酒": { en: "Rum", ja: "ラム酒", ko: "럼" },
        "龙舌兰": { en: "Tequila", ja: "テキーラ", ko: "데킬라" },
        "葡萄酒": { en: "Wine", ja: "ワイン", ko: "와인" },
        "香槟": { en: "Champagne", ja: "シャンパン", ko: "シャンパン" },
        "啤酒": { en: "Beer", ja: "ビール", ko: "맥주" },
        "清酒": { en: "Sake", ja: "日本酒", ko: "사케" },
        "传统地方酒": { en: "Traditional", ja: "伝統酒", ko: "전통주" },
        "利口酒": { en: "Liqueur", ja: "リキュール", ko: "리큐어" },
        "鸡尾酒": { en: "Cocktail", ja: "カクテル", ko: "칵테일" }
      };
      let foundKey = prevSelected;
      if (!maps[prevSelected]) {
        for (const [key, langMap] of Object.entries(maps)) {
          if (langMap.en === prevSelected || langMap.ja === prevSelected || langMap.ko === prevSelected) {
            foundKey = key;
            break;
          }
        }
      }
      return translateCategory(foundKey);
    });

    // Synchronize localized country selection filter
    setSelectedCountryCode((prevSelected) => {
      const maps: Record<string, Record<string, string>> = {
        "全部": { en: "All", ja: "すべて", ko: "전체" },
        "英国": { en: "Scotland", ja: "イギリス (スコットランド)", ko: "영국" },
        "法国": { en: "France", ja: "フランス", ko: "프랑스" },
        "中国": { en: "China", ja: "中国", ko: "중국" },
        "日本": { en: "Japan", ja: "日本", ko: "일본" },
        "墨西哥": { en: "Mexico", ja: "メキシコ", ko: "멕시코" },
        "俄罗斯": { en: "Russia", ja: "ロシア", ko: "러시아" },
        "爱尔兰": { en: "Ireland", ja: "アイルランド", ko: "아일랜드" },
        "意大利": { en: "Italy", ja: "イタリア", ko: "이탈리아" },
        "韩国": { en: "South Korea", ja: "韓国", ko: "한국" }
      };
      let foundKey = prevSelected;
      if (!maps[prevSelected]) {
        for (const [key, langMap] of Object.entries(maps)) {
          if (langMap.en === prevSelected || langMap.ja === prevSelected || langMap.ko === prevSelected) {
            foundKey = key;
            break;
          }
        }
      }
      return translateCountry(foundKey);
    });

    const fetchLocalizedData = async () => {
      try {
        const spiritsRes = await fetch(`/api/spirits?lang=${lang}`);
        if (spiritsRes.ok) {
          const data = await spiritsRes.json();
          if (data && data.length > 0) setSpirits(data);
        }

        const brandsRes = await fetch(`/api/brands?lang=${lang}`);
        if (brandsRes.ok) {
          const data = await brandsRes.json();
          if (data && data.length > 0) setBrands(data);
        }

        const countriesRes = await fetch(`/api/countries?lang=${lang}`);
        if (countriesRes.ok) {
          const data = await countriesRes.json();
          if (data && data.length > 0) {
            setCountries(data);
            // Synchronize currently highlighted culture land
            setSelectedCountry((current) => {
              if (current) {
                const refreshed = data.find((c: any) => c.id === current.id);
                return refreshed || data[0];
              }
              return data[0];
            });
          }
        }
      } catch (err) {
        console.log("Could not bind REST database API, fallback to premium static assets index.");
      }
    };

    fetchLocalizedData();

    // Set first welcome message for AI Sommelier
    setChatMessages([
      {
        sender: "bot",
        text: TRANSLATIONS[lang].aiInitialMessage,
      }
    ]);
  }, [lang]);

  // Sync favorites back to store on change
  const toggleFavorite = (id: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((fId) => fId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("global_spirits_explorer_favorites", JSON.stringify(updated));
  };

  // Sync welcome messages when language changes
  useEffect(() => {
    setChatMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            sender: "bot",
            text: TRANSLATIONS[lang].aiInitialMessage,
          }
        ];
      }
      return prev;
    });
  }, [lang]);

  // Category translation mapping
  const translateCategory = (catName: string) => {
    if (lang === "zh") return catName;
    const maps: Record<string, Record<string, string>> = {
      "全部": { en: "All", ja: "すべて", ko: "전체" },
      "威士忌": { en: "Whisky", ja: "ウイスキー", ko: "위스키" },
      "白兰地": { en: "Brandy", ja: "ブランデー", ko: "브랜디" },
      "伏特加": { en: "Vodka", ja: "ウォッカ", ko: "보드카" },
      "金酒": { en: "Gin", ja: "ジン", ko: "진" },
      "朗姆酒": { en: "Rum", ja: "ラム酒", ko: "럼" },
      "龙舌兰": { en: "Tequila", ja: "テキーラ", ko: "데킬라" },
      "葡萄酒": { en: "Wine", ja: "ワイン", ko: "와인" },
      "香槟": { en: "Champagne", ja: "シャンパン", ko: "샴페인" },
      "啤酒": { en: "Beer", ja: "ビール", ko: "맥주" },
      "清酒": { en: "Sake", ja: "日本酒", ko: "사케" },
      "传统地方酒": { en: "Traditional", ja: "伝統酒", ko: "전통주" },
      "利口酒": { en: "Liqueur", ja: "リキュール", ko: "리큐어" },
      "鸡尾酒": { en: "Cocktail", ja: "カクテル", ko: "칵테일" }
    };
    return maps[catName]?.[lang] || catName;
  };

  // Country translation mapping
  const translateCountry = (countryName: string) => {
    if (lang === "zh") return countryName;
    const maps: Record<string, Record<string, string>> = {
      "全部": { en: "All", ja: "すべて", ko: "전체" },
      "英国": { en: "Scotland", ja: "イギリス (スコットランド)", ko: "영국" },
      "法国": { en: "France", ja: "フランス", ko: "프랑스" },
      "中国": { en: "China", ja: "中国", ko: "중국" },
      "日本": { en: "Japan", ja: "日本", ko: "일본" },
      "墨西哥": { en: "Mexico", ja: "メキシコ", ko: "멕시코" },
      "俄罗斯": { en: "Russia", ja: "ロシア", ko: "러시아" },
      "爱尔兰": { en: "Ireland", ja: "アイルランド", ko: "아일랜드" },
      "意大利": { en: "Italy", ja: "イタリア", ko: "이탈리아" },
      "韩国": { en: "South Korea", ja: "韓国", ko: "한국" }
    };
    return maps[countryName]?.[lang] || countryName;
  };

  // Helper trigger to redirect to search via quick access chips
  const handleQuickCategoryQuery = (catName: string) => {
    const localizedCat = translateCategory(catName);
    setSelectedCategory(localizedCat);
    setSelectedCountryCode("全部");
    setSearchQuery("");
    setActiveTab("encyclopedia");
  };

  // Helper trigger to switch tab + search a broad query
  const triggerGlobalSearch = (queryStr: string) => {
    setSearchQuery(queryStr);
    setSelectedCategory("全部");
    setSelectedCountryCode("全部");
    setActiveTab("encyclopedia");
  };

  // Clear search fields helper
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Calculate sorted and filtered spirits (client side filter handles immediate reactivity)
  const filteredSpirits = spirits.filter((item) => {
    // 1. Category matching check
    const matchCategory =
      selectedCategory === "全部" ||
      selectedCategory === "All" ||
      selectedCategory === "すべて" ||
      selectedCategory === "전체" ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    // 2. Country code check
    const matchCountry =
      selectedCountryCode === "全部" ||
      selectedCountryCode === "All" ||
      selectedCountryCode === "すべて" ||
      selectedCountryCode === "전체" ||
      item.country.toLowerCase().includes(selectedCountryCode.toLowerCase());

    // 3. Search text matching
    const matchQuery =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.english_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.flavor_tags && item.flavor_tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchCategory && matchCountry && matchQuery;
  }).sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      const aVal = parseFloat(a.abv.replace("%", "")) || 0;
      const bVal = parseFloat(b.abv.replace("%", "")) || 0;
      return sortBy === "abvDesc" ? bVal - aVal : aVal - bVal;
    }
  });

  // Unique list of categories present (strictly mapped on-the-fly to lang selection)
  const categoriesList = [
    "全部",
    "威士忌",
    "白兰地",
    "伏特加",
    "金酒",
    "朗姆酒",
    "龙舌兰",
    "葡萄酒",
    "香槟",
    "啤酒",
    "清酒",
    "传统地方酒",
    "利口酒",
    "鸡尾酒"
  ].map((cat) => translateCategory(cat));

  // Unique list of countries present (strictly mapped on-the-fly to lang selection)
  const countriesFilterList = [
    "全部",
    "英国",
    "法国",
    "中国",
    "日本",
    "墨西哥",
    "俄罗斯",
    "爱尔兰",
    "意大利",
    "韩国"
  ].map((country) => translateCountry(country));

  // AI assistant integration
  const askAiSommelier = async (question: string) => {
    if (!question.trim()) return;

    // Push local user message
    const userMsg = { sender: "user" as const, text: question };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsAiLoading(true);

    try {
      // Build client-side history to supply Context API
      const conversationHistory = chatMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));

      const res = await fetch("/api/ai-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: question,
          history: conversationHistory,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        
        // Parse recommendation tags if they exist: [RECOMMEND_IDS: macallan-12, hennessy-xo]
        let recommendIds: string[] = [];
        const match = result.answer.match(/🎯\s*\[RECOMMEND_IDS:\s*([^\]]+)\]/);
        let cleanedAnswer = result.answer;
        if (match && match[1]) {
          recommendIds = match[1].split(",").map((s: string) => s.trim());
          // Strip the technical bracket before rendering to human user to maintain elegant interfaces
          cleanedAnswer = result.answer.replace(/🎯\s*\[RECOMMEND_IDS:\s*[^\]]+\]/g, "");
        }

        setChatMessages((prev) => [
          ...prev,
          { sender: "bot", text: cleanedAnswer, recommendIds }
        ]);
      } else {
        throw new Error("Server error");
      }
    } catch (err) {
      // Offline / error state simulation is triggered gracefully
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "十分抱歉，我刚刚在巡视酒庄橡木桶时似乎与云端网络短暂失联了。不过，根据我渊博的手艺和酒学，我可以提供针对您问题的解答。\n\n如果您询问的是苏格兰威士忌，它的大麦发酵和泥煤风韵非常经典。如果是法国波尔多产区，则是对风土（Terroir）至上理念的最佳答卷。"
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentT = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans transition-colors duration-500 selection:bg-[#C59659]/30 selection:text-white">
      
      {/* GLOWING AMBIENT BACKGROUND */}
      <div className="fixed top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,_rgba(197,_150,_89,_0.08),_transparent_65%)] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_100%_100%,_rgba(30,_41,_59,_0.2),_transparent_70%)] pointer-events-none z-0" />

      {/* TOP DECORATIVE RAIL: ANTI-AI-SLOP CLEAN LOOK */}
      <div className="w-full bg-[#05070A] border-b border-[#1E293B]/40 text-[10px] font-mono tracking-widest text-[#C59659]/60 px-6 py-1.5 flex justify-between items-center z-40">
        <div>GLOBAL SPIRITS ENCYCLOPEDIA | VER 2026.06</div>
        <div className="flex items-center gap-4">
          <span>UTC: 2026-06-10 04:51</span>
          <span className="text-emerald-500">● SECURITY SECRETS CONFIGURED</span>
        </div>
      </div>

      {/* PRIMARY CONCIERGE NAVIGATION HEADER */}
      <header className="sticky top-0 bg-[#05070A]/90 backdrop-blur-md border-b border-[#1E293B] z-30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand with custom Serif look */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#E6CEAF] to-[#B47C35] flex items-center justify-center shadow-lg shadow-yellow-950/20 shadow-inner border border-[#D6B283]/40">
              <span className="font-display font-bold text-2xl text-[#05070A] tracking-tighter">G</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-medium tracking-tight text-[#F3EADC] flex items-center gap-1.5">
                {currentT.title}
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#C59659] border border-[#C59659]/30 px-1 rounded-sm bg-yellow-950/20">
                  PRO
                </span>
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                {currentT.subtitle}
              </p>
            </div>
          </div>

          {/* Nav pills */}
          <nav className="flex flex-wrap items-center justify-center gap-1.5 bg-[#090D14] border border-[#1E293B] rounded-full p-1 max-w-full overflow-x-auto">
            {[
              { id: "home", label: currentT.navHome, icon: Compass },
              { id: "encyclopedia", label: currentT.navWiki, icon: Wine },
              { id: "culture", label: currentT.navMap, icon: BookOpen },
              { id: "brands", label: currentT.navBrands, icon: Award },
              { id: "favorites", label: currentT.navFav, icon: Heart, badge: favorites.length },
              { id: "assistant", label: currentT.navAI, icon: MessageSquare, glow: true },
              { id: "about", label: currentT.navAbout, icon: Info },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-[#C59659] text-[#05070A] font-semibold shadow-md shadow-yellow-900/10"
                      : tab.glow 
                        ? "text-yellow-400 hover:text-yellow-300 hover:bg-[#1E293B]/45 border border-yellow-500/25"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#131924]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.glow && !isActive ? "animate-pulse stroke-[2.5]" : ""}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-mono bg-red-600 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Controls: Search bar & Multi-language selector */}
          <div className="flex items-center gap-3">
            {/* Quick search input */}
            <div className="relative hidden lg:block w-48">
              <input
                type="text"
                placeholder={currentT.searchPlaceholder.slice(0, 15) + "..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && triggerGlobalSearch(searchQuery)}
                className="w-full bg-[#090D14] text-xs text-slate-300 placeholder-slate-600 rounded-full py-1.5 pl-8 pr-3 border border-[#1E293B] focus:outline-none focus:border-[#C59659] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
            </div>

            {/* Language switches */}
            <div className="flex items-center gap-1 bg-[#090D14] p-1 border border-[#1E293B] rounded-full">
              <Languages className="w-3 h-3 text-slate-500 ml-1.5 mr-0.5" />
              {[
                { code: "zh", label: "中" },
                { code: "en", label: "EN" },
                { code: "ja", label: "日" },
                { code: "ko", label: "한" }
              ].map((langObj) => (
                <button
                  key={langObj.code}
                  onClick={() => setLang(langObj.code as any)}
                  className={`px-1.5 py-0.5 text-[10px] rounded-full uppercase cursor-pointer transition-all duration-300 ${
                    lang === langObj.code
                      ? "bg-[#C59659]/20 text-[#D6B283] font-semibold border border-[#C59659]/30"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {langObj.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* MAIN LAYOUT CANVAS */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        
        {/* ==================== TAB 0: HOME / EXPLORER DASHBOARD ==================== */}
        {activeTab === "home" && (
          <div className="space-y-8 animate-fade-in">
            
            {/* LARGE HERO BLOCK WITH FLOATING SEARCH BAR & LUXURY GLASSMORPHISM */}
            <div className="relative rounded-2xl overflow-hidden border border-[#1E293B] bg-gradient-to-br from-[#090D14] to-[#040609] p-8 md:p-12 lg:p-16 text-center">
              {/* Golden circular overlay decor */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(197,_150,_89,_0.04)_0%,_transparent_70%)] pointer-events-none" />
              
              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                <div className="flex justify-center">
                  <span className="px-3 py-1 text-[10px] tracking-widest uppercase rounded-full bg-gradient-to-r from-yellow-950/40 to-yellow-900/30 text-[#D6B283] border border-[#C59659]/30 animate-pulse font-mono">
                     {lang === "zh" ? "世界酒香版图" : lang === "ja" ? "世界の酒香マップ" : lang === "ko" ? "세계의 향기로운 술 지도" : "Global Spirits Cartography"}
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-display font-semibold text-[#F3EADC] tracking-tight leading-tight">
                  {currentT.heroTitle}
                </h2>
                <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
                  {currentT.heroSubtitle}
                </p>

                {/* Highly engineered Search Bar */}
                <div className="bg-[#05070A]/80 p-2 rounded-2xl border border-[#1E293B] shadow-2xl shadow-black/80 max-w-lg mx-auto flex items-center justify-between gap-2">
                  <div className="flex-grow flex items-center pl-3">
                    <Search className="w-5 h-5 text-slate-500 mr-2.5" />
                    <input
                      type="text"
                      placeholder={currentT.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && triggerGlobalSearch(searchQuery)}
                      className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => triggerGlobalSearch(searchQuery)}
                    className="bg-[#C59659] hover:bg-yellow-600 text-[#05070A] font-semibold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{lang === "zh" ? "探索" : lang === "ja" ? "探検" : lang === "ko" ? "탐색" : "Explore"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick categories chips */}
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                    {currentT.quickAccess}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {["威士忌", "白兰地", "葡萄酒", "清酒", "龙舌兰", "传统地方酒", "鸡尾酒"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleQuickCategoryQuery(cat)}
                        className="px-3 py-1 cursor-pointer text-xs rounded-full border border-[#1E293B] bg-[#090D14] text-slate-400 hover:text-[#D6B283] hover:border-[#C59659]/50 transition-all font-display"
                      >
                        {translateCategory(cat)}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* TWO-COLUMN GRID: SPIRIT OF THE DAY & AI COMPANION ADVISE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1 & 2: Spirit of the Day featured box */}
              {(() => {
                const daySpirit = spirits.find((s) => s.id === "moutai-feitian") || spirits[0] || SPIRITS[10];
                return (
                  <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden border border-[#E6CEAF]/20 hover:border-[#C59659]/70 bg-gradient-to-br from-[#0D131F] to-[#060910] p-6 flex flex-col md:flex-row justify-between gap-6 transition-all duration-500 hover:shadow-lg hover:shadow-yellow-950/5">
                    
                    {/* Decorative glow badge */}
                    <span className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono rounded bg-yellow-950/60 border border-yellow-500/30 text-yellow-400 uppercase">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {currentT.recommendOfDay}
                    </span>

                    {/* Left content description */}
                    <div className="flex flex-col justify-between space-y-4 md:max-w-md relative z-10 mt-6 md:mt-2">
                      <div>
                        <span className="text-xs font-mono text-[#C59659] uppercase tracking-wider block">
                          {daySpirit.brand}
                        </span>
                        <h3 className="text-2xl font-display font-medium text-[#F3EADC] tracking-tight mt-1">
                          {daySpirit.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono italic mt-0.5">
                          {daySpirit.english_name || daySpirit.name}
                        </p>
                        
                        <p className="text-xs text-slate-400 leading-relaxed mt-3">
                          {daySpirit.production_method || daySpirit.flavor_profile || daySpirit.history}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 bg-[#05070A]/60 px-4 py-2.5 rounded-md border border-[#1E293B]/60 font-mono text-xs text-slate-400">
                        <div>
                          <span className="block text-[8px] text-slate-500 uppercase font-mono">
                            {lang === "zh" ? "酒精度 ABV" : lang === "ja" ? "アルコール度数" : lang === "ko" ? "알코올 도수" : "Alcohol ABV"}
                          </span>
                          <span className="text-slate-300 font-semi">{daySpirit.abv}</span>
                        </div>
                        <div className="w-[1px] h-6 bg-[#1E293B]" />
                        <div>
                          <span className="block text-[8px] text-slate-500 uppercase font-mono">
                            {lang === "zh" ? "原产国家" : lang === "ja" ? "原産国" : lang === "ko" ? "원산국" : "Origin Country"}
                          </span>
                          <span className="text-slate-300 font-semi">{translateCountry(daySpirit.country)}</span>
                        </div>
                        <div className="w-[1px] h-6 bg-[#1E293B]" />
                        <div>
                          <span className="block text-[8px] text-slate-500 uppercase font-mono">
                            {lang === "zh" ? "品级评分" : lang === "ja" ? "評価" : lang === "ko" ? "평점" : "Rating"}
                          </span>
                          <span className="text-[#C59659] font-bold">{daySpirit.rating.toFixed(1)} ★★★★★</span>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedSpirit(daySpirit)}
                          className="bg-[#C59659] hover:bg-yellow-600 text-[#05070A] font-semibold text-xs px-4 py-2.5 rounded transition-all cursor-pointer"
                        >
                          {currentT.viewDetail}
                        </button>
                        <button
                          onClick={(e) => toggleFavorite(daySpirit.id, e)}
                          className={`p-2 rounded border cursor-pointer transition-all ${
                            favorites.includes(daySpirit.id)
                              ? "bg-red-950/20 text-red-500 border-red-500/50"
                              : "border-[#1E293B] text-slate-400 hover:text-[#C59659]"
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>

                    {/* Right Image element */}
                    <div className="w-full md:w-64 h-48 md:h-auto rounded-lg overflow-hidden position-relative border border-[#1E293B]/80 shadow-md">
                      <img
                        src={moutaiBottlesImg}
                        alt="Moutai custom presentation"
                        className="w-full h-full object-cover group-hover:scale-105 duration-700 transition-all filter brightness-100"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                  </div>
                );
              })()}

              {/* Column 3: Sommelier Mini-assistant promo bubble */}
              <div className="rounded-2xl border border-[#1E293B] bg-gradient-to-br from-[#090D14] to-[#05070A] p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <h3 className="text-sm font-display font-medium text-[#F3EADC] uppercase tracking-wider">
                      {currentT.aiSectionTitle || "AI 侍酒助手 RAG / Sommelier AI"}
                    </h3>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentT.aiSectionDesc || "基于 Gemini 超脑，结合全球最严苛的酒品风味数据库，实时解答您的选酒、送礼搭配、历史考据等难题，提供侍酒师级别的结构化方案。"}
                  </p>

                  {/* Preloaded buttons selection */}
                  <div className="space-y-1.5 pt-2">
                    {[
                      { text: currentT.aiPrompt1, query: "向新手推荐几款香气甜美、酒体顺滑的雪莉桶威士忌，最好附带品鉴温度" },
                      { text: currentT.aiPrompt2, query: "请详细拆解一下日本清酒‘特定名称酒’的划分规则，比如纯米大吟酿和吟酿有什么区别？精米步合意味着什么？" },
                      { text: currentT.aiPrompt3, query: "龙舌兰 Tequila 和梅斯卡尔 Mezcal 主要有哪些酿造原料、产区以及风味轮上的差异？" }
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab("assistant");
                          askAiSommelier(prompt.query);
                        }}
                        className="w-full text-left bg-[#05070A] hover:bg-[#C59659]/5 border border-[#1E293B] hover:border-[#C59659]/30 rounded px-3 py-2 text-[11px] text-slate-400 hover:text-yellow-200 cursor-pointer transition-all duration-300 flex items-center justify-between group"
                      >
                        <span className="truncate max-w-[90%]">{prompt.text}</span>
                        <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-[#C59659] transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("assistant")}
                  className="w-full mt-4 bg-gradient-to-r from-yellow-950/30 to-yellow-900/30 border border-[#C59659]/30 hover:border-[#C59659]/80 rounded py-2 text-xs font-semibold text-[#D6B283] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{currentT.askButton}</span>
                </button>
              </div>

            </div>

            {/* QUICK STATS RAIL: DESKTOP-FIRST PRECISION */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#090D14]/90 border border-[#1E293B]/40 p-4 rounded-xl">
              {[
                { title: currentT.statTotal, val: `${spirits.length}${currentT.statTotalVal}`, desc: currentT.statTotalDesc },
                { title: currentT.statCountries, val: `${new Set(spirits.map(s => s.country)).size}${currentT.statCountriesVal}`, desc: currentT.statCountriesDesc },
                { title: currentT.statBrands, val: `${brands.length}${currentT.statBrandsVal}`, desc: currentT.statBrandsDesc },
                { title: currentT.statActive, val: currentT.statActiveVal, desc: currentT.statActiveDesc }
              ].map((stat, idx) => (
                <div key={idx} className="ps-4 border-l border-[#1E293B] first:border-0">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{stat.title}</span>
                  <p className="text-lg font-display font-bold text-[#F3EADC] mt-0.5">{stat.val}</p>
                  <span className="text-[9px] font-mono text-slate-600 uppercase">{stat.desc}</span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== TAB 1: ENCYCLOPEDIA (酒类百科) ==================== */}
        {activeTab === "encyclopedia" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* SEARCH AND FILTER CRITERIA CONTAINER */}
            <div className="bg-[#090D14] border border-[#1E293B] rounded-xl p-5 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                
                {/* Search query box */}
                <div className="relative w-full lg:max-w-md">
                  <input
                    type="text"
                    placeholder={currentT.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#05070A] text-xs text-slate-200 placeholder-slate-600 rounded-lg py-2.5 pl-9 pr-8 border border-[#1E293B] focus:outline-none focus:border-[#C59659]"
                  />
                  <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
                  {searchQuery && (
                    <button onClick={handleClearSearch} className="absolute right-3 top-3 text-slate-500 hover:text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Dropdowns filters */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  {/* Select Country */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 uppercase">{lang === "zh" ? "国度:" : lang === "ja" ? "国:" : lang === "ko" ? "국가:" : "Nation:"}</span>
                    <select
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className="bg-[#05070A] border border-[#1E293B] rounded text-xs px-3 py-1.5 text-slate-300 focus:outline-none focus:border-[#C59659] cursor-pointer"
                    >
                      {countriesFilterList.map((country) => (
                        <option key={country} value={country}>
                          {country === "全部" ? currentT.allCountries : country}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sorting criteria */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 uppercase">{currentT.sortBy}:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-[#05070A] border border-[#1E293B] rounded text-xs px-3 py-1.5 text-slate-300 focus:outline-none focus:border-[#C59659] cursor-pointer"
                    >
                      <option value="rating">{currentT.ratingHigh}</option>
                      <option value="abvDesc">{currentT.abvHigh}</option>
                      <option value="abvAsc">{currentT.abvLow}</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* HORIZONTAL CATEGORY SLIDER PILLS (Core requirement 2) */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#1E293B]/60 overflow-x-auto pb-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 mr-2">
                  {lang === "zh" ? "风味类型:" : lang === "ja" ? "カテゴリー:" : lang === "ko" ? "스타일:" : "Styles:"}
                </span>
                <div className="flex gap-1">
                  {categoriesList.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 text-xs rounded uppercase font-display cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#C59659]/20 text-[#D6B283] font-semibold border border-[#C59659]"
                            : "bg-[#05070A] hover:bg-[#1E293B]/40 text-slate-400 hover:text-slate-300 border border-[#1E293B]/60"
                        }`}
                      >
                        {cat === "全部" ? currentT.allCategories : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* MAIN PRODUCT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpirits.map((item) => {
                const isFav = favorites.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedSpirit(item)}
                    className="group bg-gradient-to-br from-[#090D14] to-[#040609] border border-[#1E293B] hover:border-[#C59659]/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:shadow-black/60 relative"
                  >
                    
                    {/* Floating Country Label & Fav Heart */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                      <span className="bg-[#05070A]/80 border border-[#1E293B] text-[10px] font-mono text-slate-300 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {item.country.split(" (")[0]}
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[#05070A]/80 border border-[#1E293B] hover:border-[#C59659] text-xs text-slate-400 hover:text-red-500 transition-all cursor-pointer backdrop-blur-sm"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-red-500 stroke-red-500" : ""}`} />
                    </button>

                    {/* Image block */}
                    <div className="w-full h-44 overflow-hidden relative border-b border-[#1E293B]">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-85"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090D14] to-transparent opacity-60" />
                    </div>

                    {/* Meta info card */}
                    <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#C59659] lowercase tracking-wider block">
                          {item.category}
                        </span>
                        <h4 className="text-base font-display font-semibold text-[#F3EADC] group-hover:text-yellow-100 transition-colors tracking-tight">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono italic truncate">
                          {item.english_name}
                        </p>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.flavor_profile}
                      </p>

                      {/* Flavor tags list */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.flavor_tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-yellow-950/20 text-[#D6B283] border border-[#C59659]/20 text-[9px] px-1.5 py-0.2 rounded font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Base Spec Grid Footplate */}
                    <div className="bg-[#05070A] border-t border-[#1E293B]/40 px-4 py-2.5 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#C59659]" />
                        <span>ABV: <strong>{item.abv}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 font-bold">
                        <span>★ {item.rating.toFixed(1)}</span>
                      </div>
                    </div>

                  </div>
                );
              })}

              {filteredSpirits.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 space-y-3">
                  <Wine className="w-12 h-12 text-slate-800 mx-auto animate-bounce" />
                  <p>{currentT.searchEmpty || "没有找到任何符合当前筛选条件的珍藏酒品。"}</p>
                  <p className="text-xs text-slate-600">{currentT.searchEmptyDesc || "尝试清空或重置搜索词与过滤器条件。"}</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== TAB 2: MAP & NATIONAL CULTURES (国家酒文化) ==================== */}
        {activeTab === "culture" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-[#090D14] to-[#05070A] border border-[#1E293B] rounded-xl p-5">
              <h2 className="text-xl font-display font-bold text-[#F3EADC] tracking-tight">
                {lang === "zh" ? "国家酒文化航海图" : lang === "ja" ? "世界の酒文化マップ" : lang === "ko" ? "국가별 술 문화 지도" : "Interactive Culture Atlas"}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mt-1">
                {lang === "zh" ? "点击世界地图上的金色高光坐标点，即刻探索关于苏格兰、法国、中国、日本、墨西哥或韩国的原生风土历史、年产量，以及尊贵古雅的酒文化品饮之仪。" : lang === "ja" ? "世界地図のゴールドに輝くポイントをクリックして、スコットランド、フランス、中国、日本、メキシコ、韓国のテロワールの歴史、年間生産量、文化的流儀を探索してください。" : lang === "ko" ? "세계 지도 위의 빛나는 황금빛 앵커들을 클릭해 보세요. 스코틀랜드, 프랑스, 중국, 일본, 멕시코, 그리고 한국 고유의 테루아 역사, 연간 생산량 및 고풍스러운 격식과 문화를 탐험할 수 있습니다." : "Click any golden highlight coordinate on the world map to explore Scotland, France, China, Japan, Mexico, or South Korea's terroir history, annual yields, and ancient ritual sips."}
              </p>
            </div>

            <WorldMap
              countries={countries}
              onSelectCountry={setSelectedCountry}
              selectedCountry={selectedCountry}
            />
          </div>
        )}

        {/* ==================== TAB 3: BRAND LIBRARY (酒品牌库) ==================== */}
        {activeTab === "brands" && (
          <div className="space-y-6 animate-fade-in">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className="bg-gradient-to-br from-[#090D14] to-[#040609] border border-[#1E293B] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between space-y-4"
                >
                  {/* Watermark Logo Initials */}
                  <span className="absolute -bottom-8 -right-4 font-display font-extrabold text-[#1E293B]/20 text-8xl pointer-events-none select-none">
                    {brand.logo}
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
                      <div>
                        <h4 className="text-base font-display font-semibold text-[#F3EADC] tracking-tight">
                          {brand.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono italic">{brand.english_name}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#D6B283] bg-[#C59659]/10 px-2 py-0.5 rounded border border-[#C59659]/20">
                        {lang === "zh" ? "创立：" : lang === "ja" ? "設立：" : lang === "ko" ? "설립: " : "Founded: "}{brand.founded_year}{lang === "zh" || lang === "ja" ? "年" : ""}
                      </span>
                    </div>

                    <p className="text-xs text-[#C59659] font-medium font-mono">{brand.country}</p>
                    <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-[#C59659]/40 pl-2.5">
                      {brand.description}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{brand.history}</p>
                  </div>

                  {/* Core product portfolio list */}
                  <div className="space-y-2 pt-2 z-10">
                    <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase block">
                      {lang === "zh" ? "代表旗舰作" : lang === "ja" ? "主要な銘柄" : lang === "ko" ? "대표 플래그십" : "Flagships"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.products.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerGlobalSearch(p)}
                          className="text-[10px] bg-[#05070A] hover:bg-[#C59659]/10 text-slate-400 hover:text-yellow-250 px-2 py-1 rounded border border-[#1E293B]/60 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>{p}</span>
                          <Search className="w-2.5 h-2.5 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 z-10 border-t border-[#1E293B]/40 flex items-center justify-between">
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#D6B283] hover:text-white transition-colors flex items-center gap-1 font-mono hover:underline"
                    >
                      <span>{lang === "zh" ? "前往官方庄园" : lang === "ja" ? "公式サイトへ" : lang === "ko" ? "공식 홈페이지" : "Digital Estate"}</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== TAB 4: FAVORITES (收藏夹) ==================== */}
        {activeTab === "favorites" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-r from-yellow-950/10 to-[#05070A] border border-[#1E293B] rounded-xl p-5">
              <h2 className="text-xl font-display font-bold text-[#F3EADC] tracking-tight">
                {lang === "zh" ? "酒学珍藏库" : lang === "ja" ? "マイ・コレクション" : lang === "ko" ? "나의 프라이빗 셀러" : "My Private Cellar"}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mt-1">
                {lang === "zh" ? "保存您心仪的佳酿与文化地标项目，随时点击查看。" : lang === "ja" ? "お気に入りの名酒やウイスキー、各地の伝統酒を保存して、すぐに確認できます。" : lang === "ko" ? "소중한 명주와 브랜드 컬렉션을 저장하고 손쉽게 확인하세요." : "Save your favorite spirits and distillery cards here for instant lookup."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spirits
                .filter((item) => favorites.includes(item.id))
                .map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedSpirit(item)}
                      className="group bg-gradient-to-br from-[#090D14] to-[#040609] border border-[#C59659]/40 hover:border-[#C59659]/80 rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between hover:shadow-lg relative"
                    >
                      <button
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-xs text-red-500 hover:bg-transparent duration-300 transition-all cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <div className="w-full h-40 overflow-hidden relative border-b border-[#1E293B]">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform filter brightness-85"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#C59659] block">{item.category}</span>
                          <h4 className="text-base font-display font-semibold text-[#F3EADC]">{item.name}</h4>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{item.english_name}</p>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {item.flavor_profile}
                        </p>
                      </div>

                      <div className="bg-[#05070A] border-t border-[#1E293B]/40 px-4 py-2 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{lang === "zh" ? "度数: " : lang === "ja" ? "度数: " : lang === "ko" ? "도수: " : "ABV: "}{item.abv}</span>
                        <span className="text-yellow-500">★ {item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}

              {spirits.filter((item) => favorites.includes(item.id)).length === 0 && (
                <div className="col-span-full bg-[#090D14] p-12 text-center text-slate-500 border border-[#1E293B] rounded-xl space-y-3">
                  <Heart className="w-10 h-10 text-slate-800 mx-auto animate-pulse" />
                  <p className="text-sm max-w-sm mx-auto leading-relaxed">
                    {currentT.favoritesEmpty}
                  </p>
                  <button
                    onClick={() => setActiveTab("encyclopedia")}
                    className="bg-[#C59659]/10 hover:bg-[#C59659]/30 text-[#D6B283] border border-[#C59659]/40 hover:text-white px-4 py-1.5 rounded text-xs transition-all cursor-pointer mt-2"
                  >
                    {lang === "zh" ? "前往选酒百科" : lang === "ja" ? "図鑑へ移動" : lang === "ko" ? "백과사전으로 이동" : "Go to Encyclopedia"}
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================== TAB 5: AI CONCIERGE ASSISTANT (AI智能查询助手) ==================== */}
        {activeTab === "assistant" && (
          <div className="space-y-6 animate-fade-in relative max-w-4xl mx-auto">
            
            {/* Header info badge applet-style */}
            <div className="flex items-center gap-3 bg-[#090D14]/90 p-4 border border-[#1E293B] rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#C59659]/10 border border-[#C59659]/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-display font-semibold text-[#F3EADC]">
                  {lang === "zh" ? "高级智能侍酒师 AI / RAG Wine Sommelier" : lang === "ja" ? "AIソムリエ＆スマート知識ベース" : lang === "ko" ? "인공지능 스마트 소믈리에" : "Advanced Smart Sommelier AI / RAG"}
                </h3>
                <p className="text-xs text-slate-500">
                  {lang === "zh" ? "内置高级知识检索，全语种理解。自动识别推荐内容并与百科交互。" : lang === "ja" ? "高度なRAG知識ベースを内蔵、多言語対応。推奨コンテンツを自動解析し、図鑑と連携します。" : lang === "ko" ? "고급 지식 검색 기술이 융합된 다국어 지원 엔진. 추천 항목을 자동으로 분석하여 통합 카드뷰를 제공합니다." : "Built-in advanced RAG search, multi-language context. Automatically connects recommended bottles with the encyclopedia."}
                </p>
              </div>
            </div>

            {/* Main Chat Screen Frame */}
            <div className="bg-[#090D14] border border-[#1E293B] rounded-xl flex flex-col h-[500px] overflow-hidden shadow-2xl relative">
              
              {/* Message scroll log */}
              <div className="flex-grow p-5 overflow-y-auto space-y-5">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[9px] font-mono text-slate-500 mb-1">
                      {msg.sender === "user" 
                        ? (lang === "zh" ? "EXPLORER / 你" : lang === "ja" ? "EXPLORER / あなた" : lang === "ko" ? "EXPLORER / 나" : "EXPLORER / You") 
                        : (lang === "zh" ? "SOMMELIER / 智能助理" : lang === "ja" ? "SOMMELIER / AIアシスタント" : lang === "ko" ? "SOMMELIER / 스마트 어시스턴트" : "SOMMELIER / AI Assistant")
                      }
                    </span>
                    
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap tracking-wide ${
                        msg.sender === "user"
                          ? "bg-[#C59659] text-[#05070A] font-semibold rounded-tr-none shadow-sm"
                          : "bg-[#05070A] text-slate-200 border border-[#1E293B]/80 rounded-tl-none"
                      }`}
                    >
                      {msg.text}

                      {/* Interactive Spirit recommendation cards inside the assistant! */}
                      {msg.recommendIds && msg.recommendIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#1E293B] space-y-2">
                          <span className="text-[10px] font-mono text-[#D6B283] block uppercase tracking-wider">
                            ✦ 侍酒师关联卡片 / Recommended Spirits
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {spirits
                              .filter((s) => msg.recommendIds?.includes(s.id))
                              .map((spirit) => (
                                <div
                                  key={spirit.id}
                                  onClick={() => setSelectedSpirit(spirit)}
                                  className="bg-[#090D14] hover:bg-[#1E293B] border border-[#C59659]/30 hover:border-[#C59659]/80 rounded-lg p-2.5 transition-all text-left flex items-center gap-3 cursor-pointer group shadow-sm"
                                >
                                  <img
                                    src={spirit.image_url}
                                    alt={spirit.name}
                                    className="w-10 h-10 rounded object-cover border border-[#1E293B]"
                                  />
                                  <div className="truncate flex-grow">
                                    <h5 className="text-[11px] font-semibold text-slate-200 group-hover:text-yellow-100 truncate">
                                      {spirit.name}
                                    </h5>
                                    <span className="text-[9px] text-[#C59659] font-mono">{spirit.category}</span>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:translate-x-1 duration-200 transition-transform" />
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-mono text-slate-500 mb-1">
                      {lang === "zh" ? "SOMMELIER / 智能助理" : lang === "ja" ? "SOMMELIER / AIアシスタント" : lang === "ko" ? "SOMMELIER / 스마트 어시스턴트" : "SOMMELIER / AI Assistant"}
                    </span>
                    <div className="bg-[#05070A] text-slate-400 border border-[#1E293B] rounded-xl px-4 py-3 text-xs flex items-center gap-2">
                       <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C59659] animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C59659] animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C59659] animate-bounce"></span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-wide">
                        {currentT.aiSearching || "正在精心翻阅酒庄百科与风土典籍..."}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions quick tap pill blocks */}
              <div className="px-4 py-2 border-t border-[#1E293B]/40 bg-[#05070A]/50 flex items-center gap-2 overflow-x-auto">
                <span className="shrink-0 text-[9px] font-mono text-slate-500 uppercase">
                  {lang === "zh" ? "快捷追问 / Hot:" : lang === "ja" ? "クイック質問 / Hot:" : lang === "ko" ? "빠른 질문 / Hot:" : "Quick Follow-up / Hot:"}
                </span>
                <div className="flex gap-1.55 shrink-0 overflow-x-auto">
                  {[
                    { label: lang === "zh" ? "推荐适合新手的威士忌" : lang === "ja" ? "初心者向けのウイスキー" : lang === "ko" ? "초보자용 위스키 추천" : "Whiskey for Beginners", query: "推荐适合新手的威士忌" },
                    { label: lang === "zh" ? "法国著名波尔多产区" : lang === "ja" ? "ボルドーの名産地" : lang === "ko" ? "보르도 와인 생산지" : "Bordeaux Wine Region", query: "法国著名波尔多产区" },
                    { label: lang === "zh" ? "清酒特级如何区分" : lang === "ja" ? "日本酒の等級区分" : lang === "ko" ? "사케 상급 구분법" : "Sake Classification", query: "清酒特级如何区分" },
                    { label: lang === "zh" ? "龙舌兰1942特点" : lang === "ja" ? "ドン・フリオ 1942の特徴" : lang === "ko" ? "돈 훌리오 1942 특징" : "Don Julio 1942 Specs", query: "龙舌兰1942特点" }
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => askAiSommelier(chip.query)}
                      className="shrink-0 text-[10px] bg-[#090D14] hover:bg-[#C59659]/10 border border-[#1E293B] text-slate-400 hover:text-yellow-150 px-2.5 py-1 rounded transition-all cursor-pointer font-sans"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message send toolbar input box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  askAiSommelier(chatInput);
                }}
                className="p-3.5 border-t border-[#1E293B] bg-[#05070A] flex gap-2"
              >
                <input
                  type="text"
                  placeholder={lang === "zh" ? "询问AI学者，例如：'给我推荐一款配和牛的法国干红'..." : lang === "ja" ? "AIソムリエに尋ねる。例えば：'和牛に合うフランス赤ワインを教えて。'..." : lang === "ko" ? "소믈리에에게 질문해 보세요. 예: '소고기 와규와 잘 어울리는 프랑스 대가급 레드 와인은?'..." : "Ask AI Scholar, e.g. 'Recommend a deep red wine to pair with Wagyu tenderloin'..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isAiLoading}
                  className="flex-grow bg-[#090D14] text-xs text-slate-200 placeholder-slate-600 rounded-lg px-4 py-2.5 border border-[#1E293B] focus:outline-none focus:border-[#C59659]"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !chatInput.trim()}
                  className={`px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                    chatInput.trim() && !isAiLoading
                      ? "bg-[#C59659] hover:bg-yellow-600 text-[#05070A]"
                      : "bg-[#131924] text-slate-650 cursor-not-allowed border border-slate-800"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === "zh" ? "发送询问" : lang === "ja" ? "送信する" : lang === "ko" ? "질문하기" : "Ask"}</span>
                </button>
              </form>

            </div>

          </div>
        )}

        {/* ==================== TAB 6: ABOUT US / HOW TO TASTE (关于我们) ==================== */}
        {activeTab === "about" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-slate-300">
            
            <div className="bg-gradient-to-br from-[#090D14] to-[#040609] border border-[#1E293B] rounded-xl p-8 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-[#C59659]/10 font-display font-bold text-6xl">
                CRAFT
              </span>

              <h2 className="text-2xl font-display font-medium text-[#F3EADC] border-b border-[#1E293B] pb-4 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#C59659]" />
                {currentT.guideHeaderTitle || "品酒艺术与理性指南 / Master Sommelier Philosophy"}
              </h2>

              <div className="space-y-6 mt-6 leading-relaxed">
                
                {/* 3 Step tasting lore */}
                <div className="space-y-3">
                  <h3 className="text-base font-display font-semibold text-[#D6B283] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C59659]/20 text-[#C59659] text-xs flex items-center justify-center font-mono font-bold">1</span>
                    {currentT.guideStep1Title || "色（Sight）—— 观其骨血"}
                  </h3>
                  <p className="text-xs text-slate-400 ps-7">
                    {currentT.guideStep1Desc}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-display font-semibold text-[#D6B283] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C59659]/20 text-[#C59659] text-xs flex items-center justify-center font-mono font-bold">2</span>
                    {currentT.guideStep2Title || "香（Nose）—— 察其幽魂"}
                  </h3>
                  <p className="text-xs text-slate-400 ps-7">
                    {currentT.guideStep2Desc}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-display font-semibold text-[#D6B283] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#C59659]/20 text-[#C59659] text-xs flex items-center justify-center font-mono font-bold">3</span>
                    {currentT.guideStep3Title || "味（Savor）—— 品其傲骨"}
                  </h3>
                  <p className="text-xs text-slate-400 ps-7">
                    {currentT.guideStep3Desc}
                  </p>
                </div>

                <div className="bg-yellow-950/20 border-l-4 border-[#C59659] p-4 rounded-r-md mt-6">
                  <h4 className="text-sm font-semibold text-yellow-300 font-display flex items-center gap-1.5">
                    <Info className="w-4 h-4 shrink-0" />
                    {currentT.guideWiselyTitle}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {currentT.guideWiselyDesc}
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* ==================== GLOBAL SPIRIT SLIDEOUT DRAWER / MODAL DETAILS (Core requirement 6 & Details page) ==================== */}
      {selectedSpirit && activeSpirit && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex justify-end z-50 animate-fade-in">
          
          {/* Main Slideout body */}
          <div className="w-full max-w-2xl bg-[#090D14] h-full overflow-y-auto border-l border-[#1E293B] shadow-2xl p-6 relative flex flex-col justify-between">
            
            {/* Top Close header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
              <div>
                <span className="text-xs font-mono text-[#C59659] uppercase tracking-wider">
                  {activeSpirit.category}
                </span>
                <h3 className="text-xl font-display font-bold text-[#F3EADC]">
                  {activeSpirit.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono italic">
                  {activeSpirit.english_name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Favorites button */}
                <button
                  onClick={() => toggleFavorite(activeSpirit.id)}
                  className={`p-2 rounded-full border cursor-pointer transition-all ${
                    favorites.includes(activeSpirit.id)
                      ? "bg-red-950/30 text-red-500 border-red-500/40"
                      : "border-[#1E293B] text-slate-400 hover:text-[#C59659]"
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedSpirit(null)}
                  className="p-1 px-1.5 text-slate-400 border border-slate-800 rounded bg-slate-900 overflow-hidden hover:text-white hover:border-[#C59659] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content panel */}
            <div className="space-y-6 pt-5 pb-5 flex-grow">
              
              {/* Product Header details card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Image panel */}
                <div className="rounded-xl overflow-hidden border border-[#1E293B] h-48 md:h-64 shadow-md bg-slate-900 object-center">
                  <img
                    src={activeSpirit.image_url}
                    alt={activeSpirit.name}
                    className="w-full h-full object-cover filter brightness-95"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Specs card list */}
                <div className="bg-[#05070A] border border-[#1E293B] rounded-xl p-4 space-y-3.5">
                  <h4 className="text-[11px] uppercase tracking-widest font-mono text-[#D6B283] border-b border-[#1E293B]/60 pb-1.5 flex items-center gap-1.5">
                    <Wine className="w-3.5 h-3.5" />
                    {currentT.basicSpecs}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase">原产国度 / Origin</span>
                      <span className="text-slate-350">{activeSpirit.country}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase">核心产区 / region</span>
                      <span className="text-slate-350">{activeSpirit.region}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase">酒精浓度 / ABV</span>
                      <span className="text-[#C59659] font-bold">{activeSpirit.abv}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase font-mono">调配原料 / Crops</span>
                      <span className="text-slate-350 truncate block" title={activeSpirit.ingredients}>
                        {activeSpirit.ingredients}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1E293B]/40 text-xs">
                    <span className="block text-[8px] font-mono text-slate-500 uppercase">核心制程工艺 / Distilling Process</span>
                    <p className="text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                      {activeSpirit.production_method}
                    </p>
                  </div>
                </div>

              </div>

              {/* RADAR GRAPHS & DESCRIPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Custom Radar graph component */}
                <RadarChart data={activeSpirit.wheel_data} />

                {/* Aroma & Taste details columns */}
                <div className="space-y-4">
                  <div className="bg-[#05070A]/50 p-3 rounded-lg border border-[#1E293B]/60 list-none">
                    <h5 className="text-[#D6B283] text-xs font-semibold flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C59659]" />
                      {currentT.aroma}
                    </h5>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      {activeSpirit.aroma}
                    </p>
                  </div>

                  <div className="bg-[#05070A]/50 p-3 rounded-lg border border-[#1E293B]/60 list-none">
                    <h5 className="text-[#D6B283] text-xs font-semibold flex items-center gap-1.5 mb-1.5">
                      <Wine className="w-3.5 h-3.5 text-[#C59659]" />
                      {currentT.taste}
                    </h5>
                    <p className="text-xs text-slate-350 leading-relaxed">
                      {activeSpirit.taste}
                    </p>
                  </div>
                </div>
              </div>

              {/* SERVING RECOMENDS TEMPERATURES & GLASSWARE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#05070A] p-3 rounded-lg border border-[#1E293B]/40 flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#C59659]/10 flex items-center justify-center border border-[#C59659]/20">
                    <Thermometer className="w-5 h-5 text-[#C59659]" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase">{currentT.serveTemp}</span>
                    <span className="text-xs font-semibold font-mono text-slate-300">{activeSpirit.serve_temp}</span>
                  </div>
                </div>

                <div className="bg-[#05070A] p-3 rounded-lg border border-[#1E293B]/40 flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#C59659]/10 flex items-center justify-center border border-[#C59659]/20">
                    <GlassWater className="w-5 h-5 text-[#C59659]" />
                  </div>
                  <div>
                    <span className="block text-[8px] font-mono text-slate-500 uppercase">{currentT.glassType}</span>
                    <span className="text-xs font-semibold text-slate-300 truncate block max-w-[170px]" title={activeSpirit.glass_type}>
                      {activeSpirit.glass_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* HISTORY & STORIES LORE */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase tracking-widest font-mono text-[#D6B283] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {currentT.historyTitle}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-[#05070A] p-3.5 rounded border border-[#1E293B]">
                  {activeSpirit.history}
                </p>
              </div>

              {/* FOOD PAIRING */}
              <div className="space-y-1.5">
                <h4 className="text-xs uppercase tracking-widest font-mono text-[#D6B283] flex items-center gap-1.5">
                  <GlassWater className="w-3.5 h-3.5" />
                  {currentT.foodPairing}
                </h4>
                <p className="text-xs text-slate-300 bg-[#C59659]/5 px-3 py-2.5 rounded border border-[#C59659]/10">
                  {activeSpirit.food_pairing}
                </p>
              </div>

              {/* EXPERT AI REVIEW */}
              <div className="bg-[#C59659]/10 rounded-xl border border-[#C59659]/40 p-4 space-y-1.5 relative overflow-hidden">
                <span className="absolute top-1 right-2 uppercase font-mono text-[65px] text-[#C59659]/5 select-none font-bold">
                  SMM
                </span>
                <h5 className="text-xs font-semibold text-yellow-300 font-display flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  {currentT.aiReview}
                </h5>
                <p className="text-xs text-slate-350 leading-relaxed italic">
                  “ {activeSpirit.ai_review} ”
                </p>
              </div>

            </div>

            {/* Footer triggers */}
            <div className="border-t border-[#1E293B]/80 pt-4 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                ID: {activeSpirit.id}
              </span>
              <button
                onClick={() => {
                  setSelectedSpirit(null);
                  setActiveTab("assistant");
                  const prompt = lang === "zh"
                    ? `请详细描述一下【${activeSpirit.name}】的风味搭配和酿造背景。`
                    : lang === "ja"
                    ? `【${activeSpirit.name}】のペアリングと酒造りの背景について詳しく教えてください。`
                    : lang === "ko"
                    ? `【${activeSpirit.name}】의 페어링과 양조 스토리에 대해 자세히 설명해 주세요.`
                    : `Please describe ${activeSpirit.name} in detail regarding its tasting pairing and distilling backstory.`;
                  askAiSommelier(prompt);
                }}
                className="bg-[#C59659] hover:bg-yellow-600 text-[#05070A] font-semibold text-xs px-4 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>
                  {lang === "zh" ? "让 AI 侍酒师深度拆解此酒" : lang === "ja" ? "AIソムリエに尋ねる" : lang === "ko" ? "AI 소믈리에가 분석하기" : "Ask AI Sommelier to Settle Story"}
                </span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* FOOTER CONTROLS */}
      <footer className="bg-[#05070A] border-t border-[#1E293B]/60 py-8 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <p className="text-xs font-display text-slate-400">
            © 2026 <strong>Global Spirits Explorer (全球酒类探索者)</strong>. Crafted for Connoisseurs with Sovereign Taste.
          </p>
          <p className="text-[10px] font-mono text-slate-600 max-w-xl mx-auto leading-relaxed">
            温馨提示：未成年人严禁饮酒，过量饮酒有害健康。请理性享饮，酒后拒绝驾车。
          </p>
          <p className="text-[10px] font-mono text-slate-700">
            Powered by <strong>@google/genai & Gemini AI Studio</strong>
          </p>
        </div>
      </footer>

    </div>
  );
}
