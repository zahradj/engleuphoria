
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, TestTube } from "lucide-react";
import { audioService } from "@/services/audioService";

export function SoundSettings() {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([50]);

  useEffect(() => {
    setIsMuted(audioService.isSoundMuted());
  }, []);

  const handleMuteToggle = (muted: boolean) => {
    setIsMuted(muted);
    audioService.setMuted(muted);
  };

  const testSound = (type: 'click' | 'reward' | 'success' | 'error') => {
    switch (type) {
      case 'click':
        audioService.playButtonClick();
        break;
      case 'reward':
        audioService.playRewardSound();
        break;
      case 'success':
        audioService.playSuccessSound();
        break;
      case 'error':
        audioService.playErrorSound();
        break;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        Sound Settings
      </h3>

      <div className="space-y-4">
        {/* Mute Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="sound-mute">Enable Sounds</Label>
          <Switch
            id="sound-mute"
            checked={!isMuted}
            onCheckedChange={(checked) => handleMuteToggle(!checked)}
          />
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <Label>Volume</Label>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={10}
            disabled={isMuted}
            className="w-full"
          />
        </div>

        {/* Test Sounds */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <TestTube size={14} />
            Test Sounds
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('click')}
              disabled={isMuted}
            >
              Click
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('reward')}
              disabled={isMuted}
            >
              Reward
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('success')}
              disabled={isMuted}
            >
              Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testSound('error')}
              disabled={isMuted}
            >
              Error
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
