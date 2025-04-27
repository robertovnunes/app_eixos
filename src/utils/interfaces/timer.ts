declare module 'interfaces/timer' {

  export interface Duration {
    minutes: number;
    seconds: number;
  }

  export default interface Timer {
    id: string;
    name: string;
    focusDuration: Duration;
    shortBreakDuration: Duration;
    longBreakDuration: Duration;
    loops: number;
    isDefault?: boolean;
  }

}
