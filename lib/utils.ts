import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRoomCode = async (): Promise<string> => {
  if (process.env.NEXT_PUBLIC_API_KEY) {
    const response = await fetch(
      "https://api.huddle01.com/api/v1/create-room",
      {
        method: "POST",
        body: JSON.stringify({
          title: "Huddle01-Test",
        }),
        headers: {
          "Content-type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY, // Replace 'YOUR_API_KEY_HERE' with your actual API key
        },
      }
    );
    const data = await response.json();
    return data.data.roomId;
  }
  return "null";
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Full weekday name
    month: "short", // Abbreviated month name
    day: "numeric", // Numeric day of the month
  };

  return date.toLocaleDateString("en-US", options);
};

export const extractUniqueDates = (eventsList: { date: Date }[]) => {
  const uniqueDatesSet = new Set<number>(); // Using Set<number> for unique timestamps

  eventsList.forEach((obj) => {
    uniqueDatesSet.add(obj.date.getTime());
  });

  // Convert the timestamps back to Date objects
  const uniqueDatesArray = Array.from(uniqueDatesSet).map(
    (timestamp) => new Date(timestamp)
  );

  console.log(uniqueDatesArray);
  return uniqueDatesArray;
};

export function filterSessionsByDate(
  objects: {
    coach: string;
    student: string;
    title: string;
    date: Date;
    fromHour: number;
    toHour: number;
    state: string;
    game: string;
    roomCode: string;
  }[],
  targetDate: Date
): {
  coach: string;
  student: string;
  title: string;
  date: Date;
  fromHour: number;
  toHour: number;
  state: string;
  game: string;
  roomCode: string;
}[] {
  return objects.filter(
    (obj) =>
      obj.date.toISOString().split("T")[0] ===
      targetDate.toISOString().split("T")[0]
  );
}
