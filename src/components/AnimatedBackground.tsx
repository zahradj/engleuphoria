
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  return (
    <>
      <div className={cn("absolute -z-10 inset-0 overflow-hidden", className)}>
        {/* Large background blobs */}
        <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/20 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
        <div className="absolute -z-10 bottom-1/3 right-1/4 w-[90%] h-[90%] bg-teal/15 rounded-full blur-3xl animate-pulse-subtle opacity-65 animation-delay-300"></div>
        <div className="absolute -z-10 top-1/2 left-1/2 w-[80%] h-[80%] bg-orange/10 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-700"></div>
        
        {/* Additional animated elements */}
        <div className="absolute top-20 right-[10%] w-24 h-24 bg-yellow-light/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 left-[15%] w-16 h-16 bg-purple-light/40 rounded-full blur-lg animate-float animation-delay-500"></div>
        
        {/* Small floating particles */}
        <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-purple/60 rounded-full animate-bounce-light"></div>
        <div className="absolute top-[40%] right-[30%] w-2 h-2 bg-teal/60 rounded-full animate-bounce-light animation-delay-300"></div>
        <div className="absolute bottom-[25%] right-[15%] w-4 h-4 bg-orange/60 rounded-full animate-bounce-light animation-delay-700"></div>
      </div>
    </>
  );
}
