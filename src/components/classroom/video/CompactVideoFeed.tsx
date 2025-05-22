
import { Draggable } from "../ui/Draggable";
import { VideoFeed } from "./VideoFeed";
import { type VideoFeedType } from "./types";

interface CompactVideoFeedProps {
  feed: VideoFeedType;
  isCurrentUser: boolean;
}

export function CompactVideoFeed({ feed, isCurrentUser }: CompactVideoFeedProps) {
  return (
    <Draggable>
      <div className="w-48 aspect-video bg-black rounded-lg overflow-hidden shadow-md border border-muted relative">
        <VideoFeed
          feed={feed}
          isSmall={true}
          isCurrentUser={isCurrentUser}
        />
      </div>
    </Draggable>
  );
}
