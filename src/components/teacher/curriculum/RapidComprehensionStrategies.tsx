
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Rapid Comprehension Strategies
          </CardTitle>
          <p className="text-sm text-gray-600">
            Evidence-based techniques to accelerate language understanding and retention
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
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  } ${isActive ? 'bg-blue-50 border-blue-200' : ''}`}
                  onClick={() => handleStrategyClick(strategy)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <h4 className="font-medium">{strategy.name}</h4>
                        </div>
                        {isActive && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {strategy.description}
                      </p>
                      
                      <div>
                        <Badge className={getStrategyColor(strategy.id)}>
                          {strategy.technique}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Application: {strategy.application}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(getStrategyIcon(selectedStrategy.id), { 
                className: "h-5 w-5 text-blue-600" 
              })}
              {selectedStrategy.name} - Implementation Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Strategy Description</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedStrategy.description}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Technique</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  {selectedStrategy.technique}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Classroom Application</h4>
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                  {selectedStrategy.application}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Visual Component</h4>
                <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                  {selectedStrategy.visualComponent}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1">
                  Implement Strategy
                </Button>
                <Button variant="outline" className="flex-1">
                  View Examples
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
