import { toast } from "sonner";

export interface ReconnectionConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export class ReconnectionManager {
  private reconnectAttempts = 0;
  private reconnectTimer: number | null = null;
  private isReconnecting = false;
  
  private config: ReconnectionConfig = {
    maxAttempts: 5,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2
  };

  private onReconnectCallback: (() => Promise<void>) | null = null;
  private onStatusChangeCallback: ((status: 'reconnecting' | 'connected' | 'failed') => void) | null = null;

  constructor(config?: Partial<ReconnectionConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  setCallbacks(
    onReconnect: () => Promise<void>,
    onStatusChange?: (status: 'reconnecting' | 'connected' | 'failed') => void
  ) {
    this.onReconnectCallback = onReconnect;
    this.onStatusChangeCallback = onStatusChange || null;
  }

  async attemptReconnection() {
    if (this.isReconnecting) {
      console.log('🔄 Already attempting to reconnect');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts = 0;

    console.log('🔄 Starting reconnection process...');
    this.notifyStatusChange('reconnecting');
    
    toast.info("Connection lost. Attempting to reconnect...");

    await this.scheduleReconnect();
  }

  private async scheduleReconnect() {
    if (this.reconnectAttempts >= this.config.maxAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.isReconnecting = false;
      this.notifyStatusChange('failed');
      
      toast.error("Failed to reconnect. Please refresh the page.");
      return;
    }

    this.reconnectAttempts++;
    
    const delay = Math.min(
      this.config.initialDelay * Math.pow(this.config.backoffMultiplier, this.reconnectAttempts - 1),
      this.config.maxDelay
    );

    console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.config.maxAttempts} in ${delay}ms`);

    this.reconnectTimer = window.setTimeout(async () => {
      try {
        if (this.onReconnectCallback) {
          await this.onReconnectCallback();
          
          console.log('✅ Reconnection successful');
          this.isReconnecting = false;
          this.reconnectAttempts = 0;
          this.notifyStatusChange('connected');
          
          toast.success("Reconnected successfully!");
        }
      } catch (error) {
        console.error(`❌ Reconnection attempt ${this.reconnectAttempts} failed:`, error);
        
        // Schedule next attempt
        await this.scheduleReconnect();
      }
    }, delay);
  }

  private notifyStatusChange(status: 'reconnecting' | 'connected' | 'failed') {
    if (this.onStatusChangeCallback) {
      this.onStatusChangeCallback(status);
    }
  }

  cancelReconnection() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.isReconnecting = false;
    this.reconnectAttempts = 0;
    console.log('🛑 Reconnection cancelled');
  }

  isCurrentlyReconnecting(): boolean {
    return this.isReconnecting;
  }

  dispose() {
    this.cancelReconnection();
    this.onReconnectCallback = null;
    this.onStatusChangeCallback = null;
  }
}
