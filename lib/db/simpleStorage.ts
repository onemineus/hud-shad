export type Event = {
  id: number;
  date: Date;
  title: string;
  roomCode: string;
  startTime: Date;
  endTime: Date;
  state: string;
  game: string;
  coach: string;
  student: string;
};

export let eventsList: Event[] = [
  {
    id: 1,
    date: new Date("2023-11-09T00:00:00.000Z"),
    title: "Valorant Tournament",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-09T00:00:00.000Z"),
    endTime: new Date("2023-11-09T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Phoenix",
  },
  {
    id: 2,
    date: new Date("2023-11-09T00:00:00.000Z"),
    title: "Valorant Tournament",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-09T00:00:00.000Z"),
    endTime: new Date("2023-11-09T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Raze",
  },
  {
    id: 3,
    date: new Date("2023-11-09T00:00:00.000Z"),
    title: "Valorant Tournament",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-09T00:00:00.000Z"),
    endTime: new Date("2023-11-09T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Jett",
  },
  {
    id: 4,
    date: new Date("2023-11-28T00:00:00.000Z"),
    title: "Valorant Championship",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-28T00:00:00.000Z"),
    endTime: new Date("2023-11-28T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Sova",
  },
  {
    id: 5,
    date: new Date("2023-11-23T00:00:00.000Z"),
    title: "Valorant Showdown",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-23T00:00:00.000Z"),
    endTime: new Date("2023-11-23T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Cypher",
  },
  {
    id: 6,
    date: new Date("2023-11-29T00:00:00.000Z"),
    title: "Valorant Clash",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-29T00:00:00.000Z"),
    endTime: new Date("2023-11-29T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Brimstone",
  },
  {
    id: 7,
    date: new Date("2023-11-11T00:00:00.000Z"),
    title: "Valorant Showdown",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-11T00:00:00.000Z"),
    endTime: new Date("2023-11-11T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Viper",
  },
  {
    id: 8,
    date: new Date("2023-11-03T00:00:00.000Z"),
    title: "Valorant Clash",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-03T00:00:00.000Z"),
    endTime: new Date("2023-11-03T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Sage",
  },
  {
    id: 9,
    date: new Date("2023-11-05T00:00:00.000Z"),
    title: "Valorant Tournament",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-05T00:00:00.000Z"),
    endTime: new Date("2023-11-05T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Omen",
  },
  {
    id: 10,
    date: new Date("2023-11-27T00:00:00.000Z"),
    title: "Valorant Championship",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-27T00:00:00.000Z"),
    endTime: new Date("2023-11-27T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Phoenix",
  },
  {
    id: 11,
    date: new Date("2023-11-22T00:00:00.000Z"),
    title: "Valorant Clash",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-22T00:00:00.000Z"),
    endTime: new Date("2023-11-22T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Raze",
  },
  {
    id: 12,
    date: new Date("2023-11-14T00:00:00.000Z"),
    title: "Valorant Championship",
    roomCode: "zol-zgry-ymj",
    startTime: new Date("2023-11-14T00:00:00.000Z"),
    endTime: new Date("2023-11-14T02:00:00.000Z"),
    state: "pending",
    game: "valorant",
    coach: "Tenz",
    student: "Jett",
  },
];

export const student = {
  name: "Raze",
};

export const coach = {
  name: "Tenz",
};

export let coachData: {
  id: number;
  name: string;
  availability: {
    fromDate: Date;
    toDate: Date;
    fromHour: number;
    toHour: number;
  };
}[] = [
  {
    id: 1,
    name: "Tenz",
    availability: {
      fromDate: new Date("2023-11-16T02:00:00.000Z"),
      toDate: new Date("2023-11-26T02:00:00.000Z"),
      fromHour: 12,
      toHour: 22,
    },
  },
];

export let sessionStorage: {
  coach: string;
  student: string;
  title: string;
  date: Date;
  fromHour: number;
  toHour: number;
  state: string;
  game: string;
  roomCode: string;
}[] = [];
