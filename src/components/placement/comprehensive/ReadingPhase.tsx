import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { READING_PASSAGE } from './content';

export interface ReadingResult {
  qid: string;
  choice: number;
  correct: boolean;
}

interface Props {
  onComplete: (results: ReadingResult[]) => void;
}

const ReadingPhase: React.FC<Props> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const allAnswered =
    READING_PASSAGE.questions.every((q) => answers[q.qid] !== undefined);

  const submit = () => {
    const results = READING_PASSAGE.questions.map((q) => ({
      qid: q.qid,
      choice: answers[q.qid],
      correct: answers[q.qid] === q.correctIndex,
    }));
    onComplete(results);
  };

  return (
    <div className="h-full flex flex-col p-5 sm:p-6 text-white overflow-hidden">
      <h2 className="text-lg sm:text-xl font-bold mb-1">Reading</h2>
      <p className="text-xs text-white/70 mb-3">
        Read the passage, then answer all 3 questions.
      </p>

      <div className="flex-1 overflow-auto pr-1 space-y-4">
        <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-4 leading-relaxed text-sm sm:text-base">
          {READING_PASSAGE.passage}
        </div>

        {READING_PASSAGE.questions.map((q, qi) => (
          <div key={q.qid} className="space-y-2">
            <div className="text-sm font-semibold">
              {qi + 1}. {q.question}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => {
                const selected = answers[q.qid] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setAnswers({ ...answers, [q.qid]: oi })}
                    className={[
                      'text-left rounded-xl px-3 py-2 text-sm border transition',
                      selected
                        ? 'bg-white text-slate-900 border-white'
                        : 'bg-white/5 border-white/15 hover:bg-white/10',
                    ].join(' ')}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3">
        <Button
          onClick={submit}
          disabled={!allAnswered}
          className="w-full bg-white text-slate-900 hover:bg-white/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ReadingPhase;
