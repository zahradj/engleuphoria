
export class JitsiApiLoader {
  static async loadJitsiApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Jitsi Meet API'));
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  static createContainer(): HTMLElement {
    let container = document.getElementById('jitsi-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'jitsi-container';
      container.style.display = 'none';
      document.body.appendChild(container);
    }
    return container;
  }

  static removeContainer(): void {
    const container = document.getElementById('jitsi-container');
    if (container) {
      container.remove();
    }
  }
}
