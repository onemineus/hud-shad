"use client";
import { useState, useEffect, useRef } from "react";
import {
  useConnect,
  useEnsName,
  useAccount,
  useDisconnect,
  useSignMessage,
} from "wagmi";
import { Input } from "@/components/ui/input";
import { getAccessToken, getMessage } from "@huddle01/auth";
import NavBar from "./navBar";
import { useAtom } from "jotai";
import { accessToken, isCoach } from "@/lib/jotai/atoms";
import {
  useHuddle01,
  useLobby,
  useAudio,
  useVideo,
  useRoom,
  usePeers,
  useScreenShare,
} from "@huddle01/react/hooks";
import { Button } from "./ui/button";
import { Audio, Video } from "@huddle01/react/components";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi";
import {
  BsCameraVideoOffFill,
  BsCameraVideoFill,
  BsPlusCircle,
} from "react-icons/bs";
import AudioElement from "./audioElement";
import VideoElement from "./videoElement";
import { IoCreateOutline } from "react-icons/io5";
import CalenderElement from "./calenderElement";
import { Event, coach, eventsList, student } from "@/lib/db/simpleStorage";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const Hud = () => {
  // zol - zgry - ymj
  const [date, setDate] = useState<Date>();
  const [forCoach, setForCoach] = useState<Event[]>([]);
  const [forStud, setForStud] = useState<Event[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [isCoachPrivate, setIsCoachPrivate] = useAtom(isCoach);
  const [domLoaded, setDomLoaded] = useState(false);
  const [accessTokenPrivate, setAccessTokenPrivate] = useAtom(accessToken);
  const { initialize, isInitialized, roomState, me } = useHuddle01();
  const { isConnected, address } = useAccount();
  const { joinLobby, leaveLobby } = useLobby();
  const { joinRoom, leaveRoom, endRoom, lobbyPeers } = useRoom();
  const [roomCode, setRoomCode] = useState("zol-zgry-ymj");
  const { peers } = usePeers();
  const { signMessage } = useSignMessage({
    onSuccess: async (data) => {
      const token = await getAccessToken(data, address as string);
      setAccessTokenPrivate(token.accessToken);
    },
  });

  const {
    fetchAudioStream,
    stream: audioStream,
    isProducing: isProducingAudio,
    stopAudioStream,
    error: micError,
    produceAudio,
    stopProducingAudio,
  } = useAudio();
  const {
    isProducing: isProducingVideo,
    fetchVideoStream,
    stream: videoStream,
    stopVideoStream,
    error: camError,
    produceVideo,
    stopProducingVideo,
  } = useVideo();

  const {
    fetchScreenShare,
    produceScreenShare,
    stopScreenShare,
    stopProducingScreenShare,
    stream: screenShareStream,
    isScreenShareOn,
  } = useScreenShare();

  const handleDataForThem = () => {
    const dataForStud = eventsList.filter(
      (event) => event.student === student.name
    );
    const dataForCoach = eventsList.filter(
      (event) => event.coach === coach.name
    );
    console.log(dataForStud, dataForCoach);
    setForStud(dataForStud);
    setForCoach(dataForCoach);
  };

  useEffect(() => {
    if (screenShareStream && screenRef.current)
      screenRef.current.srcObject = screenShareStream;
  }, [screenShareStream, fetchScreenShare]);

  useEffect(() => {
    setDomLoaded(true);
    if (process.env.NEXT_PUBLIC_PROJECT_ID) {
      initialize(process.env.NEXT_PUBLIC_PROJECT_ID);
    }
    handleDataForThem(); 
  }, [isCoachPrivate]);

  useEffect(() => {
    if (videoStream && videoRef?.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [fetchVideoStream]);

  return (
    <div className="bg-zinc-200 text-zinc-900 min-h-screen relative">
      <NavBar />
      <div className="pt-20 px-6">
        {isCoachPrivate ? (
          <>
            <div>Hi, {coach.name} </div>
            <div className="w-full mt-4">
              <CalenderElement
                getMessage={getMessage}
                signMessage={signMessage}
                address={address}
                eventsData={forCoach}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <div> Hi, {student.name} </div>
              <Sheet>
                <SheetTrigger className="flex space-x-1">
                  <div className="capitalize">create</div>{" "}
                  <IoCreateOutline size={20} />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                    <SheetDescription>
                      Creating a mock event with mock data
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-20">
                    <div>Please choose the date</div>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="w-full mt-4">
              <CalenderElement
                getMessage={getMessage}
                signMessage={signMessage}
                address={address}
                eventsData={forStud}
              />
            </div>
          </>
        )}
        {/*lobby state */}
        {accessTokenPrivate !== "" && (
          <div className="flex w-full mt-4 space-x-4 justify-between items-center bg-zinc-300 p-4 rounded-lg">
            <div>Are you ready to join the meeting?</div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={!joinLobby.isCallable}
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => {
                    console.log(roomCode, accessTokenPrivate);
                    joinLobby(roomCode, accessTokenPrivate);
                  }}
                >
                  Join Lobby
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>You are inside the lobby!</AlertDialogTitle>
                  <AlertDialogDescription>
                    Check for camera and mic settings and enter the room.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-between bg-zinc-100 rounded px-3 py-2 items-center">
                  <div>Turn on camera stream</div>
                  <div>
                    <Switch
                      onCheckedChange={(value) => {
                        value ? fetchVideoStream() : stopVideoStream();
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between bg-zinc-100 rounded px-3 py-2 items-center">
                  <div>Turn on microphone stream</div>
                  <div>
                    <Switch
                      onCheckedChange={(value) => {
                        value ? fetchAudioStream() : stopAudioStream();
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-between bg-zinc-100 rounded px-3 py-2 items-center">
                  <div>Turn on screen share</div>
                  <div>
                    <Switch
                      onCheckedChange={(value) => {
                        value ? fetchScreenShare() : stopScreenShare();
                      }}
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={leaveLobby}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={!joinRoom.isCallable}
                    onClick={joinRoom}
                  >
                    Join Room
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        {/* room state */}
        {roomState === "ROOM" && (
          <div className="flex bg-zinc-300 p-4 rounded-md justify-between items-center mt-4">
            <div>Total Participants - {Object.keys(peers).length + 1}</div>
            <Button variant={"secondary"} onClick={leaveRoom}>
              Leave Room
            </Button>
          </div>
        )}
        {/* me video */}
        {roomState === "ROOM" && (
          <div className="relative text-zinc-100 mt-4 bg-zinc-800 aspect-video rounded-lg w-96 overflow-hidden">
            {/* <div className="h-full w-full flex items-center justify-center text-xs">
              No video
            </div> */}
            <video
              className="absolute w-full top-1/2 -translate-y-1/2"
              ref={videoRef}
              autoPlay
            />
            <div className="absolute bottom-2 left-3 right-3 flex justify-between">
              <div className="capitalize">me</div>
              <div className="flex space-x-2">
                {!isProducingAudio ? (
                  <BiSolidMicrophoneOff
                    size={20}
                    onClick={() => {
                      if (audioStream) {
                        produceAudio(audioStream);
                      }
                    }}
                  />
                ) : (
                  <BiSolidMicrophone
                    size={20}
                    onClick={() => {
                      stopProducingAudio();
                    }}
                  />
                )}
                {!isProducingVideo ? (
                  <BsCameraVideoOffFill
                    size={20}
                    onClick={() => {
                      produceVideo(videoStream);
                    }}
                  />
                ) : (
                  <BsCameraVideoFill
                    size={20}
                    onClick={() => {
                      stopProducingVideo();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
        {/* peer video */}
        {roomState === "ROOM" && (
          <div className="my-4 flex space-x-4">
            {Object.values(peers).map(
              (
                { cam, peerId, avatarUrl, shareVideo, shareAudio, displayName },
                i
              ) => (
                <>
                  {shareVideo && (
                    <VideoElement
                      displayName={displayName}
                      key={`screen-video-${peerId}`}
                      track={shareVideo}
                    />
                  )}
                  {shareAudio && (
                    <AudioElement
                      key={`screen-audio-${peerId}`}
                      track={shareAudio}
                    />
                  )}
                  {cam && (
                    <VideoElement
                      displayName={displayName}
                      key={`cam-${peerId}`}
                      track={cam}
                    />
                  )}
                </>
              )
            )}
            {Object.values(peers).map(({ mic, peerId }, i) => (
              <>{mic && <AudioElement key={`mic-${peerId}`} track={mic} />}</>
            ))}
          </div>
        )}
        {/* stream video */}
        {!fetchScreenShare.isCallable && (
          <div>
            <div className="flex justify-between bg-zinc-300 p-4 rounded-lg items-center">
              <div>Want to share your screen? </div>
              <Button
                // disabled={produceScreenShare.isCallable}
                variant={"secondary"}
                onClick={() => {
                  if (isSharingScreen) {
                    stopProducingScreenShare();
                    setIsSharingScreen(false);
                  } else {
                    produceScreenShare(screenShareStream);
                    setIsSharingScreen(true);
                  }
                }}
              >
                {isSharingScreen ? "Stop Sharing" : "Start Sharing"}
              </Button>
            </div>
            <div className="py-4">
              {isSharingScreen && (
                <div className="relative bg-zinc-800 aspect-video rounded-lg w-96 overflow-hidden">
                  <video
                    className="absolute w-full top-1/2 -translate-y-1/2"
                    ref={screenRef}
                    autoPlay
                    muted
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hud;
