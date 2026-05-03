import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Playground Engine — self-contained mini demo.
 * Design tokens FIXED (Playground orange/yellow brand).
 * Lesson content fully DYNAMIC via the SLIDES array below.
 *
 * Extend in 4 steps:
 *  1. Add a variant to the `Slide` union
 *  2. Build a `<YourGame slide={slide} />` component
 *  3. Add a case to <SlideRenderer>
 *  4. Append to SLIDES
 */

// ─── Types ───────────────────────────────────────────────────────────────────
type Slide =
  | { type: 'intro'; title: string; text?: string }
  | { type: 'multiple'; question: string; options: string[]; answer: string }
  | { type: 'truefalse'; statement: string; answer: boolean }
  | { type: 'fill'; text: string; answer: string }
  | { type: 'drag'; instruction: string; target: string; word: string }
  | { type: 'match'; instruction: string; pairs: { word: string; match: string }[] }
  | { type: 'memory'; instruction: string; pairs: { a: string; b: string }[] }
  | { type: 'draw'; prompt: string };

// ─── Dynamic lesson content (edit only this) ─────────────────────────────────
const SLIDES: Slide[] = [
  { type: 'intro', title: '👋 Hello, friend!', text: "Let's play and learn English!" },
  { type: 'multiple', question: 'What is this? 🐶', options: ['dog', 'cat', 'apple'], answer: 'dog' },
  { type: 'truefalse', statement: 'This is a cat 🐱', answer: true },
  { type: 'fill', text: 'My name is ____', answer: 'Alex' },
  { type: 'drag', instruction: 'Drag the word onto the picture', target: '🍎', word: 'APPLE' },
  {
    type: 'match',
    instruction: 'Tap a word, then tap its picture',
    pairs: [
      { word: 'DOG', match: '🐶' },
      { word: 'CAT', match: '🐱' },
      { word: 'SUN', match: '☀️' },
      { word: 'STAR', match: '⭐' },
    ],
  },
  {
    type: 'memory',
    instruction: 'Find the matching pairs',
    pairs: [
      { a: '🐶', b: 'DOG' },
      { a: '🐱', b: 'CAT' },
      { a: '🍎', b: 'APPLE' },
    ],
  },
  { type: 'draw', prompt: 'Draw your favourite animal!' },
];

// ─── Design system (Playground brand — fixed) ────────────────────────────────
const styles: Record<string, CSSProperties> = {
  app: {
    background: 'linear-gradient(135deg, #FE6A2F 0%, #FFB703 50%, #FEFBDD 100%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Comic Sans MS", "Poppins", system-ui, sans-serif',
    padding: '24px',
    gap: '20px',
  },
  slideContainer: {
    width: 'min(960px, 95%)',
    minHeight: '70vh',
    background: 'white',
    borderRadius: '32px',
    boxShadow: '0 20px 60px rgba(254, 106, 47, 0.35)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: '24px',
  },
  title: { fontSize: '44px', fontWeight: 800, color: '#FE6A2F', margin: 0 },
  text: { fontSize: '24px', color: '#333', margin: 0 },
  primaryButton: {
    padding: '14px 26px',
    fontSize: '20px',
    fontWeight: 700,
    borderRadius: '16px',
    border: 'none',
    background: '#FE6A2F',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 6px 0 #c44d1e',
  },
  optionButton: {
    padding: '12px 22px',
    fontSize: '20px',
    fontWeight: 700,
    borderRadius: '16px',
    border: '3px solid #FFB703',
    background: 'white',
    color: '#FE6A2F',
    cursor: 'pointer',
    margin: '6px',
  },
  controls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.85)',
    padding: '10px 18px',
    borderRadius: '999px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: 'none',
    background: '#FE6A2F',
    color: 'white',
    fontSize: 22,
    cursor: 'pointer',
  },
  feedback: { fontSize: '28px', margin: 0 },
  input: {
    fontSize: '24px',
    padding: '12px 18px',
    borderRadius: '14px',
    border: '3px solid #FFB703',
    outline: 'none',
    width: 'min(320px, 80%)',
    textAlign: 'center',
  },
};

// ─── App ─────────────────────────────────────────────────────────────────────
export default function PlaygroundDemo() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  return (
    <div style={styles.app}>
      <div style={styles.slideContainer} key={index}>
        <SlideRenderer slide={slide} />
      </div>
      <div style={styles.controls}>
        <button
          aria-label="Previous"
          style={styles.navButton}
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
        >
          ←
        </button>
        <span style={{ fontWeight: 800, color: '#FE6A2F', fontSize: 18 }}>
          {index + 1} / {SLIDES.length}
        </span>
        <button
          aria-label="Next"
          style={styles.navButton}
          onClick={() => setIndex((i) => Math.min(i + 1, SLIDES.length - 1))}
          disabled={index === SLIDES.length - 1}
        >
          →
        </button>
      </div>
    </div>
  );
}

// ─── Renderer ────────────────────────────────────────────────────────────────
function SlideRenderer({ slide }: { slide: Slide }) {
  switch (slide.type) {
    case 'intro': return <Intro slide={slide} />;
    case 'multiple': return <MultipleChoice slide={slide} />;
    case 'truefalse': return <TrueFalse slide={slide} />;
    case 'fill': return <FillBlank slide={slide} />;
    case 'drag': return <DragDrop slide={slide} />;
    case 'match': return <MatchGame slide={slide} />;
    case 'memory': return <MemoryGame slide={slide} />;
    case 'draw': return <DrawGame slide={slide} />;
    default: return <p style={styles.text}>Unknown slide type</p>;
  }
}

// ─── Games ───────────────────────────────────────────────────────────────────
function Intro({ slide }: { slide: Extract<Slide, { type: 'intro' }> }) {
  return (
    <>
      <h1 style={styles.title}>{slide.title}</h1>
      {slide.text && <p style={styles.text}>{slide.text}</p>}
    </>
  );
}

function MultipleChoice({ slide }: { slide: Extract<Slide, { type: 'multiple' }> }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked !== null && picked === slide.answer;
  return (
    <>
      <h1 style={styles.title}>{slide.question}</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {slide.options.map((opt) => {
          const isPicked = picked === opt;
          const isAnswer = opt === slide.answer;
          const bg = picked ? (isAnswer ? '#22c55e' : isPicked ? '#ef4444' : 'white') : 'white';
          const color = picked && (isAnswer || isPicked) ? 'white' : '#FE6A2F';
          return (
            <button
              key={opt}
              style={{ ...styles.optionButton, background: bg, color }}
              onClick={() => setPicked(opt)}
              disabled={picked !== null}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p style={styles.feedback}>{correct ? '✅ Correct!' : '❌ Try again next time!'}</p>
      )}
    </>
  );
}

function TrueFalse({ slide }: { slide: Extract<Slide, { type: 'truefalse' }> }) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const correct = picked !== null && picked === slide.answer;
  return (
    <>
      <h1 style={styles.title}>{slide.statement}</h1>
      <div style={{ display: 'flex', gap: 16 }}>
        <button style={styles.primaryButton} onClick={() => setPicked(true)} disabled={picked !== null}>
          ✅ True
        </button>
        <button
          style={{ ...styles.primaryButton, background: '#1f2937', boxShadow: '0 6px 0 #0f172a' }}
          onClick={() => setPicked(false)}
          disabled={picked !== null}
        >
          ❌ False
        </button>
      </div>
      {picked !== null && <p style={styles.feedback}>{correct ? '🎉 Yes!' : '🙈 Not quite!'}</p>}
    </>
  );
}

function FillBlank({ slide }: { slide: Extract<Slide, { type: 'fill' }> }) {
  const [input, setInput] = useState('');
  const correct = input.trim().toLowerCase() === slide.answer.toLowerCase();
  return (
    <>
      <h1 style={styles.title}>{slide.text}</h1>
      <input
        style={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type here…"
      />
      {input && <p style={styles.feedback}>{correct ? '✅ Correct!' : '✍️ Keep trying…'}</p>}
    </>
  );
}

function DragDrop({ slide }: { slide: Extract<Slide, { type: 'drag' }> }) {
  const [dropped, setDropped] = useState(false);
  return (
    <>
      <h1 style={styles.title}>{slide.instruction}</h1>
      <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => setDropped(true)}
          style={{
            width: 180,
            height: 180,
            borderRadius: 24,
            border: '4px dashed #FE6A2F',
            background: dropped ? '#FFE6D5' : '#FEFBDD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 80,
          }}
        >
          {slide.target}
        </div>
        <div
          draggable={!dropped}
          onDragStart={(e) => e.dataTransfer.setData('text', slide.word)}
          style={{
            ...styles.primaryButton,
            opacity: dropped ? 0.4 : 1,
            cursor: dropped ? 'default' : 'grab',
          }}
        >
          {slide.word}
        </div>
      </div>
      {dropped && <p style={styles.feedback}>🎉 Great job!</p>}
    </>
  );
}

function MatchGame({ slide }: { slide: Extract<Slide, { type: 'match' }> }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [shuffledMatches] = useState(() =>
    [...slide.pairs.map((p) => p.match)].sort(() => 0.5 - Math.random()),
  );

  const handleMatchClick = (m: string) => {
    if (!selected) return;
    const correct = slide.pairs.find((p) => p.word === selected)?.match === m;
    if (correct) setMatched((prev) => ({ ...prev, [selected]: m }));
    setSelected(null);
  };

  const done = Object.keys(matched).length === slide.pairs.length;

  return (
    <>
      <h1 style={styles.title}>{slide.instruction}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', maxWidth: 600 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {slide.pairs.map((p) => (
            <button
              key={p.word}
              style={{
                ...styles.optionButton,
                background: matched[p.word] ? '#22c55e' : selected === p.word ? '#FFB703' : 'white',
                color: matched[p.word] || selected === p.word ? 'white' : '#FE6A2F',
              }}
              onClick={() => !matched[p.word] && setSelected(p.word)}
              disabled={!!matched[p.word]}
            >
              {p.word}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shuffledMatches.map((m) => {
            const isMatched = Object.values(matched).includes(m);
            return (
              <button
                key={m}
                style={{ ...styles.optionButton, fontSize: 32, background: isMatched ? '#22c55e' : 'white' }}
                onClick={() => handleMatchClick(m)}
                disabled={isMatched}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>
      {done && <p style={styles.feedback}>🌟 All matched!</p>}
    </>
  );
}

function MemoryGame({ slide }: { slide: Extract<Slide, { type: 'memory' }> }) {
  type Card = { id: number; pairKey: number; label: string };
  const [cards] = useState<Card[]>(() => {
    const built: Card[] = [];
    slide.pairs.forEach((p, i) => {
      built.push({ id: i * 2, pairKey: i, label: p.a });
      built.push({ id: i * 2 + 1, pairKey: i, label: p.b });
    });
    return built.sort(() => 0.5 - Math.random());
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const flip = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next.map((i) => cards.find((c) => c.id === i)!);
      if (a.pairKey === b.pairKey) {
        setTimeout(() => {
          setMatched((m) => [...m, a.id, b.id]);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const done = matched.length === cards.length;

  return (
    <>
      <h1 style={styles.title}>{slide.instruction}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(cards.length, 4)}, 1fr)`, gap: 12 }}>
        {cards.map((c) => {
          const isOpen = flipped.includes(c.id) || matched.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => flip(c.id)}
              style={{
                width: 110,
                height: 110,
                borderRadius: 16,
                border: 'none',
                background: matched.includes(c.id) ? '#22c55e' : isOpen ? '#FFB703' : '#FE6A2F',
                color: 'white',
                fontSize: isOpen ? 36 : 40,
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
              }}
            >
              {isOpen ? c.label : '?'}
            </button>
          );
        })}
      </div>
      {done && <p style={styles.feedback}>🎉 You found them all!</p>}
    </>
  );
}

function DrawGame({ slide }: { slide: Extract<Slide, { type: 'draw' }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#FE6A2F';
  }, []);

  const pos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const point = 'touches' in e ? e.touches[0] : (e as React.MouseEvent);
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext('2d')!;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const end = () => {
    drawing.current = false;
  };
  const clear = () => {
    const c = canvasRef.current!;
    c.getContext('2d')!.clearRect(0, 0, c.width, c.height);
  };

  return (
    <>
      <h1 style={styles.title}>🎨 {slide.prompt}</h1>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{
          border: '4px solid #FFB703',
          borderRadius: 20,
          background: '#FEFBDD',
          touchAction: 'none',
        }}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
      <button style={styles.primaryButton} onClick={clear}>
        🧽 Clear
      </button>
    </>
  );
}
