type SavedQuestion = { id: string; area: string; title: string; concept: string };

const areaMeta: Record<string, { label: string; color: string }> = {
  korean: { label: "의사소통 국어", color: "coral" },
  english: { label: "의사소통 영어", color: "blue" },
  math: { label: "수리활용 영역", color: "mint" },
  problem: { label: "문제해결 영역", color: "purple" },
  adapt: { label: "직무적응 영역", color: "yellow" },
};

export default function WrongView({ savedQuestions, onRetry }: { savedQuestions: SavedQuestion[]; onRetry: (id: string) => void }) {
  const first = savedQuestions[0];
  return <div className="page">
    <div className="page-title"><p className="eyebrow">WRONG ANSWERS</p><h1>오답노트</h1><p>직접 저장한 문제를 다시 풀고, 약점을 실력으로 바꿔보세요.</p></div>
    {savedQuestions.length > 0 ? <div className="wrong-banner"><span>♡</span><div><b>{savedQuestions.length}개의 문제</b>를 복습하면<br />저장한 취약 개념을 차근차근 보완할 수 있어요.</div><button className="primary" onClick={() => onRetry(first.id)}>복습 시작 →</button></div> : <div className="wrong-banner"><span>♡</span><div><b>아직 저장한 오답이 없어요.</b><br />문제 풀이 후 ‘오답 저장’을 누르면 여기에 표시됩니다.</div></div>}
    <div className="wrong-list"><div className="section-heading"><h2>저장한 문제</h2><span>{savedQuestions.length}문제</span></div>
      {savedQuestions.length > 0 ? savedQuestions.map((q) => { const meta = areaMeta[q.area] ?? { label: q.area, color: "coral" }; return <div className="wrong-item" key={q.id}><div><span className={`tag ${meta.color}`}>{meta.label}</span><b>{q.title}</b><small>취약 개념 · {q.concept}</small></div><button className="secondary" onClick={() => onRetry(q.id)}>다시 풀기</button></div>; }) : <div className="history-list"><div className="empty-progress"><div><b>저장된 오답 문제가 없습니다.</b><p>오답 문제의 피드백 화면에서 ‘오답 저장’을 눌러 보관할 수 있어요.</p></div></div></div>}
    </div>
  </div>;
}
