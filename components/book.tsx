"use client";
import { useState, useEffect } from "react";
import {
  useConnect,
  useEnsName,
  useAccount,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import { RiWallet3Fill } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiGooglemeet } from "react-icons/si";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BiExit } from "react-icons/bi";
import { getAccessToken, getMessage } from "@huddle01/auth";
import { useAtom } from "jotai";
import { accessToken, isCoach, isCreating, roomCode } from "@/lib/jotai/atoms";
import { Switch, Space } from "antd";
import { IoLogOut } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import CalenderElement, { handleSignClick } from "./calenderElement";
import { coach, eventsList, student } from "@/lib/db/simpleStorage";
import { Calendar } from "./ui/calendar";
import { DayClickEventHandler } from "react-day-picker";
import {
  extractUniqueDates,
  filterSessionsByDate,
  formatDate,
  getRoomCode,
} from "@/lib/utils";
import Hud from "./hud";
import { toast, useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { EventType, SlotType } from "@/lib/types";
import { db } from "@/firebase/fire";
import { addDoc, collection, getDocs } from "firebase/firestore";

const Book = () => {
  // the current coach user data and his availability
  // demo
  // should get fetched from DB
  const coachDataProp = {
    id: 1,
    coach: "Tenz",
    title: "Free Consultation",
    game: "VALORANT",
    availability: {
      fromDate: new Date("2023-11-16T00:00:00.000"),
      toDate: new Date("2023-11-30T00:00:00.000"),
      fromHour: 12,
      toHour: 22,
    },
  };

  // states
  const [allSessionsData, setAllSessionsData] = useState<EventType[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isCoachPrivate, setIsCoachPrivate] = useAtom(isCoach);
  const [isCreatingPrivate, setIsCreatingPrivate] = useAtom(isCreating);
  const [isDoneCreating, setIsDoneCreating] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [domLoaded, setDomLoaded] = useState(false);

  // wagmi things
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (
      day >= coachDataProp.availability.fromDate &&
      day <= coachDataProp.availability.fromDate
    ) {
      setSelectedDate(day);
    } else {
      setSelectedSlot(null);
      setSelectedDate(day);
    }
  };

  const getAllEventsData = async () => {
    let data: any[] = [];
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      data.push(doc.data());
    });
    console.log(data);
    setAllSessionsData(data);
  };

  const uploadEvents = async (data: {}) => {
    const docRef = await addDoc(collection(db, "events"), data);
    console.log("Document written with ID: ", docRef.id);
  };

  useEffect(() => {
    setDomLoaded(true);
    getAllEventsData();
    const dates = extractUniqueDates(allSessionsData);
    console.log(dates);
    setBookedDates(dates);
  }, [isCoachPrivate, isCreatingPrivate]);

  const { toast } = useToast();
  return (
    <div className="bg-zinc-950 min-h-screen text-slate-100">
      <div>
        {/* nav bar */}
        <div className="bg-zinc-950 border-b border-slate-700 h-16 flex items-center justify-between px-4">
          <div className="text-xl font-bold">Huddle02</div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {!isCoachPrivate && (
                <Switch
                  className="bg-zinc-300"
                  size="default"
                  checkedChildren="Create"
                  unCheckedChildren="Dash"
                  checked={isCreatingPrivate}
                  onChange={() => setIsCreatingPrivate(!isCreatingPrivate)}
                />
              )}
              <Switch
                className="bg-zinc-300"
                size="default"
                checkedChildren="Coach"
                unCheckedChildren="Stud"
                checked={isCoachPrivate}
                onChange={() => setIsCoachPrivate(!isCoachPrivate)}
              />
            </div>
            {isConnected && domLoaded ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  disconnect();
                }}
              >
                <MdLogout size={30} />
              </div>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" className="z-10 bg-slate-800">
                    Connect Wallet
                    <RiWallet3Fill size={20} className="ml-2" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-slate-900 border-slate-700">
                  <AlertDialogHeader className="text-slate-100">
                    <AlertDialogTitle>Connect to your wallet</AlertDialogTitle>
                    <AlertDialogDescription>
                      What are wallets? How to connect them? Read more at docs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  {connectors.map((connector) => {
                    return (
                      <button
                        disabled={!connector.ready}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                        className="text-left bg-slate-700 text-slate-100 px-3 rounded py-2"
                      >
                        {connector.name}
                        {isLoading &&
                          connector.id === pendingConnector?.id &&
                          " (connecting)"}
                      </button>
                    );
                  })}
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        {isCoachPrivate ? (
          // coach state
          <div>
            {isConnected && domLoaded && <Coach bookedDates={bookedDates} />}
            {!isConnected && domLoaded && (
              <div className="absolute top-1/2 pt-16 w-full flex justify-center items-center">
                <div>Please connect your wallet</div>
              </div>
            )}
          </div>
        ) : (
          // {/* stud states */}
          <div>
            {/* stud create */}
            {isConnected && domLoaded && isCreatingPrivate ? (
              <div className="p-8 flex flex-col justify-betwee lg:flex-row lg:space-x-8">
                <div className="flex w-full flex-col space-y-4 my-">
                  <div className="text-xl font-bold">Select a date</div>
                  <div className="w-full">
                    <Calendar
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      onDayClick={handleDayClick}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-col space-y-4 my-4">
                  <div className="text-xl font-bold">Pick a time</div>
                  {selectedDate && (
                    <Select
                      onValueChange={(value) => {
                        setSelectedSlot({
                          date: selectedDate,
                          fromHour: parseInt(value),
                          toHour: parseInt(value) + 1,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full text-slate-900 bg-slate-100">
                        <SelectValue
                          color="#020617"
                          placeholder="Select a time slot"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDate >= coachDataProp.availability.fromDate &&
                        selectedDate <= coachDataProp.availability.toDate ? (
                          <SelectGroup>
                            <SelectLabel>Available Slots</SelectLabel>
                            {Array.from(
                              {
                                length:
                                  coachDataProp.availability.toHour -
                                  coachDataProp.availability.fromHour +
                                  1,
                              },
                              (_, index) => {
                                const currentHour =
                                  coachDataProp.availability.fromHour + index;
                                return (
                                  <SelectItem
                                    key={index}
                                    value={currentHour.toString()}
                                  >
                                    Time Slot: {currentHour}:00 -{" "}
                                    {currentHour + 1}
                                    :00
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectGroup>
                        ) : (
                          <SelectGroup>
                            <SelectLabel>No slots are available</SelectLabel>
                            <SelectItem value={"null"}></SelectItem>
                          </SelectGroup>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                  {selectedDate && !!selectedSlot ? (
                    <div>
                      <div className="bg-slate-800 p-4 flex justify-between items-center w-full h-20 rounded-lg">
                        <div className="flex flex-col">
                          <div className="font-bold">
                            {formatDate(selectedDate)}
                          </div>
                          <div className="text-sm">{`${
                            selectedSlot.fromHour
                          }:00 - ${selectedSlot.toHour}:00 (${
                            selectedSlot.toHour - selectedSlot.fromHour
                          } Hour)`}</div>
                        </div>
                        <div>
                          <Button
                            onClick={() => {
                              setSelectedSlot(null);
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                      <div className="my-4">
                        <Label htmlFor="message" className="text-sm">
                          What are your goals for this session? (Optional)
                        </Label>
                        <Textarea
                          className="text-slate-900 bg-slate-100"
                          placeholder="Type your message here."
                          id="message"
                        />
                      </div>
                      <div className="my-4">
                        <Label htmlFor="message" className="text-sm">
                          How often are you able to play the game? (Optional)
                        </Label>
                        <Textarea
                          className="text-slate-900 bg-slate-100"
                          placeholder="Type your message here."
                          id="message"
                        />
                      </div>
                      <div className="w-full flex justify-end items-center">
                        <Button
                          variant={"default"}
                          onClick={async () => {
                            const code = await getRoomCode();
                            const sessionData = {
                              coach: coachDataProp.coach,
                              student: student.name,
                              title: coachDataProp.title,
                              date: selectedSlot.date,
                              fromHour: selectedSlot.fromHour,
                              toHour: selectedSlot.toHour,
                              state: "pending",
                              game: coachDataProp.game,
                              roomCode: code,
                            };
                            uploadEvents(sessionData);

                            // allSessionsData.push(sessionData);
                            console.log(allSessionsData);
                            setIsDoneCreating(true);
                            toast({
                              title: "Scheduled: Catch up",
                              description: `${formatDate(
                                selectedSlot.date
                              )} at ${selectedSlot.fromHour}:00`,
                            });
                          }}
                        >
                          Create session
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : isConnected && domLoaded && !isCreatingPrivate ? (
              //   stud dash
              <div>
                <StudentDash bookedDates={bookedDates} />
              </div>
            ) : (
              <div className="absolute top-1/2 pt-16 w-full flex justify-center items-center">
                <div>Please connect your wallet</div>
              </div>
            )}
          </div>
        )}

        <div></div>
      </div>
    </div>
  );
};

export default Book;

const Coach = ({ bookedDates }: { bookedDates: Date[] }) => {
  const [allSessionsData, setAllSessionsData] = useState<EventType[]>([]);

  // console.log("bookedDates", bookedDates);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const bookedStyle = { border: "1px solid currentColor" };

  const [accessTokenPrivate, setAccessTokenPrivate] = useAtom(accessToken);
  const { address } = useAccount();
  const router = useRouter();

  const { signMessage } = useSignMessage({
    onSuccess: async (data) => {
      const token = await getAccessToken(data, address as string);
      setAccessTokenPrivate(token.accessToken);
    },
  });

  const [dayEvents, setDayEvents] = useState<EventType[]>([]);
  const [roomCodePrivate, setRoomCodePrivate] = useAtom(roomCode);

  const getAllEventsData = async () => {
    let data: any[] = [];
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      // console.log(doc.data().date.toDate());
      data.push(doc.data());
    });
    console.log(data);
    setAllSessionsData(data);
  };

  const handleDayClick: DayClickEventHandler = (day, index) => {
    setAccessTokenPrivate("");
    console.log(allSessionsData, day);
    const a = filterSessionsByDate(allSessionsData, day);
    console.log(a);
    setDayEvents(a);
  };

  // useEffect(() => {
  //   console.log(allSessionsData, selectedDate);
  //   const a = filterSessionsByDate(allSessionsData, selectedDate);

  //   setDayEvents(a);
  // }, [selectedDate, allSessionsData]);

  useEffect(() => {
    getAllEventsData();
  }, []);

  useEffect(() => {
    if (accessTokenPrivate !== "") {
      router.push("/session");
    }
  }, [accessTokenPrivate]);

  return (
    <div>
      <div className="p-8 flex space-y-8 flex-col lg:space-y-0 lg:space-x-8 lg:flex-row justify-between">
        <div className="flex flex-col w-full space-y-4">
          <div className="text-xl font-bold">Hi, {coach.name}</div>
          <Calendar
            // defaultMonth={new Date(2023, 10, 8)}
            modifiers={{ booked: bookedDates }}
            selected={selectedDate}
            onSelect={(date: Date | undefined) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
            modifiersStyles={{ booked: bookedStyle }}
            onDayClick={handleDayClick}
          />
        </div>
        <div className="flex flex-col w-full space-y-4">
          <div className="text-xl font-bold">Your Sessions</div>
          <div className="h-96 shrink-0 bg-slate-800 flex flex-col rounded-lg p-4 overflow-y-auto">
            {dayEvents.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {dayEvents.map((event, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-slate-600 w-full p-4 rounded-md flex justify-between items-center"
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex text-sm items-center space-x-2">
                          <div className="bg-slate-800 px-3 py-1 rounded-full text-sm capitalize">
                            {event.state}
                          </div>
                          <div>{formatDate(event.date.toDate())}</div>
                        </div>
                        <div className="text-xl font-bold">{event.title}</div>
                        <div className="flex text-sm space-x-2">
                          <div>{`${event.fromHour}:00 - ${event.toHour}:00 ,`}</div>
                          <div>{event.game}</div>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={async () => {
                          handleSignClick(getMessage, address, signMessage);
                          setRoomCodePrivate(event.roomCode);
                        }}
                      >
                        <SiGooglemeet size={35} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                No meetings today!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDash = ({ bookedDates }: { bookedDates: Date[] }) => {
  const [allSessionsData, setAllSessionsData] = useState<EventType[]>([]);

  // console.log("bookedDates", bookedDates);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const bookedStyle = { border: "1px solid currentColor" };

  const [accessTokenPrivate, setAccessTokenPrivate] = useAtom(accessToken);
  const { address } = useAccount();
  const router = useRouter();

  const { signMessage } = useSignMessage({
    onSuccess: async (data) => {
      const token = await getAccessToken(data, address as string);
      setAccessTokenPrivate(token.accessToken);
    },
  });

  const [dayEvents, setDayEvents] = useState<EventType[]>([]);
  const [roomCodePrivate, setRoomCodePrivate] = useAtom(roomCode);

  const getAllEventsData = async () => {
    let data: any[] = [];
    const querySnapshot = await getDocs(collection(db, "events"));
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    console.log(data);
    setAllSessionsData(data);
  };

  const handleDayClick: DayClickEventHandler = (day, index) => {
    setAccessTokenPrivate("");
    console.log(allSessionsData, day);
    const a = filterSessionsByDate(allSessionsData, day);
    console.log(a);
    setDayEvents(a);
  };

  useEffect(() => {
    getAllEventsData();
  }, []);

  useEffect(() => {
    if (accessTokenPrivate !== "") {
      router.push("/session");
    }
  }, [accessTokenPrivate]);

  return (
    <div>
      <div className="p-8 flex space-y-8 flex-col lg:space-y-0 lg:space-x-8 lg:flex-row justify-between">
        <div className="flex flex-col w-full space-y-4">
          <div className="text-xl font-bold">Hi, {student.name}</div>
          <Calendar
            // defaultMonth={new Date(2023, 10, 8)}
            modifiers={{ booked: bookedDates }}
            selected={selectedDate}
            onSelect={(date: Date | undefined) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
            modifiersStyles={{ booked: bookedStyle }}
            onDayClick={handleDayClick}
          />
        </div>
        <div className="flex flex-col w-full space-y-4">
          <div className="text-xl font-bold">Your Sessions</div>
          <div className="h-96 shrink-0 bg-slate-800 flex flex-col rounded-lg p-4 overflow-y-auto">
            {dayEvents.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {dayEvents.map((event, index) => {
                  return (
                    <div
                      key={index}
                      className="bg-slate-600 w-full p-4 rounded-md flex justify-between items-center"
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex text-sm items-center space-x-2">
                          <div className="bg-slate-800 px-3 py-1 rounded-full text-sm capitalize">
                            {event.state}
                          </div>
                          <div>{formatDate(event.date.toDate())}</div>
                        </div>
                        <div className="text-xl font-bold">{event.title}</div>
                        <div className="flex text-sm space-x-2">
                          <div>{`${event.fromHour}:00 - ${event.toHour}:00 ,`}</div>
                          <div>{event.game}</div>
                        </div>
                      </div>
                      <div
                        className="cursor-pointer"
                        onClick={async () => {
                          handleSignClick(getMessage, address, signMessage);
                          setRoomCodePrivate(event.roomCode);
                        }}
                      >
                        <SiGooglemeet size={35} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                No meetings today!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
