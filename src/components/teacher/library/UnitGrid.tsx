import { Unit } from "@/types/englishJourney";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";

interface UnitGridProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
}

export function UnitGrid({ units, onSelectUnit }: UnitGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {units.map((unit) => (
        <GlassCard 
          key={unit.id} 
          variant="light"
          className="group relative overflow-hidden hover:neon-border-glow hover:scale-[1.01] transition-all duration-500 border border-white/10 hover:shadow-2xl hover:shadow-[hsl(var(--neon-cyan))]/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-cyan))]/5 to-[hsl(var(--neon-purple))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative p-4 space-y-3">
            {/* Header */}
            <div>
              <h3 className="font-bold text-base bg-gradient-to-r from-white to-[hsl(var(--neon-cyan))] bg-clip-text text-transparent mb-1">
                Unit {unit.unitNumber}: {unit.topic}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{unit.goal}</p>
            </div>

            {/* Quick Stats Bar */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground px-2 py-1.5 glass rounded-lg">
              <span>📚 {unit.lessons?.length || 0} lessons</span>
              <span>⏱️ {unit.estimatedDuration} min</span>
              <span className="text-[hsl(var(--neon-yellow))] font-bold">💎 {unit.xpReward}</span>
            </div>

            {/* Enhanced Skills Display */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2">Skills</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 glass rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-lg">🎧</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">Listening</p>
                    <p className="text-[10px] text-muted-foreground">
                      {unit.listening.duration}m • {unit.listening.tasks.length} tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 glass rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-lg">🗣️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">Speaking</p>
                    <p className="text-[10px] text-muted-foreground">
                      {unit.speaking.duration}m • {unit.speaking.tasks.length} tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 glass rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-lg">📖</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">Reading</p>
                    <p className="text-[10px] text-muted-foreground">
                      {unit.reading.duration}m • {unit.reading.tasks.length} tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 glass rounded-lg hover:bg-white/5 transition-colors">
                  <span className="text-lg">✍️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">Writing</p>
                    <p className="text-[10px] text-muted-foreground">
                      {unit.writing.duration}m • {unit.writing.tasks.length} tasks
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grammar & Function Language */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-sm">📚</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">Grammar Focus</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {unit.grammarFocus.join(", ")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-sm">💬</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">Function Language</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {unit.functionLanguage.slice(0, 2).join(", ")}
                    {unit.functionLanguage.length > 2 && ` +${unit.functionLanguage.length - 2} more`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm">📝</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">Vocabulary</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">
                    {unit.keyVocabulary.slice(0, 5).join(", ")}
                    {unit.keyVocabulary.length > 5 && ` +${unit.keyVocabulary.length - 5} more`}
                  </p>
                </div>
              </div>
            </div>

            {/* Games & Activities */}
            {unit.gamesActivities.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2">🎮 Activities</p>
                <div className="flex flex-wrap gap-1">
                  {unit.gamesActivities.slice(0, 3).map(game => (
                    <span key={game.id} className="px-2 py-1 glass rounded text-[10px] hover:bg-white/10 transition-colors">
                      {game.name}
                    </span>
                  ))}
                  {unit.gamesActivities.length > 3 && (
                    <span className="px-2 py-1 text-[10px] text-muted-foreground">
                      +{unit.gamesActivities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Materials */}
            {unit.materials.length > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <span>📎 Materials:</span>
                <div className="flex gap-1">
                  {unit.materials.slice(0, 5).map(material => (
                    <span key={material.id} className="text-base" title={material.name}>
                      {material.type === 'flashcard' && '🎴'}
                      {material.type === 'worksheet' && '📄'}
                      {material.type === 'audio' && '🔊'}
                      {material.type === 'video' && '🎥'}
                      {material.type === 'interactive' && '🎮'}
                      {material.type === 'pdf' && '📕'}
                    </span>
                  ))}
                  {unit.materials.length > 5 && (
                    <span className="text-[10px] text-muted-foreground">+{unit.materials.length - 5}</span>
                  )}
                </div>
              </div>
            )}

            {/* Badges */}
            {unit.badges.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2">🏆 Rewards</p>
                <div className="flex flex-wrap gap-1">
                  {unit.badges.map((badge, idx) => (
                    <span key={idx} className="px-2 py-1 glass rounded text-[10px] hover:bg-[hsl(var(--neon-yellow))]/10 transition-colors">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Lessons */}
            {unit.lessons && unit.lessons.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2">📚 Lessons</p>
                <div className="space-y-1">
                  {unit.lessons.slice(0, 3).map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-2 p-1.5 glass rounded text-[10px] hover:bg-white/5 transition-colors">
                      <span className="font-semibold text-[hsl(var(--neon-cyan))]">L{lesson.lessonNumber}</span>
                      <span className="flex-1 truncate">{lesson.title}</span>
                      <span className="text-muted-foreground">{lesson.duration}m</span>
                      <span className="text-[hsl(var(--neon-yellow))]">💎 {lesson.xpReward}</span>
                    </div>
                  ))}
                  {unit.lessons.length > 3 && (
                    <p className="text-[10px] text-muted-foreground text-center">
                      +{unit.lessons.length - 3} more lessons
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <GlassButton 
              onClick={() => onSelectUnit(unit)} 
              className="w-full"
              variant="primary"
              glow
              size="sm"
            >
              View Full Details →
            </GlassButton>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
