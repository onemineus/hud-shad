"use client";

import { accessToken, roomCode } from "@/lib/jotai/atoms";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";
import { IoMicOffOutline } from "react-icons/io5";
import { IoMicOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { IoVideocamOffOutline } from "react-icons/io5";
import { MdOutlineScreenShare } from "react-icons/md";
import { MdOutlineStopScreenShare } from "react-icons/md";
import { PiDotsThreeOutlineVerticalLight } from "react-icons/pi";
import {
  useHuddle01,
  useLobby,
  useAudio,
  useVideo,
  useRoom,
  usePeers,
  useScreenShare,
} from "@huddle01/react/hooks";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Represents a page in a video conferencing application.
 *
 * Example Usage:
 * ```javascript
 * import React from "react";
 * import Page from "./Page";
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <Page />
 *     </div>
 *   );
 * };
 *
 * export default App;
 * ```
 *
 * Inputs: None
 *
 * Flow:
 * 1. The component initializes the necessary variables and hooks, such as the router, access token, and various state variables.
 * 2. It uses the `useEffect` hook to handle side effects when the access token or room state changes.
 * 3. The component fetches audio and video streams using the `useAudio` and `useVideo` hooks, and updates the state accordingly.
 * 4. It sets up a video reference using the `useRef` hook to display the local video stream.
 * 5. The component updates the peer video reference when the peers state changes, and displays the first peer's video stream.
 * 6. The component renders different UI elements based on the room state, such as the lobby or the room itself.
 * 7. It handles user interactions, such as enabling/disabling audio and video, joining/leaving the room, and screen sharing.
 * 8. The component uses the `ToastContainer` component from the `react-toastify` library to display toast notifications.
 *
 * Outputs: The rendered page component.
 */
const Page = () => {
  const router = useRouter();
  const [accessTokenPrivate, setAccessTokenPrivate] = useAtom(accessToken);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
  const [isPeerMuted, setIsPeerMuted] = useState(false);
  const { joinLobby, leaveLobby } = useLobby();
  const [roomCodePrivate, setRoomCodePrivate] = useAtom(roomCode);
  const { initialize, isInitialized, roomState, me } = useHuddle01();
  const { joinRoom, leaveRoom, endRoom, lobbyPeers } = useRoom();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerMicRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const { peers } = usePeers();

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

  useEffect(() => {
    if (accessTokenPrivate === "") {
      setAccessTokenPrivate("");
      router.push("/");
    }
    if (process.env.NEXT_PUBLIC_PROJECT_ID && roomState === "IDLE") {
      initialize(process.env.NEXT_PUBLIC_PROJECT_ID);
    }
    if (roomState === "INIT") {
      joinLobby.isCallable && joinLobby(roomCodePrivate, accessTokenPrivate);
    }
    if (roomState === "ROOM") {
    }
  }, [accessTokenPrivate, roomState]);

  useEffect(() => {
    if (isVideoEnabled) {
      produceVideo(videoStream);
    } else {
      stopProducingVideo();
    }
    if (isMicEnabled) {
      if (audioStream) {
        produceAudio(audioStream);
      }
    } else {
      if (audioStream) {
        stopProducingAudio();
      }
    }
  }, [isVideoEnabled, isMicEnabled]);

  useEffect(() => {
    if (videoStream && videoRef?.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [fetchVideoStream]);

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  useEffect(() => {
    console.log(peers);
    if (peers) {
      const val = peers[Object.keys(peers)[0]];
      if (peerVideoRef.current && val?.cam) {
        console.log("working");
        peerVideoRef.current.srcObject = getStream(val.cam);
        peerVideoRef.current.onloadedmetadata = async () => {
          console.warn("videoCard() | Metadata loaded...");
          try {
            if (peerVideoRef.current) {
              peerVideoRef.current.muted = true;
              await peerVideoRef.current.play();
            }
          } catch (error) {
            console.error(error);
          }
        };
        peerVideoRef.current.onerror = () => {
          console.error("videoCard() | Error is hapenning...");
        };
      }
      if (peerMicRef.current && val?.mic) {
        peerMicRef.current.srcObject = getStream(val.mic);
        peerMicRef.current.onloadedmetadata = async () => {
          console.warn("audioCard() | Metadata loaded...");
          try {
            if (peerMicRef.current) {
              await peerMicRef.current.play();
            }
          } catch (error) {
            console.error(error);
          }
        };
        peerMicRef.current.onerror = () => {
          console.error("audioCard() | Error is hapenning...");
        };
      }
    }
  }, [peers]);

  return (
    <div className="relative min-h-screen">
      <div className="h-16 w-full absolute border-b border-zinc-800 top-0 bg-zinc-950 flex items-center px-6 text-slate-100 justify-between">
        <div
          className="text-xl font-bold"
          onClick={() => {
            router.push("/");
          }}
        >
          Huddle02
        </div>
        <div className="text-sm">something</div>
      </div>
      {/* <div className="text-zinc-900 pt-16">{roomState}</div> */}
      {/* lobby */}
      {roomState === "LOBBY" && (
        <div className="bg-zinc-950 w-full h-screen pt-20 p-4">
          <div className="bg-bg-900 w-full h-full flex-col flex items-center ">
            <div className="aspect-video relative w-[45vw] bg-black mt-36 rounded-xl">
              <video
                autoPlay={true}
                ref={videoRef}
                // src={"./two.mp4"}
                className="h-full absolute w-full object-cover rounded-lg"
              />
              <div className="absolute text-zinc-100 backdrop-blur-md bottom-4 left-4 bg-zinc-800 bg-opacity-20 rounded-lg px-3 py-2">
                {"You"}
              </div>
            </div>
            <div className="flex mt-2 text-zinc-100 items-center space-x-4 p-4">
              {/* mic */}
              {!isMicEnabled ? (
                <div
                  onClick={() => {
                    setIsMicEnabled(!isMicEnabled);
                    fetchAudioStream();
                  }}
                  className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                >
                  <IoMicOffOutline className="h-full w-full" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setIsMicEnabled(!isMicEnabled);
                    stopAudioStream();
                  }}
                  className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                >
                  <IoMicOutline className="h-full w-full" />
                </div>
              )}

              {/* video */}
              {!isVideoEnabled ? (
                <div
                  onClick={() => {
                    setIsVideoEnabled(!isVideoEnabled);
                    fetchVideoStream();
                  }}
                  className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                >
                  <IoVideocamOffOutline className="h-full w-full" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setIsVideoEnabled(!isVideoEnabled);
                    stopVideoStream();
                  }}
                  className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                >
                  <IoVideocamOutline className="h-full w-full" />
                </div>
              )}
              <Button
                disabled={!joinRoom.isCallable}
                onClick={() => {
                  joinRoom();
                }}
                className="bg-sky-700 px-3 py-2 cursor-pointer rounded-lg text-xs capitalize"
              >
                join meet
              </Button>
            </div>
            <div className="text-zinc-100 text-xl">Ready to join?</div>
            <div
              className="text-zinc-100 text-xs cursor-pointer"
              onClick={() => {
                setIsMicEnabled(false);
                setIsVideoEnabled(false);
                leaveLobby();
                setAccessTokenPrivate("");
              }}
            >
              go back
            </div>
          </div>
        </div>
      )}
      {/* room */}
      {roomState === "ROOM" && (
        <div className="h-screen bg-gray-950 pt-16 text-slate-100">
          <div className="bg-pink-950 grid grid-cols-3 h-full rounded-lg">
            <div className="bg-zinc-950 col-span-2 space-y-4 h-full flex flex-col p-4">
              <div className="bg-zinc-900 rounded-xl h-full w-full p-0">
                <div className="bg-gray-800 relative h-full w-full rounded-xl overflow-hidden">
                  {/* peer video */}
                  <div>
                    <video
                      autoPlay={true}
                      ref={peerVideoRef}
                      className="h-full w-full absolute object-cover rounded-xl"
                    />
                    <audio ref={peerMicRef}>Audio</audio>
                    <div className="absolute backdrop-blur-md bottom-4 left-4 bg-zinc-800 bg-opacity-20 rounded-lg px-3 py-2">
                      {"Narendra Modi"}
                    </div>
                  </div>
                  <div className="absolute backdrop-blur-md bottom-4 right-4 bg-zinc-800 bg-opacity-20 rounded-full p-1">
                    {isPeerMuted ? (
                      <div
                        onClick={() => {
                          setIsPeerMuted(!isPeerMuted);
                        }}
                        className="bg-orange-70 cursor-pointer p-2 h-9 w-9 rounded"
                      >
                        <IoMicOffOutline className="h-full w-full" />
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setIsPeerMuted(!isPeerMuted);
                        }}
                        className="bg-zinc-70 cursor-pointer p-2 h-9 w-9 rounded"
                      >
                        <IoMicOutline className="h-full w-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 px-6 justify-between h-20 w-full rounded-xl flex items-center">
                <div className="bg-zinc-700 space-x-2 px-3 items-center rounded-lg py-2 flex">
                  <div className="text-xs">{roomCodePrivate}</div>
                  <div className="w-[1px] h-4 bg-zinc-500"></div>
                  <div className="cursor-pointer">
                    <IoCopyOutline />
                  </div>
                </div>
                <div className="flex space-x-4 items-center">
                  {/* mic */}
                  {!isMicEnabled ? (
                    <div
                      onClick={() => {
                        setIsMicEnabled(!isMicEnabled);
                      }}
                      className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <IoMicOffOutline className="h-full w-full" />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setIsMicEnabled(!isMicEnabled);
                      }}
                      className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <IoMicOutline className="h-full w-full" />
                    </div>
                  )}
                  {/* video */}
                  {!isVideoEnabled ? (
                    <div
                      onClick={() => {
                        setIsVideoEnabled(!isVideoEnabled);
                      }}
                      className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <IoVideocamOffOutline className="h-full w-full" />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setIsVideoEnabled(!isVideoEnabled);
                      }}
                      className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <IoVideocamOutline className="h-full w-full" />
                    </div>
                  )}
                  {/* screen share */}
                  {!isScreenShareEnabled ? (
                    <div
                      onClick={() => {
                        setIsScreenShareEnabled(!isScreenShareEnabled);
                      }}
                      className="bg-orange-700 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <MdOutlineStopScreenShare className="h-full w-full" />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setIsScreenShareEnabled(!isScreenShareEnabled);
                      }}
                      className="bg-zinc-700 cursor-pointer p-2 h-9 w-9 rounded"
                    >
                      <MdOutlineScreenShare className="h-full w-full" />
                    </div>
                  )}
                  {/* menu */}
                  <div
                    onClick={() => {}}
                    className="bg-sky-600 cursor-pointer p-2 h-9 w-9 rounded"
                  >
                    <PiDotsThreeOutlineVerticalLight className="h-full w-full" />
                  </div>
                </div>
                <div
                  onClick={() => {
                    leaveRoom();
                  }}
                  className="bg-orange-700 px-3 py-2 cursor-pointer rounded-lg text-xs capitalize"
                >
                  leave meet
                </div>
              </div>
            </div>
            <div className="bg-zinc-950 flex flex-col space-y-4 h-full col-span-1 p-4 border-l border-zinc-800">
              <div className="w-full bg-zinc-900 aspect-video rounded-xl p-4">
                <div className="w-full relative aspect-video rounded-lg">
                  <video
                    autoPlay={true}
                    ref={videoRef}
                    className="h-full absolute w-full object-cover rounded-lg"
                  />
                  <div className="absolute backdrop-blur-md bottom-4 left-4 bg-zinc-800 bg-opacity-20 rounded-lg px-3 py-2">
                    {"You"}
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 w-full flex flex-col space-y-4 h-full p-4 rounded-xl">
                <div className="bg-sky-600 w-full space-x-2 p-4 px-4 rounded-lg f flex items-center">
                  <div className="capitalize font-semibold">participants</div>
                  <div className="bg-sky-700 text-center w-5 rounded">{2}</div>
                </div>
                <div className="bg-zinc-700 px-4 w-full h-14 rounded-lg flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img
                      src="./two.png"
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="text-zinc-100 text-xs font-semibold">
                        {"You"}
                      </div>
                      <div className="text-zinc-400 text-xs">
                        {"0x4432ds5t...4E8Bf7"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded-full p-1 cursor-pointer">
                    <PiDotsThreeOutlineVerticalLight />
                  </div>
                </div>
                <div className="bg-zinc-700 px-4 w-full h-14 rounded-lg flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img
                      src="./one.png"
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="text-zinc-100 text-xs font-semibold">
                        {"Narendra Modi"}
                      </div>
                      <div className="text-zinc-400 text-xs">
                        {"0x4E8Bfs5t...74432d"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-zinc-900 rounded-full p-1 cursor-pointer">
                    <PiDotsThreeOutlineVerticalLight />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Page;
