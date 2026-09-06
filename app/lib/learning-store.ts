import type { HistoryRecord } from "./learning-types";
import type { LearningAttempt, LearningState, LearnerLevel } from "./learning-types";

const STATE_KEY = "job-cert-learning-state";
const HISTORY_KEY = "job-cert-history";
const WRONG_KEY = "job-cert-wrong-answers";

function levelFor(accuracy: number, averageSeconds: number): LearnerLevel {
  if (accuracy < 0.5 || averageSeconds > 90) return "beginner";
  if (accuracy < 0.75 || averageSeconds > 60) return "intermediate";
  return "advanced";
}

export function createEmptyLearningState(): LearningState {
  return { version: 1, attempts: [], weakConcepts: [], sessions: [], wrongQuestionIds: [], supplementalQuestionIds: [], updatedAt: new Date().toISOString() };
}

export function loadLearningState(): LearningState {
  if (typeof window === "undefined") return createEmptyLearningState();
  try {
    const stored = window.localStorage.getItem(STATE_KEY);
    if (stored) return { ...createEmptyLearningState(), ...JSON.parse(stored), version: 1 };
  } catch { /* Continue with the legacy migration below. */ }

  const state = createEmptyLearningState();
  const history: HistoryRecord[] = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || "[]");
  state.attempts = history.map((record) => ({
    id: record.id,
    userId: "local-demo-user",
    questionId: record.id.split("-")[0],
    areaId: record.areaId,
    attemptKind: "practice",
    questionTitle: record.title,
    questionType: record.type,
    difficulty: record.level,
    concept: "미분류 개념",
    submittedAnswer: "",
    correctAnswer: "",
    isCorrect: record.correct,
    durationSeconds: record.duration,
    feedbackStage: "revealed",
    hintCount: 0,
    retryCount: 0,
    submittedAt: record.dateKey,
  } satisfies LearningAttempt));
  state.wrongQuestionIds = JSON.parse(window.localStorage.getItem(WRONG_KEY) || "[]");
  rebuildWeakConcepts(state);
  persistLearningState(state);
  return state;
}

export function persistLearningState(state: LearningState) {
  if (typeof window !== "undefined") window.localStorage.setItem(STATE_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
}

export function appendAttempt(state: LearningState, attempt: LearningAttempt): LearningState {
  const next = { ...state, attempts: [attempt, ...state.attempts].slice(0, 500), lastAreaId: attempt.areaId };
  rebuildWeakConcepts(next);
  persistLearningState(next);
  return next;
}

function rebuildWeakConcepts(state: LearningState) {
  const groups = new Map<string, LearningAttempt[]>();
  for (const attempt of state.attempts) {
    const key = `${attempt.areaId}:${attempt.concept}`;
    groups.set(key, [...(groups.get(key) || []), attempt]);
  }
  state.weakConcepts = [...groups.values()].map((attempts) => {
    const first = attempts[0];
    const correct = attempts.filter((attempt) => attempt.isCorrect).length;
    const average = attempts.reduce((sum, attempt) => sum + attempt.durationSeconds, 0) / attempts.length;
    return { areaId: first.areaId, concept: first.concept, attemptCount: attempts.length, wrongCount: attempts.length - correct, accuracy: correct / attempts.length, recommendedLevel: levelFor(correct / attempts.length, average), updatedAt: new Date().toISOString() };
  });
}
