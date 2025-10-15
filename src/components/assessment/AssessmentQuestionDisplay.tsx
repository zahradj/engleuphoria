import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface AssessmentQuestionDisplayProps {
  question: {
    id: string;
    question_text: string;
    question_type: string;
    options?: any;
    audio_url?: string;
  };
  value: string;
  onChange: (value: string) => void;
}

export function AssessmentQuestionDisplay({ question, value, onChange }: AssessmentQuestionDisplayProps) {
  const renderQuestionInput = () => {
    switch (question.question_type) {
      case 'multiple_choice':
        const options = question.options?.options || [];
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            {options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true_false':
        return (
          <RadioGroup value={value} onValueChange={onChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="cursor-pointer">True</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="cursor-pointer">False</Label>
            </div>
          </RadioGroup>
        );

      case 'short_answer':
        return (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full"
          />
        );

      case 'essay':
      case 'writing':
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[200px]"
          />
        );

      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[150px]"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{question.question_text}</h3>
        {question.audio_url && (
          <audio controls className="w-full">
            <source src={question.audio_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      {renderQuestionInput()}
    </div>
  );
}