declare module 'interfaces/timer' {

  interface Duration {
    minutes: number;
    seconds: number;
  }

  export interface Timer {
    id: string;
    name: string;
    focusDuration: Duration;
    breakDuration: Duration;
    loops: number;
  }

}
