import { GoogleGenerativeAI } from "@google/generative-ai";

interface GenerateParams {
  bookName: string;
  author?: string;
  experience?: string;
  mode: "full" | "partial";
}

export const generateBookShare = async ({
  bookName,
  author,
  experience,
  mode,
}: GenerateParams): Promise<string> => {
  const rawApiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  const apiKey = rawApiKey?.trim().replace(/^['"]|['"]$/g, '');

  if (apiKey) {
    const masked =
      apiKey.length <= 8 ? `len=${apiKey.length}` : `${apiKey.slice(0, 4)}...${apiKey.slice(-4)} (len=${apiKey.length})`;
    console.log(`[gemini] apiKey ${masked}`);
  }

  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set in environment variables.");
    throw new Error("API Key is missing.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let prompt = `你是一个热爱阅读的普通读者，正在分享你的真实读书感悟。你的风格是真诚、感性、自然的，像是在给好朋友安利这本书，或者发一条走心的朋友圈/小红书。请绝对避免教科书式的总结或生硬的翻译腔（例如“首先、其次、总之”、“通过这本书我学到了”等）。

书籍信息：
- 书名：《${bookName}》
- 作者：${author || "未知"}

用户提供的个人经历/感悟：
${experience ? experience : "（用户未提供，请自行结合书籍内容发挥）"}

分享模式：${mode === "full" ? "全书分享" : "部分分享"}

生成要求：
1. **去 AI 味儿**：多用短句、感叹词，语气要有人味儿。可以使用一些口语化的表达（比如“真的绝了”、“谁懂啊”、“太扎心了”），但不要过度堆砌网络用语，保持文字的质感。
2. **内容真实**：必须基于《${bookName}》的真实内容，不要胡编乱造。如果不知道这本书的内容，请诚实地回复“抱歉，我暂时还没读过这本书，无法生成分享”。
`;

  if (mode === "partial" && experience) {
    prompt += `
3. **精准引用**：既然是“部分分享”且有用户经历，请重点挖掘书中与用户经历最共鸣的那个点。**必须在文案中明确指出引用了书中的哪个情节、观点或大致章节**（例如：“这让我想到书里写到XX的那一段...”或“就像作者在第X章里说的...”），让分享看起来有理有据。
`;
  } else if (mode === "full") {
    prompt += `
3. **整体安利**：侧重于这本书带来的整体震撼、治愈或启发。可以聊聊这本书适合什么样的人读，或者在什么心境下读最好。
`;
  }

  prompt += `
请直接生成分享文案，不需要任何标题或前言后语。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    const err = error as {
      name?: string;
      message?: string;
      cause?: { code?: unknown; errno?: unknown; syscall?: unknown; hostname?: unknown } | unknown;
    };
    const cause =
      err?.cause && typeof err.cause === 'object'
        ? {
            code: (err.cause as { code?: unknown }).code,
            errno: (err.cause as { errno?: unknown }).errno,
            syscall: (err.cause as { syscall?: unknown }).syscall,
            hostname: (err.cause as { hostname?: unknown }).hostname,
          }
        : err?.cause;
    console.error("Gemini API Error:", {
      name: err?.name,
      message: err?.message,
      cause,
    });
    throw new Error(err?.message || "Failed to generate content from Gemini.");
  }
};
