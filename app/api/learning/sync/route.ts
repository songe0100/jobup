import { NextResponse } from "next/server";

type SyncBody = { attempts?: Array<Record<string, unknown>> };

// Supabase 동기화는 서버에서만 수행합니다. 환경변수가 없으면 localStorage 데모 모드로 동작합니다.
export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const userId = process.env.SUPABASE_DEMO_USER_ID;
  if (!url || !serviceKey || !userId) return NextResponse.json({ demo: true, synced: false });
  const body = await request.json() as SyncBody;
  const attempts = (body.attempts || []).map((attempt) => ({ local_id: attempt.id, user_id: userId, question_id: attempt.questionId, area: attempt.areaId, question_type: attempt.questionType, difficulty: attempt.difficulty, question_content: { title: attempt.questionTitle, concept: attempt.concept }, submitted_answer: attempt.submittedAnswer, correct_answer: attempt.correctAnswer, is_correct: attempt.isCorrect, duration_seconds: attempt.durationSeconds, feedback_stage: attempt.feedbackStage, hint_count: attempt.hintCount, retry_count: attempt.retryCount, attempt_kind: attempt.attemptKind, submitted_at: attempt.submittedAt }));
  const response = await fetch(`${url}/rest/v1/learning_attempts?on_conflict=local_id`, { method: "POST", headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" }, body: JSON.stringify(attempts) });
  if (!response.ok) return NextResponse.json({ error: "Supabase 학습 기록 동기화에 실패했습니다." }, { status: 502 });
  return NextResponse.json({ demo: false, synced: true, count: attempts.length });
}
