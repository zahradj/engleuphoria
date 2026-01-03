import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket, Briefcase } from 'lucide-react';

const panels = [
  {
    id: 'spark',
    icon: Sparkles,
    headline: 'For Kids, we believe in Magic.',
    body: "In our Playground, every lesson is an adventure. Kids explore a gamified forest world where learning English feels like playing their favorite game. Animated mascots guide them, rewards celebrate every milestone, and laughter is part of the curriculum.",
    gradient: 'from-yellow-400 via-green-400 to-emerald-500',
    bgGradient: 'from-yellow-500/20 via-green-500/20 to-emerald-500/20',
    iconColor: 'text-yellow-400',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop'
  },
  {
    id: 'drive',
    icon: Rocket,
    headline: 'For Teens, we believe in Agency.',
    body: "The Academy puts teens in the driver's seat. Project-based learning, real-world challenges, and creative expression help them build confidence. No boring textbooks - just skills that matter for their future.",
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
    iconColor: 'text-violet-400',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop'
  },
  {
    id: 'goal',
    icon: Briefcase,
    headline: 'For Adults, we believe in Results.',
    body: "The Professional Hub is designed for busy professionals who need English for career growth. Structured business English courses, interview preparation, and presentation skills - all delivered efficiently with measurable progress.",
    gradient: 'from-slate-400 via-blue-500 to-cyan-500',
    bgGradient: 'from-slate-400/20 via-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
  }
];

const PhilosophyPanels = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const panelWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / panelWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPanel = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.offsetWidth,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative bg-slate-950">
      {/* Section Header */}
      <div className="py-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-display font-bold text-white mb-4"
        >
          Our Philosophy
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-lg"
        >
          Swipe to explore our three worlds
        </motion.p>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className="min-w-full w-full snap-start flex-shrink-0"
          >
            <div className={`min-h-[70vh] flex items-center bg-gradient-to-br ${panel.bgGradient} bg-slate-950`}>
              <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${panel.gradient} mb-6`}>
                      <panel.icon className="w-5 h-5 text-white" />
                      <span className="text-white font-semibold text-sm">
                        {index === 0 ? 'The Spark' : index === 1 ? 'The Drive' : 'The Goal'}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
                      {panel.headline}
                    </h3>
                    
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                      {panel.body}
                    </p>
                  </motion.div>

                  {/* Image */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="relative"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${panel.gradient} blur-3xl opacity-30 rounded-3xl`} />
                    <img
                      src={panel.image}
                      alt={panel.headline}
                      className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-3 py-8 bg-slate-950">
        {panels.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToPanel(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to panel ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default PhilosophyPanels;
