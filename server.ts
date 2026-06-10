import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { SPIRITS, BRANDS, COUNTRIES } from "./src/data/spiritsData";
import { resolveLanguageDataset } from "./src/data/translator";

// Load environment variables in local development
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, running in AI simulation mode.");
}

// ----------------------------------------------------
// REST API PROXY & ENDPOINTS
// ----------------------------------------------------

// 1. Get all spirits (with search and filters)
app.get("/api/spirits", async (req, res) => {
  const { query, category, country, lang = "zh" } = req.query;
  const targetLang = (String(lang) || "zh").toLowerCase();

  const dataset = await resolveLanguageDataset(
    SPIRITS,
    BRANDS,
    COUNTRIES,
    targetLang as any,
    ai
  );

  let results = [...dataset.spirits];

  if (category && category !== "全部") {
    results = results.filter((s) => s.category.includes(String(category)));
  }

  if (country && country !== "全部") {
    results = results.filter((s) => s.country.includes(String(country)));
  }

  if (query) {
    const q = String(query).toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.english_name.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.history.toLowerCase().includes(q) ||
        s.flavor_profile.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

// 2. Get all brands
app.get("/api/brands", async (req, res) => {
  const { lang = "zh" } = req.query;
  const targetLang = (String(lang) || "zh").toLowerCase();

  const dataset = await resolveLanguageDataset(
    SPIRITS,
    BRANDS,
    COUNTRIES,
    targetLang as any,
    ai
  );

  res.json(dataset.brands);
});

// 3. Get country culture list
app.get("/api/countries", async (req, res) => {
  const { lang = "zh" } = req.query;
  const targetLang = (String(lang) || "zh").toLowerCase();

  const dataset = await resolveLanguageDataset(
    SPIRITS,
    BRANDS,
    COUNTRIES,
    targetLang as any,
    ai
  );

  res.json(dataset.countries);
});

// 4. AI Query Assistant with RAG knowledge-base context
app.post("/api/ai-query", async (req, res) => {
  const { query, history = [] } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  // Pre-prepare structured knowledge context (RAG)
  const knowledgeContext = SPIRITS.map(
    (s) =>
      `酒品名称: ${s.name} (${s.english_name}), 分类: ${s.category}, 国家: ${s.country}, 产区: ${s.region}, 度数: ${s.abv}, 配料: ${s.ingredients}, 风味描述: ${s.flavor_profile}, 特色香气: ${s.aroma}, 口感: ${s.taste}, 陈年工艺: ${s.production_method}, 饮用温度: ${s.serve_temp}, 推荐杯型: ${s.glass_type}, AI专家点评: ${s.ai_review}.`
  ).join("\n\n");

  const countryContext = COUNTRIES.map(
    (c) =>
      `国家: ${c.name} (${c.english_name}), 酒文化简介: ${c.description}, 代表性酒款: ${c.representative_spirits.join(
        ", "
      )}, 著名品牌: ${c.famous_brands.join(", ")}, 年产量: ${c.annual_production}, 酒文化历史: ${c.history}, 饮酒礼仪: ${c.drinking_etiquette}.`
  ).join("\n\n");

  const systemPrompt = `你是一位世界级的顶级洋酒百科、高级侍酒师 (Sommelier) 与全球酒文化专家，你的名字叫 "Global Spirits Explorer 智能酒学助理"。
你将基于以下精选的国家酒文化与酒款知识库，为用户提供极其专业、高雅、引人入胜多维度回答。

【世界各酒品详细知识库】：
${knowledgeContext}

【各国酒文化与礼仪指南】：
${countryContext}

【回复准则】：
1. 始终使用优雅、专业、极具文化和历史感的语言回答（默认使用中文回复，除非用户用英文或日文提问）。
2. 如果用户让你推荐酒类、询问搭配、对比产品（如威士忌、龙舌兰、白兰地、清酒或中国白酒等），请主动结合上面的知识库并做出专业的品鉴、风味轮和搭配对比。
3. 即使问题超出了特定知识库，也请展现你作为博学侍酒师的尊贵水准，输出极富文采、脉络清晰的建议。
4. 回复中可以使用 Markdown 排版使回答更易阅读、美观。
5. 每次推荐具体酒品时，请在回答正文末尾附带推荐的酒品 ID 列表，格式为 "🎯 [RECOMMEND_IDS: macallan-12, hennessy-xo]"（若无特定推荐则无需提供，ID 必须与上面数据中某一 id 严格吻合，这能帮助我们前端实现卡片渲染交互）。
6. 请避免提及你所依赖的这个技术系统详情，也无需暴露你正在使用上述文字知识库，扮演好人类顶级侍酒师的身份。`;

  // Dynamic content structure following the new SDK Guidelines
  const contents = [];

  // Convert client conversation history to Gemini structure if provided
  if (history && history.length > 0) {
    for (const h of history) {
      contents.push({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      });
    }
  }

  // Push final current question
  contents.push({
    role: "user",
    parts: [{ text: query }],
  });

  // If AI Client is alive, make actual API call
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.75,
        },
      });

      const text = response.text || "无法获取AI的回答。请稍后再试。";
      return res.json({ answer: text });
    } catch (err: any) {
      console.error("Gemini API call failed:", err);
      return res.status(500).json({
        error: "AI API call failed",
        details: err?.message || err,
        fallback: true,
      });
    }
  } else {
    // Elegant simulated fallback Sommelier with RAG logic
    console.log("Simulating AI Sommelier reply...");
    let reply = "";
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("威士忌") || lowerQuery.includes("whisky")) {
      reply = `### 🌟 尊贵的酒学探索者，您好：

针对您对于**威士忌 (Whisky)** 的探索偏好，作为您的私人侍酒师，我向您隆重倾情推荐我们的主打名宿：**麦卡伦 12年雪莉双桶威士忌 (The Macallan Double Cask 12 Years Old)**。

#### 🥃 为什么它是新手的完美起点？
1. **经典苏格兰斯佩塞雪莉桶风骨**：麦卡伦对西班牙精选赫雷斯雪莉橡木桶有着业界近乎狂热的偏执执念。本款融合了美国雪莉橡木桶和欧洲雪莉橡木桶。
2. **迷人的风味层次**：入口是柔和的奶油香草与糖渍太妃糖苹果香，中段过渡到标志性的干木质与暖生姜辛香。
3. **高颜风味雷达**：甜美指数卓越 (75)，酒体适中 (70)，对新手极其友好，温润回甘。

#### 🎩 侍酒师品饮建议：
- **最佳温度**：15°C - 18°C
- **专业玻璃器皿**：格兰凯恩闻香杯 (Glencairn Glass)
- **酒水礼仪**：先纯饮。若是想释放隐藏在酒脂中的复杂酯香，可以用滴管滴入 **2-3滴常温矿泉水**。您将惊喜地发现，它的红浆果、焦糖以及淡淡的黑巧克力香甜被瞬间“唤醒”绽放。

当然，除了斯佩塞，如果您未来想挑战更为硬核和狂野的流派，苏格兰**艾雷岛 (Islay)** 的泥煤与生蚝海盐交织风味，将是惊艳灵魂的下一站。

🎯 [RECOMMEND_IDS: macallan-12]`;
    } else if (lowerQuery.includes("白兰地") || lowerQuery.includes("brandy") || lowerQuery.includes("干邑")) {
      reply = `### 🍷 尊贵的品鉴家，欢迎探索生命之水的艺术：

白兰地，尤其是由高品质葡萄重重蒸馏出的**法式干邑 (Cognac)**，无疑是欧洲奢华陈酿艺术的巅峰。

我向您极力推崇：**轩尼诗 X.O 干邑白兰地 (Hennessy X.O Cognac)**。

#### ⚜️ 轩尼诗X.O的非凡底蕴：
* **源远流长**：1870年由莫里斯·轩尼诗开辟，以逾百种高贵陈酿长达30载的“生命之水”调配而成，酒精度高达40度但口感却柔丝入扣。
* **风味特色**：呈现极致复杂的蜜饯水果（如干蜜橙、无花果）、老皮革、黑巧克力与浓郁百年法国利穆赞橡木桶带来的高浓木质单宁。
* **餐酒哲学**：由于其酒体沉稳而大气盎然，非常适合搭配**香煎鹅肝**或**陈年帕玛森干酪**，奶香的醇厚将激活极其迷人的蜜橙可可风味。

#### 🍷 最佳饮用仪范：
常温 18°C - 20°C，注入经典的**郁金香干邑杯**。用您温暖的掌心轻轻兜住杯肚，使掌温徐徐传递到酒液，您会发现香气随温度升腾，愈显幽深。

🎯 [RECOMMEND_IDS: hennessy-xo]`;
    } else if (lowerQuery.includes("清酒") || lowerQuery.includes("sake") || lowerQuery.includes("獭祭")) {
      reply = `### 🌸 欢迎品尝东方清冷而雅致的一缕酒香：

日本清酒 (Sake) 是一门关于大米研磨度与冰爽山泉发酵的自然诗篇。

我推荐您细品：**獭祭 二割三分 纯米大吟酿 (Dassai 23 Junmai Daiginjo Sake)**。

#### 🌾 顶级大吟酿的奥妙：
* **精米步合23%的工匠伟举**：将顶级山田锦米磨掉了77%，只留纯净的淀粉芯进行低温发酵，使酒液犹如山间融雪般清甜高贵。
* **曼妙风味轮**：带有饱满清甜的白桃、哈密瓜香气与清丽的水仙花芬芳（花果系高达90）。
* **餐酒契合**：完美适配顶级**海胆刺身**或新鲜**甜牡丹虾**。

#### 🍶 饮酒礼仪提示：
在东和文化中，传统清酒席间绝不建议“自斟”，一定要**互相斟酒**，双手略微悬空端杯接纳，这象征着和谐、敬慕与至诚的客道礼数。

🎯 [RECOMMEND_IDS: dassai-23]`;
    } else if (lowerQuery.includes("白酒") || lowerQuery.includes("茅台") || lowerQuery.includes("moutai") || lowerQuery.includes("传统")) {
      reply = `### 🍶 东方神州谷物酿造之大成——贵州茅台的顶级酱香：

中国传统白酒，尤其是以**贵州茅台 (Kweichow Moutai)** 为代表的酱香至尊，是东方固态发酵历史上的奇迹。

#### 🌀 飞天茅台53%的独特奥秘：
- **‘12987’古法天工流程**：长达一年的匠心工艺，历经两轮投料、九次蒸煮、八次高温发酵与七轮取酒，并在特质陶坛中静置陈酿五年以上。
- **幽雅酱香与空杯留香**：入口饱满醇厚，具有烘焙芝麻、酱曲、坚果与热谷物的磅礴香气，杯子隔夜仍余香缭绕。
- **餐配美学**：能极好地解北京烤鸭、东坡肉的油腻，与之交织出浓厚绵甜的味蕾风暴。

#### 🥂 饮用礼仪指南：
敬酒讲究“尊卑长幼有序，举杯成双成敬”。建议使用10ml白酒水晶杯，在常温下小口慢咂，用唇舌让液体充分雾化，方能最大程度感受白酒独特的酯香深度。

🎯 [RECOMMEND_IDS: moutai-feitian]`;
    } else {
      reply = `### 🌟 欢迎来到全球酒类探索者的智能空间：

我是您的专属高级侍酒师助理。虽然由于网络配置或运行环境，云端 Gemini 的实时链路处于离线休眠中，但我已经将**全球酒类精选知识库**深度整合在本地系统中！

我可以用最专业的品鉴知识、酒文化历史以及饮酒器皿指南为您服务。

#### 🗺️ 请问您今天想探索哪个酒类国度或品种？
* 🥃 **威士忌 (Whisky)** —— 苏格兰的坚毅泥煤与斯佩塞雪莉双桶 (如：麦卡伦 12年)
* 🍷 **干邑白兰地 (Cognac)** —— 轩尼诗X.O的高奢熟成美学
* 🌸 **日本清酒 (Sake)** —— 山口县獭祭二割三分的花果纯米大吟酿
* 🍶 **东方传统白酒 (Baijiu)** —— 飞天茅台的陶坛五年陈年古法
* 🍹 **金酒、龙舌兰、朗姆、经典鸡尾酒** —— 墨西哥的唐·胡里奥1942，英伦的亨利爵士，或是调酒之王内格罗尼！

*您可以直接问我：‘推荐一款适合送礼的威士忌’、‘如何品鉴日本清酒’或‘龙舌兰有什么特点’，我将为您送上最详细的侍酒师长文解答！*

🎯 [RECOMMEND_IDS: macallan-12, hennessy-xo, dassai-23, moutai-feitian]`;
    }

    // Wrap in response format
    setTimeout(() => {
      res.json({
        answer: reply,
        simulated: true,
      });
    }, 450);
  }
});


// ----------------------------------------------------
// VITE DEV SERVER / PRODUCTION STATICS MIDDLEWARE
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Dev Middleware for Hot Development Module...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Serving static files from production location: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Global Spirits Explorer running on port ${PORT}`);
  });
}

startServer();
