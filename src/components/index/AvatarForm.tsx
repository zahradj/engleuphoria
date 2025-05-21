
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AvatarSelection } from "@/components/AvatarSelection";
import { AnimatedButton } from "@/components/AnimatedButton";

interface AvatarFormProps {
  onComplete: () => void;
  onGoBack: () => void;
  selectedAvatar: number | undefined;
  setSelectedAvatar: (avatar: number) => void;
}

export const AvatarForm = ({ onComplete, onGoBack, selectedAvatar, setSelectedAvatar }: AvatarFormProps) => {
  const handleAvatarSelect = (avatar: { id: number }) => {
    setSelectedAvatar(avatar.id);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-2">Choose Your Avatar</h2>
        <p className="text-muted-foreground">Pick a character to represent you</p>
      </div>
      
      <Card className="p-6 animate-scale-in">
        <div className="animate-fade-in animation-delay-300">
          <AvatarSelection
            onSelect={handleAvatarSelect}
            selectedAvatarId={selectedAvatar}
          />
        </div>
        
        <div className="mt-6">
          <AnimatedButton
            className="w-full"
            onClick={onComplete}
            disabled={selectedAvatar === undefined}
            animationType="bounce"
          >
            Start Learning
          </AnimatedButton>
        </div>
      </Card>
      
      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={onGoBack}>
          Go Back
        </Button>
      </div>
    </div>
  );
};
