export type EventType = {
  coach: string;
  student: string;
  title: string;
  date: Date;
  fromHour: number;
  toHour: number;
  state: string;
  game: string;
  roomCode: string;
};

export type SlotType = {
  date: Date;
  fromHour: number;
  toHour: number;
};