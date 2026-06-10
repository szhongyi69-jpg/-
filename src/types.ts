export interface Spirit {
  id: string;
  name: string;
  english_name: string;
  category: string;
  country: string;
  region: string;
  abv: string; // Alcohol By Volume (e.g. 40%)
  ingredients: string;
  production_method: string;
  history: string;
  flavor_profile: string; // Summary
  food_pairing: string;
  image_url: string;
  brand: string;
  rating: number; // 1-5 stars
  created_at: string;

  // Added fields for the elegant details card / flavor profiles
  aroma: string;        // 香气特征
  taste: string;        // 口感描述
  serve_temp: string;   // 最佳饮用温度
  glass_type: string;   // 推荐酒杯
  ai_review: string;    // AI 专家点评
  flavor_tags: string[]; // e.g. ["烟熏", "泥煤", "香草"]
  wheel_data: {         // 风味轮雷达图数据
    sweet: number;      // 甜度 [0-100]
    acidicOrBitter: number; // 酸度/苦度
    body: number;       // 酒体
    floral: number;     // 花草香气
    spicyOrPeaty: number; // 辛辣/泥煤
    fruity: number;     // 果香
  };
}

export interface Brand {
  id: string;
  name: string;
  english_name: string;
  logo: string; // Beautiful initials or stylized icon path/placeholder
  founded_year: number;
  country: string;
  website: string;
  products: string[];
  history: string;
  description: string;
}

export interface CountryCulture {
  id: string;
  name: string;
  english_name: string;
  description: string;
  representative_spirits: string[];
  famous_brands: string[];
  annual_production: string;
  history: string;
  drinking_etiquette: string; // 饮用礼仪
  coordinate: { x: number; y: number }; // Relative SVG map coordinate (0-100 scale) for map dots
}

export interface AIResponse {
  answer: string;
  suggestedProducts?: string[];
}
