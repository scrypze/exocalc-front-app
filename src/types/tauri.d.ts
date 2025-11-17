interface Window {
  __TAURI__?: {
    invoke: (cmd: string, args?: any) => Promise<any>;
    tauri: {
      invoke: (cmd: string, args?: any) => Promise<any>;
    };
  };
}

