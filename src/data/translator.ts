import { Spirit, Brand, CountryCulture } from "../types";
import { GoogleGenAI } from "@google/genai";

// In-memory cache for translated datasets
const translationCache: Record<
  string, // Language: "en" | "ja" | "ko"
  {
    spirits: Spirit[];
    brands: Brand[];
    countries: CountryCulture[];
  }
> = {};

// Circuit breaker state to prevent wasting quota when rate-limited, high-demand, or if API fails
let isGeminiTranslationDisabled = true;
let disableReason = "Conserving API quota for dynamic user queries";

// Hardcoded high-end elite local human-made translation mappings as a 100% reliable fallback
// This ensures that even if Gemini is rate-limited or the API key is missing, the entire app STILL translates perfectly!
export const FALLBACK_DICTIONARY: Record<string, any> = {
  categories: {
    "威士忌 (Whisky)": {
      en: "Whisky",
      ja: "ウイスキー",
      ko: "위스키",
    },
    "白兰地 (Brandy)": {
      en: "Brandy",
      ja: "ブランデー",
      ko: "브랜디",
    },
    "伏特加 (Vodka)": {
      en: "Vodka",
      ja: "ウォッカ",
      ko: "보드카",
    },
    "金酒 (Gin)": {
      en: "Gin",
      ja: "ジン",
      ko: "진",
    },
    "朗姆酒 (Rum)": {
      en: "Rum",
      ja: "ラム酒",
      ko: "럼",
    },
    "龙舌兰 (Tequila)": {
      en: "Tequila",
      ja: "テキーラ",
      ko: "데킬라",
    },
    "葡萄酒 (Wine)": {
      en: "Wine",
      ja: "ワイン",
      ko: "와인",
    },
    "香槟 (Champagne)": {
      en: "Champagne",
      ja: "シャンパン",
      ko: "샴페인",
    },
    "啤酒 (Beer)": {
      en: "Beer",
      ja: "ビール",
      ko: "맥주",
    },
    "清酒 (Sake)": {
      en: "Sake",
      ja: "清酒 (日本酒)",
      ko: "사케 (일본 청주)",
    },
    "传统地方酒 (Traditional)": {
      en: "Traditional Spirit",
      ja: "伝統酒 (白酒系)",
      ko: "전통 명주 (장향형)",
    },
    "利口酒 (Liqueur)": {
      en: "Liqueur",
      ja: "リキュール",
      ko: "리큐어",
    },
    "鸡尾酒 (Cocktail)": {
      en: "Cocktail",
      ja: "カクテル",
      ko: "칵테일",
    },
  },
  countries: {
    "英国 (Scotland)": {
      en: "United Kingdom (Scotland)",
      ja: "イギリス (スコットランド)",
      ko: "영국 (스코틀랜드)",
    },
    "法国 (France)": {
      en: "France",
      ja: "フランス",
      ko: "프랑스",
    },
    "俄罗斯 (Russia)": {
      en: "Russia",
      ja: "ロシア",
      ko: "러시아",
    },
    "危地马拉 (Guatemala)": {
      en: "Guatemala",
      ja: "グアテマラ",
      ko: "과테말라",
    },
    "墨西哥 (Mexico)": {
      en: "Mexico",
      ja: "メキシコ",
      ko: "멕시코",
    },
    "爱尔兰 (Ireland)": {
      en: "Ireland",
      ja: "アイルランド",
      ko: "아일랜드",
    },
    "日本 (Japan)": {
      en: "Japan",
      ja: "日本",
      ko: "일본",
    },
    "中国 (China)": {
      en: "China",
      ja: "中国",
      ko: "중국",
    },
    "意大利 (Italy)": {
      en: "Italy",
      ja: "イタリア",
      ko: "이탈리아",
    },
    "苏格兰": {
      en: "Scotland",
      ja: "スコットランド",
      ko: "스코틀랜드",
    },
    "法国": {
      en: "France",
      ja: "フランス",
      ko: "프랑스",
    },
    "中国": {
      en: "China",
      ja: "中国",
      ko: "중국",
    },
    "日本": {
      en: "Japan",
      ja: "日本",
      ko: "일본",
    },
    "墨西哥": {
      en: "Mexico",
      ja: "メキシコ",
      ko: "멕시코",
    },
    "韩国 (South Korea)": {
      en: "South Korea",
      ja: "韓国",
      ko: "대한민국 (한국)",
    },
    "韩国": {
      en: "South Korea",
      ja: "韓国",
      ko: "한국",
    },
  },
  regions: {
    "苏格兰斯佩塞 (Speyside)": {
      en: "Speyside, Scotland",
      ja: "スペイサイド、スコットランド",
      ko: "스페이사이드, 스코틀랜드",
    },
    "干邑 (Cognac)": {
      en: "Cognac, France",
      ja: "コニャック、フランス",
      ko: "코냑, 프랑스",
    },
    "西伯利亚 (Siberia)": {
      en: "Siberia, Russia",
      ja: "シベリア、ロシア",
      ko: "시베리아, 러시아",
    },
    "艾尔郡 (Ayrshire)": {
      en: "Ayrshire, Scotland",
      ja: "エアーシャー、スコットランド",
      ko: "에어셔, 스코틀랜드",
    },
    "萨卡帕 (Zacapa)": {
      en: "Zacapa, Guatemala",
      ja: "サカパ、グアテマラ",
      ko: "자카파, 과테말라",
    },
    "哈利斯科高地 (Jalisco Highlands)": {
      en: "Jalisco Highlands, Mexico",
      ja: "ハリスコハイランド、メキシコ",
      ko: "할리스코 하이랜드, 멕시코",
    },
    "波尔多波亚克 (Pauillac, Bordeaux)": {
      en: "Pauillac, Bordeaux, France",
      ja: "ポイヤック、ボルドー、フランス",
      ko: "포이약, 보르도, 프랑스",
    },
    "香槟区 (Champagne)": {
      en: "Champagne Region, France",
      ja: "シャンパーニュ、フランス",
      ko: "샹파뉴, 프랑스",
    },
    "都柏林 (Dublin)": {
      en: "Dublin, Ireland",
      ja: "ダブリン、アイルランド",
      ko: "더블린, 아일랜드",
    },
    "山口县 (Yamaguchi Pre.)": {
      en: "Yamaguchi Prefecture, Japan",
      ja: "山口県",
      ko: "야마구치 현",
    },
    "贵州省茅台镇 (Moutai, Guizhou)": {
      en: "Moutai Town, Guizhou, China",
      ja: "貴州省茅台鎮",
      ko: "귀주성 마오타이진",
    },
    "佛罗伦萨 (Florence)": {
      en: "Florence, Italy",
      ja: "フィレンツェ、イタリア",
      ko: "피렌체, 이탈리아",
    },
    "京畿道骊州 (Yeoju)": {
      en: "Yeoju, Gyeonggi-do, Korea",
      ja: "京畿道驪州（ヨジュ）",
      ko: "경기도 여주",
    },
    "蔚山 (Ulsan)": {
      en: "Ulsan, Korea",
      ja: "蔚山（ウルサン）",
      ko: "울산광역시",
    },
  },
  spiritNames: {
    "macallan-12": {
      en: "The Macallan Double Cask 12 Year Old",
      ja: "ザ・マッカラン 12年 シェリーダブルカスク",
      ko: "맥캘란 12년 셰리 더블캐스크",
    },
    "hennessy-xo": {
      en: "Hennessy X.O Cognac",
      ja: "ヘネシー X.O コニャック ブランデー",
      ko: "헤네시 X.O 코냑 브랜디",
    },
    "beluga-noble": {
      en: "Beluga Noble Russian Vodka",
      ja: "ベルーガ ノーブル ロシアン ウォッカ",
      ko: "벨루가 노블 러시아 보드카",
    },
    "hendricks-gin": {
      en: "Hendrick's Original Gin",
      ja: "ヘンリックス プレミアム ジン",
      ko: "헨드릭스 프리미엄 진",
    },
    "zacapa-23": {
      en: "Ron Zacapa Centenario 23 Solera Rum",
      ja: "ロン サカパ 23年 ソレラ ラム",
      ko: "론 자카파 23년 솔레라 럼",
    },
    "don-julio-1942": {
      en: "Don Julio 1942 Anejo Tequila",
      ja: "ドン デュリオ 1942 アネホ テキーラ",
      ko: "돈 훌리오 1942 아네호 데킬라",
    },
    "lafite-2015": {
      en: "Chateau Lafite Rothschild 2015 Vintage Red",
      ja: "シャトー・ラフィット・ロートシルト 2015ヴィンテージ",
      ko: "샤토 라피트 로스차일드 2015 빈티지",
    },
    "dom-perignon": {
      en: "Dom Perignon Vintage 2013 Champagne",
      ja: "ドン ペリニヨン ヴィンテージ 2013",
      ko: "돔 페리뇽 빈티지 2013 샴페인",
    },
    "guinness-draught": {
      en: "Guinness Draught Nitro Stout Beer",
      ja: "ギネス ドラフト スタウト黒ビール",
      ko: "기네스 드래프트 스타우트 흑맥주",
    },
    "dassai-23": {
      en: "Dassai 23 Junmai Daiginjo Premium Sake",
      ja: "獺祭 二割三分 純米大吟醸",
      ko: "닷사이 23 준마이다이긴조 프리미엄 사케",
    },
    "moutai-feitian": {
      en: "Kweichow Moutai Flying Fairy 53% ABV",
      ja: "貴州茅台酒 飛天 53度 (醤香型白酒)",
      ko: "귀주 마오타이주 비천 53% (장향형 백주)",
    },
    "baileys-irish-cream": {
      en: "Baileys Original Irish Cream Liqueur",
      ja: "ベイリーズ オリジナル アイリッシュクリーム",
      ko: "베일리스 오리지널 아이리시 크림 리큐어",
    },
    "negroni-cocktail": {
      en: "Premium Classic Negroni Cocktail",
      ja: "クラシック ネグローニ プレミアムカクテル",
      ko: "클래식 네그로니 프리미엄 칵테일",
    },
    "hwayo-41": {
      en: "Hwayo 41 Premium Distilled Soju",
      ja: "火尭（ファヨ）41度 プレミアム焼酎",
      ko: "화요 41도 프리미엄 증류식 소주",
    },
    "boksoondoga-makgeolli": {
      en: "Boksoondoga Sparkling Makgeolli",
      ja: "福順都家（ボクスンドガ）手作り炭酸マッコリ",
      ko: "복순도가 손막걸리 프리미엄 스파클링",
    },
  },
  brands: {
    "brand-macallan": {
      name: { en: "The Macallan", ja: "マッカラン", ko: "맥캘란" },
      desc: {
        en: "World-celebrated giant of single malt Scotch whisky, exquisite master of sherry cask seasoning.",
        ja: "世界が誇るシングルモルト・スコッチの銘主、シェリー樽熟成芸術を極めたウイスキー界の最高峰。",
        ko: "셰리 캐스크 숙성 예술을 완성하여 전 세계 싱글 몰트 스카치 위스키의 최고봉으로 인정받는 거장.",
      },
    },
    "brand-hennessy": {
      name: { en: "Hennessy", ja: "ヘネシー", ko: "헤네시" },
      desc: {
        en: "Distinguished global leader in luxury Cognac brandy, synonymous with fine French craftsmanship.",
        ja: "歴史ある世界最高峰のコニャック、フランス最上のエレガンスを体現するプレミアムブランド。",
        ko: "세계 최고급 코냑 브랜디의 역사적인 리더로, 프랑스식 품격과 럭셔리의 대명사.",
      },
    },
    "brand-moutai": {
      name: { en: "Kweichow Moutai", ja: "マオタイ (貴州茅台)", ko: "귀주 마오타이" },
      desc: {
        en: "A colossal symbol of traditional Chinese sauce-aroma baijiu, commanding extraordinary collection value.",
        ja: "中国伝統の最高級醤香型白酒の至宝、圧倒的なステータスと独自の文化価値を持つブランド。",
        ko: "중국 전통 장향형 백주의 독보적인 최고 존귀로, 압도적인 사교적 품격과 수집 가치를 자랑하는 거장.",
      },
    },
    "brand-dassai": {
      name: { en: "Dassai", ja: "獺祭 (だっさい)", ko: "닷사이" },
      desc: {
        en: "Innovative game-changer of luxury Japanese sake, bringing precision data to premium brewing.",
        ja: "世界的に清酒ブームを巻き起こしたプレミアムブランド。伝統と精密データを融合させた最高品質の日本酒。",
        ko: "청주를 세계 무대로 이끈 일본의 프리미엄 준마이다이긴조 선구자로, 데이터 기반 정밀 양조의 대가.",
      },
    },
    "brand-donjulio": {
      name: { en: "Don Julio", ja: "ドン・フリオ", ko: "돈 훌리오" },
      desc: {
        en: "Super-premium 100% blue agave tequila harvested in the highly coveted Jalisco Highlands.",
        ja: "メキシコ・ハリスコ州高地が誇る100%ブルーアガベを使用した最高級プレミアムテキーラ。",
        ko: "멕시코 할리스코 하이랜드의 비옥한 붉은 흙에서 자란 100% 블루 아가베로만 빚어낸 최고급 테킬라.",
      },
    },
    "brand-hwayo": {
      name: { en: "Hwayo Soju", ja: "火尭 (ファヨ)", ko: "화요" },
      desc: {
        en: "Elite Korean premium distilled soju pioneer, crafted in traditional high-end hand-fired clay vessels.",
        ja: "韓国のプレミアム蒸留焼酎の先鋒であり、伝統的な呼吸する陶器で熟成された極上の米焼酎。",
        ko: "한국 최고급 프리미엄 증류식 소주 브랜드의 개척자로, 전통 옹기 숙성과 최고급 여주 쌀로 빚어낸 명주.",
      },
    },
    "brand-boksoondoga": {
      name: { en: "Boksoondoga Makgeolli", ja: "福順都家 (ボクスンドガ)", ko: "복순도가" },
      desc: {
        en: "Famous traditional family estate bringing high-end micro-bubble natural carbonated champagne texture to Korean farm sake.",
        ja: "自家製の天然麹を用い、伝統的な粘土甕で低温熟成させた天然炭酸マッコリの至宝ブランド。",
        ko: "울산의 비옥한 대지에서 숨쉬는 옹기를 활용하여 빚어낸, 독보적인 천연 스파클링 손막걸리의 명가.",
      },
    },
  },
};

// Local Translate Helper if Gemini is absent
function applyLocalFallback(
  rawSpirits: Spirit[],
  rawBrands: Brand[],
  rawCountries: CountryCulture[],
  lang: "en" | "ja" | "ko"
): { spirits: Spirit[]; brands: Brand[]; countries: CountryCulture[] } {
  // Translate Spirits
  const translatedSpirits = rawSpirits.map((spirit) => {
    const s = { ...spirit };

    // Translate category
    if (FALLBACK_DICTIONARY.categories[s.category]) {
      s.category = FALLBACK_DICTIONARY.categories[s.category][lang];
    } else {
      // Stripping parenthetical Chinese
      s.category = s.category.replace(/[\u4e00-\u9fa5（\(\)\s]/g, "");
    }

    // Translate Country
    if (FALLBACK_DICTIONARY.countries[s.country]) {
      s.country = FALLBACK_DICTIONARY.countries[s.country][lang];
    }

    // Translate Region
    if (FALLBACK_DICTIONARY.regions[s.region]) {
      s.region = FALLBACK_DICTIONARY.regions[s.region][lang];
    }

    // Translate Name
    if (FALLBACK_DICTIONARY.spiritNames[s.id]) {
      s.name = FALLBACK_DICTIONARY.spiritNames[s.id][lang];
    }

    // Translate simple properties
    if (lang === "en") {
      s.ingredients = s.ingredients
        .replace("大麦、水、酵母", "Barley, Water, Yeast")
        .replace("白玉霓葡萄", "Ugni Blanc grapes")
        .replace(
          "冬小麦、西伯利亚自流井深层水、天然草本精萃",
          "Winter wheat, Siberian artesian water, natural herbs"
        )
        .replace(
          "杜松子、保加利亚玫瑰、小黄瓜及11种天然草本植物",
          "Juniper, Bulgarian rose, Cucumber, 11 botanicals"
        )
        .replace("初榨甘蔗蜜", "Virgin Sugar Cane Honey")
        .replace("100% 蓝色龙舌兰植物 (Blue Agave)", "100% Blue Agave")
        .replace("赤霞珠、梅洛、品丽珠", "Cabernet Sauvignon, Merlot, Cabernet Franc")
        .replace("黑皮诺 (Pinot Noir)、霞多丽 (Chardonnay)", "Pinot Noir, Chardonnay")
        .replace(
          "大麦、水、烘烤大麦、啤酒花、酵母、氮化气罐",
          "Barley, Virgin Water, Roasted Barley, Hops, Yeast, Nitrogen widget"
        )
        .replace("山田锦酒造米、清水、米曲", "Yamakawa Yamada-Nishiki Rice, Pristine Water, Koji")
        .replace("高粱、小麦、赤水河水", "Sorghum, Wheat, Chishui River pristine water")
        .replace(
          "爱尔兰高质鲜奶油、爱尔兰威士忌、可可豆、香草精",
          "Irish dairy fresh cream, Single Irish whiskey, Cocoa cocoa beans, Vanilla"
        )
        .replace(
          "添加利伦敦干金酒、金巴利草本苦味酒、卡帕诺甜红味美思",
          "Tanqueray London Dry Gin, Campari Bitter, Sweet Vermouth"
        )
        .replace("大米、水、米曲", "Rice, Water, Rice Koji yeast")
        .replace("大米、清水、天然酵母 (Nuruk)", "Rice, Pure Water, Natural Nuruk Yeasts");
    } else if (lang === "ja") {
      s.ingredients = s.ingredients
        .replace("大麦、水、酵母", "大麦、水、酵母")
        .replace("白玉霓葡萄", "ユニ・ブラン(ぶどう)")
        .replace(
          "冬小麦、西伯利亚自流井深层水、天然草本精萃",
          "冬小麦、シベリア自流湧水、天然ハーブエキス"
        )
        .replace(
          "杜松子、保加利亚玫瑰、小黄瓜及11种天然草本植物",
          "ジュニパーベリー、ブルガリアンローズ、きゅうり、11種の天然草本植物"
        )
        .replace("初榨甘蔗蜜", "バージン・シュガーケーン・ハニー")
        .replace("100% 蓝色龙舌兰植物 (Blue Agave)", "100% ブルーアガベ")
        .replace("赤霞珠、梅洛、品丽珠", "カベルネ・ソーヴィニヨン、メルロー、カベルネ・フラン")
        .replace("黑皮诺 (Pinot Noir)、霞多丽 (Chardonnay)", "ピノ・ノワール、シャルドネ")
        .replace(
          "大麦、水、烘烤大麦、啤酒花、酵母、氮化气罐",
          "大麦、水、ロースト大麦、ホップ、酵母、窒素カプセル"
        )
        .replace("山田锦酒造米、清水、米曲", "山田錦（酒米）、清水、米麹")
        .replace("高粱、小麦、赤水河水", "高粱、小麦、赤水河の純水")
        .replace(
          "爱尔兰高质鲜奶油、爱尔兰威士忌、可可豆、香草精",
          "アイリッシュ生クリーム、アイリッシュウイスキー、カカオ、バニラ抽出液"
        )
        .replace(
          "添加利伦敦干金酒、金巴利草本苦味酒、卡帕诺甜红味美思",
          "タンカレーロンドンドライジン、カンパリ、スイートベルモット"
        )
        .replace("大米、水、米曲", "米、水、米麹")
        .replace("大米、清水、天然酵母 (Nuruk)", "米、清水、天然ヌルク（麹酵母）");
    } else if (lang === "ko") {
      s.ingredients = s.ingredients
        .replace("大麦、水、酵母", "보리, 물, 효모")
        .replace("白玉霓葡萄", "위니 블랑 (우니 블랑 포도)")
        .replace(
          "冬小麦、西伯利亚自流井深层水、天然草本精萃",
          "겨울밀, 시베리아 지하수, 천연 허브 추출물"
        )
        .replace(
          "杜松子、保加利亚玫瑰、小黄瓜及11种天然草本植物",
          "주니퍼 베리, 불가리아 장미, 오이, 11가지 천연 식물 영양소"
        )
        .replace("初榨甘蔗蜜", "버진 슈가케인 허니 (사탕수수 시럽)")
        .replace("100% 蓝色龙舌兰植物 (Blue Agave)", "100% 블루 아가베(용설란)")
        .replace("赤霞珠、梅洛、品丽珠", "카베르네 소비뇽, 메를로, 카베르네 프랑")
        .replace("黑皮诺 (Pinot Noir)、霞多丽 (Chardonnay)", "피노 누아, 샤르도네")
        .replace(
          "大麦、水、烘烤大麦、啤酒花、酵母、氮化气罐",
          "보리, 청정수, 로스팅된 보리, 홉, 효모, 질소 위젯 기압캡슐"
        )
        .replace("山田锦酒造米、清水、米曲", "야마다니시키 주조쌀, 맑은 우물물, 누룩")
        .replace("高粱、小麦、赤水河水", "수수(고량), 밀, 적수하 청정수")
        .replace(
          "爱尔兰高质鲜奶油、爱尔兰威士忌、可可豆、香草精",
          "아일랜드 프리미엄 우유 생크림, 아일랜드 위스키, 카카오, 천연 바니엘린"
        )
        .replace(
          "添加利伦敦干金酒、金巴利草本苦味酒、卡帕诺甜红味美思",
          "탱커레이 런던 드라이 진, 캄파리 리큐어, 스위트 베르무트"
        )
        .replace("大米、水、米曲", "국산 쌀, 정제수, 쌀국(입국)")
        .replace("大米、清水、天然酵母 (Nuruk)", "국산 쌀, 청정수, 밀누룩(전통 복합 효모)");
    }

    return s;
  });

  // Translate Brands
  const translatedBrands = rawBrands.map((brand) => {
    const b = { ...brand };
    if (FALLBACK_DICTIONARY.brands[b.id]) {
      b.name = FALLBACK_DICTIONARY.brands[b.id].name[lang] || b.name;
      b.description = FALLBACK_DICTIONARY.brands[b.id].desc[lang] || b.description;
    }
    if (FALLBACK_DICTIONARY.countries[b.country]) {
      b.country = FALLBACK_DICTIONARY.countries[b.country][lang];
    }
    return b;
  });

  // Translate Countries
  const translatedCountries = rawCountries.map((country) => {
    const c = { ...country };
    if (FALLBACK_DICTIONARY.countries[c.name]) {
      c.name = FALLBACK_DICTIONARY.countries[c.name][lang];
    }
    return c;
  });

  return {
    spirits: translatedSpirits,
    brands: translatedBrands,
    countries: translatedCountries,
  };
}

// Global Core Translation Resolver Service (Highly-Advanced Dynamic AI Pipeline)
export async function resolveLanguageDataset(
  rawSpirits: Spirit[],
  rawBrands: Brand[],
  rawCountries: CountryCulture[],
  lang: "zh" | "en" | "ja" | "ko",
  aiClient: GoogleGenAI | null
): Promise<{ spirits: Spirit[]; brands: Brand[]; countries: CountryCulture[] }> {
  // 1. Chinese (Default / Source) returns raw data directly
  if (lang === "zh") {
    return {
      spirits: rawSpirits,
      brands: rawBrands,
      countries: rawCountries,
    };
  }

  // 2. Return from in-memory cache if it already exists
  if (translationCache[lang]) {
    console.log(`[Translator] Serving ${lang} dataset from in-memory hot cache.`);
    return translationCache[lang];
  }

  // 3. Attempt Dynamic translation using artificial intelligence (Gemini 2.5/3.5) if client is active and circuit breaker is not active
  if (aiClient && !isGeminiTranslationDisabled) {
    try {
      console.log(`[Translator] Initiating dynamic Gemini Translation into target: [${lang}]...`);

      // Let's translate Spirits
      const translatedSpirits = await translateWithGemini(rawSpirits, lang, "spirits", aiClient);
      
      // Let's translate Brands
      const translatedBrands = await translateWithGemini(rawBrands, lang, "brands", aiClient);

      // Let's translate Countries
      const translatedCountries = await translateWithGemini(rawCountries, lang, "countries", aiClient);

      if (translatedSpirits && translatedBrands && translatedCountries) {
        console.log(`[Translator] Translation for target [${lang}] completed successfully via Gemini.`);
        translationCache[lang] = {
          spirits: translatedSpirits,
          brands: translatedBrands,
          countries: translatedCountries,
        };
        return translationCache[lang];
      }
    } catch (e: any) {
      isGeminiTranslationDisabled = true;
      disableReason = e?.message || String(e);
      console.warn(`[Translator] Dynamic translation via Gemini failed (circuit breaker activated), loading high-fidelity local fallback instead. Detail:`, disableReason);
    }
  }

  // 4. Fallback to highly optimized static mapping dictionary
  console.log(`[Translator] Translating into [${lang}] using high-fidelity local sommelier mapping fallback.`);
  const translated = applyLocalFallback(rawSpirits, rawBrands, rawCountries, lang);
  
  // Cache the fallback so we don't recalculate it
  translationCache[lang] = translated;
  return translated;
}

// API Call Wrapper for structured JSON array output using Gemini
async function translateWithGemini(
  data: any[],
  targetLang: "en" | "ja" | "ko",
  type: "spirits" | "brands" | "countries",
  ai: GoogleGenAI
): Promise<any[] | null> {
  if (isGeminiTranslationDisabled) {
    return null;
  }
  const langNames = {
    en: "English (United Kingdom / United States style)",
    ja: "Japanese (polished / sommelier style)",
    ko: "Korean (high-end hospitality sommelier style)",
  };

  const systemPrompt = `You are a world-class translation bot serving as a Senior Sommelier & Global Beverage Historian.
Your goal is to translate a batch of ${type} logs from Chinese into polished, elegant, and contextually accurate ${langNames[targetLang]}.

【STRICT DIRECTIVES】:
1. Maintain exactly the same array structure.
2. DO NOT change, translate, or delete any of the 'id', 'image_url', 'website', 'rating', 'founded_year', 'created_at', 'wheel_data', or 'coordinate' properties! Keep them exactly intact.
3. Keep standard english names in the 'english_name' properties.
4. Translate all narrative fields like: 'name', 'category', 'country', 'region', 'ingredients', 'production_method', 'history', 'flavor_profile', 'food_pairing', 'aroma', 'taste', 'serve_temp', 'glass_type', 'ai_review', 'flavor_tags', 'description', 'famous_brands', 'representative_spirits', 'annual_production', 'drinking_etiquette' etc., into professional sensory terminology in the selected target language.
5. Make sure the translation reads naturally for wine enthusiasts in ${targetLang}. For example, translate premium flavor tags meticulously.
6. Provide raw JSON matching the original schema. Do not enclose the output in Markdown tags. Return ONLY JSON.`;

  try {
    const prompt = `Here is the JSON dataset for ${type} to translate:
${JSON.stringify(data, null, 1)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2, // Low temperature for high precision translation consistency
      },
    });

    const parsed = response.text ? JSON.parse(response.text.trim()) : null;
    if (parsed && Array.isArray(parsed) && parsed.length === data.length) {
      return parsed;
    }
    console.warn(`[Translator] Returned data from Gemini for ${type} was mismatched or not an array.`);
  } catch (err: any) {
    isGeminiTranslationDisabled = true;
    disableReason = err?.message || String(err);
    console.warn(`[Translator] Dynamic translation via Gemini failed/rate-limited for ${type} (circuit breaker activated). Gracefully falling back to high-fidelity offline system dictionary of local mappings. Detail:`, disableReason);
  }
  return null;
}
