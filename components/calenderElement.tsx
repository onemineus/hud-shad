import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";
import { GoDotFill } from "react-icons/go";
import { DayClickEventHandler, DayPicker } from "react-day-picker";
import { BiSolidRightArrow } from "react-icons/bi";
import { useAtom } from "jotai";
import { accessToken } from "@/lib/jotai/atoms";
import { Event } from "@/lib/db/simpleStorage";

export default function CalenderElement({
  getMessage,
  address,
  signMessage,
  eventsData,
}: {
  getMessage: Function;
  address: any;
  signMessage: Function;
  eventsData: Event[];
}) {
  const [accessTokenPrivate, setAccessTokenPrivate] = useAtom(accessToken);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const bookedDays = extractUniqueDates(eventsData);
  const bookedStyle = { border: "1px solid currentColor" };
  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    const dayEvents = getEventsByDate(day, eventsData);
    setAccessTokenPrivate("");
    console.log(day);
    setCurrentEvents(dayEvents);
  };
  const [currentEvents, setCurrentEvents] = useState<
    | {
        date: Date;
        title: string;
        roomCode: string;
        startTime: Date;
        endTime: Date;
        state: string;
        game: string;
      }[]
    | null
  >(null);

  const footer = "This day is already booked!";

  return (
    <div className="w-full">
      <Calendar
        defaultMonth={new Date(2023, 10, 8)}
        modifiers={{ booked: bookedDays }}
        selected={date}
        onSelect={setDate}
        modifiersStyles={{ booked: bookedStyle }}
        onDayClick={handleDayClick}
      />
    </div>
  );
}

const extractUniqueDates = (eventsList: { date: Date }[]) => {
  const uniqueDates: any = new Set();
  eventsList.forEach((event) => {
    const { date } = event;
    uniqueDates.add(date.toDateString());
  });
  const uniqueDatesArray = [...uniqueDates].map(
    (dateString) => new Date(dateString)
  );

  return uniqueDatesArray;
};

const getEventsByDate = (targetDate: any, eventsList: any[]) => {
  const targetDateString = targetDate.toDateString();
  return eventsList.filter(
    (event) => event.date.toDateString() === targetDateString
  );
};

export const handleSignClick = async (
  getMessage: Function,
  address: any,
  signMessage: Function
) => {
  const msg = await getMessage(address as string);
  signMessage({ message: msg.message });
};

