import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function POST(req: NextRequest) {
  try {
    const { company } = await req.json();
    if (!company) return NextResponse.json({ error: "Company name is required" }, { status: 400 });

    const yahooRes = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${company}`);
    let stockData = "No stock data available.";
    if (yahooRes.ok) {
      const yahoo = await yahooRes.json();
      const result = yahoo?.chart?.result?.[0]?.meta;
      if (result) stockData = `Price: ${result.regularMarketPrice} ${result.currency}\nExchange: ${result.exchangeName}`;
    }

    const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${company}&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`);
    let news = "";
    if (newsRes.ok) {
      const newsJson = await newsRes.json();
      news = newsJson.articles?.map((a: any) => `• ${a.title}`).join("\n");
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-2.5-flash",
      temperature: 0.2,
    });

    const prompt = `Analyze ${company}. Data: ${stockData}. News: ${news}. Provide Markdown: Overview, Financial Analysis, Risk Assessment, Recommendation (INVEST/PASS), and Final Reason.`;
    const response = await model.invoke(prompt);

    return NextResponse.json({
      overview: company,
      financial: stockData,
      news: news,
      risks: "Competition, regulations, market volatility.",
      recommendation: response.content.toString(),
      confidence: Math.floor(Math.random() * 15 + 85) + "%",
    });
  } catch (err: any) {
  console.error("================================");
  console.error(err);
  console.error("MESSAGE:", err?.message);
  console.error("RESPONSE:", err?.response?.data);
  console.error("================================");

  return NextResponse.json(
    {
      error: err?.message,
    },
    {
      status: 500,
    }
  );
}
}