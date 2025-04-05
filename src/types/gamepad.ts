export interface GamepadData {
    id: string;
    index: number;
    connected: boolean;
    timestamp: number;
    mapping: string;
    axes: number[];
    buttons: GamepadButtonData[];
  }
  
  export interface GamepadButtonData {
    pressed: boolean;
    touched: boolean;
    value: number;
  }
  
  export interface AxesDisplayData {
    name: string;
    value: number;
  } 