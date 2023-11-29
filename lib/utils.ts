import { type ClassValue, clsx } from "clsx";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";
import { EventType } from "./types";

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

export const extractUniqueDates = (eventsList: { date: Timestamp }[]) => {
  const uniqueDatesSet = new Set<number>(); // Using Set<number> for unique timestamps

  eventsList.forEach((obj) => {
    console.log(obj);
    uniqueDatesSet.add(obj.date?.toDate().getTime());
  });

  // Convert the timestamps back to Date objects
  const uniqueDatesArray = Array.from(uniqueDatesSet).map(
    (timestamp) => new Date(timestamp)
  );

  console.log(uniqueDatesArray);
  return uniqueDatesArray;
};

export function filterSessionsByDate(
  objects: EventType[],
  targetDate: Date
): EventType[] {
  // Filter objects based on the targetDate
  console.log(objects);
  const filteredObjects = objects.filter((obj) => {
    console.log(
      obj.date,
      obj.date?.toDate,
      typeof obj.date?.toDate === "function"
    );
    if (
      obj.date &&
      obj.date?.toDate &&
      typeof obj.date?.toDate === "function"
    ) {
      const objDate = obj.date.toDate();

      return (
        objDate.toISOString().split("T")[0] ===
        targetDate.toISOString().split("T")[0]
      );
    }
    return false;
  });

  // Sort filteredObjects by the 'fromHour' property in ascending order
  const sortedObjects = filteredObjects.sort((a, b) => a.fromHour - b.fromHour);

  return sortedObjects;
}
