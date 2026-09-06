export type LearnerLevel = "beginner" | "intermediate" | "advanced";

export type AttemptKind = "diagnostic" | "practice" | "supplemental";
export type FeedbackStage = "result_only" | "hint_1" | "hint_2" | "retry" | "revealed";

export type LearningAttempt = {
  id: string;
  userId: string;
  sessionId?: string;
  questionId: string;
  areaId: string;
  attemptKind: AttemptKind;
  questionTitle: string;
  questionType: string;
  difficulty: string;
  concept: string;
  submittedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  durationSeconds: number;
  feedbackStage: FeedbackStage;
  hintCount: number;
  retryCount: number;
  sourceAttemptId?: string;
  submittedAt: string;
};

export type WeakConcept = {
  areaId: string;
  concept: string;
  attemptCount: number;
  wrongCount: number;
  accuracy: number;
  recommendedLevel: LearnerLevel;
  updatedAt: string;
};

export type LearningSession = {
  id: string;
  userId: string;
  areaId: string;
  sessionType: AttemptKind;
  status: "started" | "completed";
  attemptIds: string[];
  startedAt: string;
  completedAt?: string;
};

export type LearningState = {
  version: 1;
  attempts: LearningAttempt[];
  weakConcepts: WeakConcept[];
  sessions: LearningSession[];
  wrongQuestionIds: string[];
  supplementalQuestionIds: string[];
  lastAreaId?: string;
  updatedAt: string;
};

export type HistoryRecord = {
  id: string;
  areaId: string;
  label: string;
  title: string;
  type: string;
  level: string;
  correct: boolean;
  duration: number;
  timestamp: string;
  dateKey: string;
};
