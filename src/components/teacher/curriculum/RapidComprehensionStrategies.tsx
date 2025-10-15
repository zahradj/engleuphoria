
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMPREHENSION_STRATEGIES, ComprehensionStrategy } from "@/services/enhancedCurriculumService";
import { Brain, Zap, Eye, Gamepad2, Layers, RotateCcw, Users } from "lucide-react";

interface RapidComprehensionStrategiesProps {
  onStrategySelect: (strategy: ComprehensionStrategy) => void;
  activeStrategies?: string[];
}

export function RapidComprehensionStrategies({ 
  onStrategySelect,
  activeStrategies = []
}: RapidComprehensionStrategiesProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<ComprehensionStrategy | null>(null);

  const getStrategyIcon = (strategyId: string) => {
    switch (strategyId) {
      case 'visual_anchoring': return Eye;
      case 'pattern_games': return Gamepad2;
      case 'chunking': return Layers;
      case 'backward_building': return RotateCcw;
      case 'contextual_immersion': return Users;
      default: return Brain;
    }
  };

  const getStrategyColor = (strategyId: string) => {
    switch (strategyId) {
      case 'visual_anchoring': return "bg-purple-100 text-purple-800 border-purple-300";
      case 'pattern_games': return "bg-green-100 text-green-800 border-green-300";
      case 'chunking': return "bg-blue-100 text-blue-800 border-blue-300";
      case 'backward_building': return "bg-orange-100 text-orange-800 border-orange-300";
      case 'contextual_immersion': return "bg-pink-100 text-pink-800 border-pink-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleStrategyClick = (strategy: ComprehensionStrategy) => {
    setSelectedStrategy(strategy);
    onStrategySelect(strategy);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
            <Zap className="h-5 w-5 text-yellow-600" />
            ⚡ Rapid Comprehension Strategies
          </CardTitle>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            ✨ Evidence-based techniques to accelerate language understanding and retention
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMPREHENSION_STRATEGIES.map((strategy) => {
              const Icon = getStrategyIcon(strategy.id);
              const isActive = activeStrategies.includes(strategy.id);
              const isSelected = selectedStrategy?.id === strategy.id;
              
              return (
                <Card 
                  key={strategy.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                  } ${isActive ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200/50' : 'bg-white dark:bg-gray-900'}`}
                  onClick={() => handleStrategyClick(strategy)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-purple-600" />
                          <h4 className="font-medium text-purple-900 dark:text-purple-100">{strategy.name}</h4>
                        </div>
                        {isActive && (
                          <Badge className="bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-300">✓ Active</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        {strategy.description}
                      </p>
                      
                      <div>
                        <Badge className={getStrategyColor(strategy.id)}>
                          🎯 {strategy.technique}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-purple-500 dark:text-purple-400">
                        📝 Application: {strategy.application}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedStrategy && (
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
              {React.createElement(getStrategyIcon(selectedStrategy.id), { 
                className: "h-5 w-5 text-purple-600" 
              })}
              📚 {selectedStrategy.name} - Implementation Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">📋 Strategy Description</h4>
                <p className="text-purple-700 dark:text-purple-300 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/50 dark:to-purple-800/50 p-3 rounded-lg border border-purple-200/50">
                  {selectedStrategy.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🎯 Technique</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/50 p-3 rounded-lg border border-blue-200/50">
                  {selectedStrategy.technique}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🏫 Classroom Application</h4>
                <p className="text-sm text-green-600 dark:text-green-300 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/50 dark:to-green-800/50 p-3 rounded-lg border border-green-200/50">
                  {selectedStrategy.application}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">👁️ Visual Component</h4>
                <p className="text-sm text-pink-600 dark:text-pink-300 bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900/50 dark:to-pink-800/50 p-3 rounded-lg border border-pink-200/50">
                  {selectedStrategy.visualComponent}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-md">
                  🚀 Implement Strategy
                </Button>
                <Button variant="outline" className="flex-1 text-purple-600 border-purple-300 hover:bg-purple-100/50 dark:text-purple-400 dark:border-purple-700">
                  👁️ View Examples
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
