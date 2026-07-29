import { NextResponse } from "next/server";

// Gemini 호출은 이 서버 라우트에서만 수행합니다. 클라이언트에는 GEMINI_API_KEY를 전달하지 않습니다.
export async function POST(request: Request) {
  const body = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ demo: true, message: "데모 모드에서는 내장 문제와 모의 피드백을 사용합니다." });
  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: body.prompt }] }] }) });
  if (!response.ok) return NextResponse.json({ error: "Gemini 요청에 실패했습니다." }, { status: 502 });
  return NextResponse.json(await response.json());
}
