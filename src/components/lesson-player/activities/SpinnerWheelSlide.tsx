import React, { useState } from 'react';
import SpeakingPractice from './SpeakingPractice';

interface ActivityData {
  instruction?: string;
  wheel_segments: string[];
  prompt_template?: string;
}

interface Props {
  slide: any;
  hub?: 'playground' | 'academy' | 'success';
  onCorrect?: () => void;
  onIncorrect?: () => void;
  onComplete?: () => void;
}

const COLORS = ['#FE6A2F', '#6B21A8', '#059669', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#EF4444'];

const SpinnerWheelSlide: React.FC<Props> = ({ slide, hub = 'playground', onCorrect, onComplete }) => {
  const data: ActivityData = (slide?.activity_data ?? slide?.interactive_data) || { wheel_segments: [] };
  const segments = data.wheel_segments.length > 0 ? data.wheel_segments : ['—'];
  const [rotation, setRotation] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);

  const sliceAngle = 360 / segments.length;

  const spin = () => {
    if (spinning) return;
    setChosen(null);
    setSpinning(true);
    const target = Math.floor(Math.random() * segments.length);
    const extra = 360 * 5 + (360 - target * sliceAngle - sliceAngle / 2);
    const next = rotation + extra;
    setRotation(next);
    setTimeout(() => {
      setChosen(segments[target]);
      setSpinning(false);
    }, 3200);
  };

  const target = chosen
    ? (data.prompt_template ? data.prompt_template.replace('{segment}', chosen) : chosen)
    : '';

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-5 text-center">
      <h2 className="text-2xl font-bold text-foreground">{slide.title || 'Spin and say!'}</h2>
      {data.instruction && <p className="text-muted-foreground">{data.instruction}</p>}

      <div className="relative mx-auto" style={{ width: 320, height: 320 }}>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-foreground" />
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full rounded-full shadow-lg transition-transform duration-[3000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((seg, i) => {
            const a0 = (i * sliceAngle - 90) * (Math.PI / 180);
            const a1 = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
            const x0 = 50 + 50 * Math.cos(a0), y0 = 50 + 50 * Math.sin(a0);
            const x1 = 50 + 50 * Math.cos(a1), y1 = 50 + 50 * Math.sin(a1);
            const large = sliceAngle > 180 ? 1 : 0;
            const tx = 50 + 30 * Math.cos((a0 + a1) / 2);
            const ty = 50 + 30 * Math.sin((a0 + a1) / 2);
            const rot = (i * sliceAngle) + sliceAngle / 2;
            return (
              <g key={i}>
                <path d={`M50,50 L${x0},${y0} A50,50 0 ${large} 1 ${x1},${y1} Z`} fill={COLORS[i % COLORS.length]} stroke="white" strokeWidth="0.5" />
                <text x={tx} y={ty} fill="white" fontSize="6" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${rot} ${tx} ${ty})`}>
                  {seg.length > 10 ? seg.slice(0, 9) + '…' : seg}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:scale-105 transition disabled:opacity-50"
      >
        {spinning ? 'Spinning…' : chosen ? 'Spin again' : 'Spin the wheel!'}
      </button>

      {chosen && !spinning && (
        <div className="pt-4">
          <p className="text-lg font-semibold text-foreground mb-3">{target}</p>
          <SpeakingPractice
            targetSentence={chosen}
            hub={hub === 'professional' as any ? 'success' : hub}
            slideId={slide.id}
            lessonId={(slide as any).lesson_id}
            onComplete={() => { onCorrect?.(); onComplete?.(); }}
          />
        </div>
      )}
    </div>
  );
};

export default SpinnerWheelSlide;
